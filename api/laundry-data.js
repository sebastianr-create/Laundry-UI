const { google } = require('googleapis');

// Google Sheets Configuration
const FOLDER_ID = process.env.FOLDER_ID || '19D6nBJi6Z08VR7LeLfmy6w6P-2hMAOl2';
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.readonly'
];

// Initialize Google Auth
let auth;
try {
    const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT 
        ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
        : null;
    
    if (serviceAccount) {
        auth = new google.auth.GoogleAuth({
            credentials: serviceAccount,
            scopes: SCOPES
        });
    }
} catch (error) {
    console.error('Error loading service account:', error.message);
}

// Helper function to clean numeric values
function cleanNumericValue(value) {
    if (!value) return 0;
    const str = String(value).replace(/\./g, '').replace(/,/g, '.');
    if (str.includes('#') || !str.trim()) return 0;
    try {
        return parseInt(parseFloat(str));
    } catch {
        return 0;
    }
}

// Helper function to find column indices
function findColumns(headerRow) {
    const cleanRow = headerRow.map(cell => 
        String(cell).toLowerCase().trim().replace(/\s+/g, ' ')
    );
    
    let itemCol = -1;
    let qtyCol = -1;
    
    cleanRow.forEach((cell, idx) => {
        if (cell.includes('prenda') || cell.includes('articulo') || cell.includes('tipo de prenda')) {
            itemCol = idx;
        }
        if (cell.includes('reposici') || cell.includes('pedido')) {
            qtyCol = idx;
        }
    });
    
    return { itemCol, qtyCol };
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (!auth) {
            throw new Error('Service account not configured');
        }

        const drive = google.drive({ version: 'v3', auth });
        const sheets = google.sheets({ version: 'v4', auth });
        
        // Get all spreadsheet files from the folder
        const filesResponse = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.spreadsheet'`,
            fields: 'files(id, name)'
        });
        
        const files = filesResponse.data.files || [];
        const allData = [];
        
        // Process each file that contains "2026"
        for (const file of files) {
            if (!file.name.includes('2026')) continue;
            
            try {
                // Extract city name from filename
                const cityName = file.name
                    .replace('Lavandería ', '')
                    .replace(' 2026', '')
                    .replace('Copy of ', '')
                    .trim();
                
                // Get all sheets in the spreadsheet
                const spreadsheet = await sheets.spreadsheets.get({
                    spreadsheetId: file.id
                });
                
                const allSheets = spreadsheet.data.sheets || [];
                
                // Process each sheet
                for (const sheet of allSheets) {
                    const sheetTitle = sheet.properties.title;
                    
                    // Skip certain sheets (removed breezewaydata and info apt from ignore list)
                    const ignoreSheets = ['formulas', 'export', 'articulos', 'final', 'data base laundry'];
                    if (ignoreSheets.some(s => sheetTitle.toLowerCase().includes(s))) {
                        continue;
                    }
                    
                    try {
                        // Read sheet data
                        const sheetData = await sheets.spreadsheets.values.get({
                            spreadsheetId: file.id,
                            range: `${sheetTitle}!A1:Z100`
                        });
                        
                        const rows = sheetData.data.values || [];
                        if (rows.length === 0) continue;
                        
                        // Find header row and columns
                        let headerIdx = -1;
                        let columns = { itemCol: -1, qtyCol: -1 };
                        
                        for (let i = 0; i < rows.length; i++) {
                            columns = findColumns(rows[i]);
                            if (columns.itemCol !== -1 && columns.qtyCol !== -1) {
                                headerIdx = i;
                                break;
                            }
                        }
                        
                        if (headerIdx === -1) continue;
                        
                        // Process data rows
                        for (let i = headerIdx + 1; i < rows.length; i++) {
                            const row = rows[i];
                            if (row.length <= Math.max(columns.itemCol, columns.qtyCol)) continue;
                            
                            const itemName = String(row[columns.itemCol] || '').trim();
                            const qtyRaw = row[columns.qtyCol];
                            
                            if (!itemName || itemName.toLowerCase().includes('total')) continue;
                            
                            const qty = cleanNumericValue(qtyRaw);
                            
                            // Now we include ALL items, even with qty = 0
                            allData.push({
                                item: itemName,
                                qty: qty,
                                ciudad: cityName,
                                building: sheetTitle,
                                responsable: sheetTitle,
                                fecha: new Date().toISOString().split('T')[0]
                            });
                        }
                        
                    } catch (sheetError) {
                        console.error(`Error processing sheet ${sheetTitle}:`, sheetError.message);
                    }
                }
                
            } catch (fileError) {
                console.error(`Error processing file ${file.name}:`, fileError.message);
            }
        }
        
        res.status(200).json({
            success: true,
            data: allData,
            totalRecords: allData.length,
            filesProcessed: files.filter(f => f.name.includes('2026')).length
        });
        
    } catch (error) {
        console.error('Error in API:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


Update to show 0 quantities and read BreezewayDATA
