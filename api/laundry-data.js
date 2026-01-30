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

// Convierte DD/MM/YYYY a un número (timestamp) para comparar fácilmente
function parseSpanishDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string' || !dateStr.includes('/')) return null;
    const [day, month, year] = dateStr.split('/');
    // Usamos mediodía (12:00) para evitar problemas de saltos de zona horaria
    return new Date(year, month - 1, day, 12, 0, 0).getTime();
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ error: 'Faltan fechas' });

    // Convertir parámetros de la UI (YYYY-MM-DD) a timestamps
    const start = new Date(startDate + "T12:00:00").getTime();
    const end = new Date(endDate + "T12:00:00").getTime();

    try {
        const sheets = google.sheets({ version: 'v4', auth });

        // Traemos los datos
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
            const aptoName = row[2] ? row[2].trim() : null; // Columna C
            if (!aptoName) return;
            
            configMap[aptoName] = {};
            // Artículos desde Columna L (índice 11)
            for (let j = 11; j < row.length; j++) {
                const itemName = headersConfig[j] ? headersConfig[j].trim() : null;
                if (itemName) {
                    const val = String(row[j]).replace(/[$.]/g, '').replace(',', '.');
                    configMap[aptoName][itemName] = Math.ceil(parseFloat(val)) || 0;
                }
            }
        });

        const listaAptosConfig = Object.keys(configMap);

        // 2. PROCESAR TAREAS (BreezwayData)
        const pedidoPorEdificio = {};

        tasks.slice(1).forEach(row => {
            const building = row[0] ? row[0].trim() : "Sin Edificio";
            const type = row[7] || "";      // Columna H
            const fullNameBreezway = row[11] || ""; // Columna L
            const dateStr = row[30];        // Columna AE (Índice 30)

            const completedTimestamp = parseSpanishDate(dateStr);

            // Filtro de fecha y tipo de limpieza
            if (completedTimestamp && completedTimestamp >= start && completedTimestamp <= end && 
               (type.includes("Co") || type.includes("Refresh"))) {
                
                if (!pedidoPorEdificio[building]) pedidoPorEdificio[building] = {};
                
                // Fuzzy Match para encontrar el apto
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
        Object.keys(pedidoPorEdificio).sort().forEach(edificio => {
            Object.keys(pedidoPorEdificio[edificio]).forEach(articulo => {
                const qty = pedidoPorEdificio[edificio][articulo];
                if (qty > 0) {
                    result.push({
                        building: edificio,
                        item: articulo,
                        qty: qty,
                        periodo: `${startDate} / ${endDate}`
                    });
                }
            });
        });

        res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};
