const { google } = require('googleapis');

const SPREADSHEET_ID = '1_doIECbdpXUldPaw9PkZzdRxkN5mArobtFum2zKQ20s';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

let auth;
try {
    const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT) : null;
    if (serviceAccount) {
        auth = new google.auth.GoogleAuth({ credentials: serviceAccount, scopes: SCOPES });
    }
} catch (error) { console.error('Error Auth:', error.message); }

// Función para convertir DD/MM/YYYY a objeto Date comparable
function parseSpanishDate(dateStr) {
    if (!dateStr || !dateStr.includes('/')) return null;
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ error: 'Faltan fechas' });

    // Convertir parámetros de la UI a Date (Asumiendo que la UI envía YYYY-MM-DD)
    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
        const sheets = google.sheets({ version: 'v4', auth });

        const [tasksRes, configRes] = await Promise.all([
            sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'BreezwayData!A:AE' }),
            sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'Apartamentos_Config!A:U' })
        ]);

        const tasks = tasksRes.data.values || [];
        const configs = configRes.data.values || [];

        // 1. MAPEAR CONFIGURACIÓN (Apartamentos_Config)
        const configMap = {};
        const headersConfig = configs[0];
        configs.slice(1).forEach(row => {
            const aptoName = row[2]; // Columna C
            if (!aptoName) return;
            configMap[aptoName] = {};
            for (let j = 11; j < row.length; j++) { // Desde Columna L
                const itemName = headersConfig[j];
                if (itemName) configMap[aptoName][itemName] = parseInt(row[j]) || 0;
            }
        });

        const listaAptosConfig = Object.keys(configMap);

        // 2. PROCESAR TAREAS (BreezwayData)
        const pedidoPorEdificio = {};

        tasks.slice(1).forEach(row => {
            const building = row[0];        // Columna A
            const type = row[7] || "";      // Columna H
            const fullNameBreezway = row[11] || ""; // Columna L
            const dateStr = row[30];        // Columna AE (Índice 30)

            const completedDate = parseSpanishDate(dateStr);

            // Filtro de fecha y tipo
            if (completedDate && completedDate >= start && completedDate <= end && 
               (type.includes("Co") || type.includes("Refresh"))) {
                
                if (!pedidoPorEdificio[building]) pedidoPorEdificio[building] = {};
                
                const matchedApto = listaAptosConfig.find(nombreCorto => 
                    fullNameBreezway.toLowerCase().includes(nombreCorto.toLowerCase())
                );

                if (matchedApto) {
                    const itemsApto = configMap[matchedApto];
                    Object.keys(itemsApto).forEach(art => {
                        pedidoPorEdificio[building][art] = (pedidoPorEdificio[building][art] || 0) + itemsApto[art];
                    });
                }
            }
        });

        // 3. FORMATO FINAL
        const result = [];
        Object.keys(pedidoPorEdificio).forEach(edificio => {
            Object.keys(pedidoPorEdificio[edificio]).forEach(articulo => {
                result.push({
                    building: edificio,
                    item: articulo,
                    qty: pedidoPorEdificio[edificio][articulo],
                    periodo: `${startDate} / ${endDate}`
                });
            });
        });

        res.status(200).json({ success: true, data: result });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
