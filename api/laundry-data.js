const { google } = require('googleapis');

// Google Sheets Configuration
const SPREADSHEET_ID = '1_doIECbdpXUldPaw9PkZzdRxkN5mArobtFum2zKQ20s';
const SHEET_NAME = 'Pedidos Reposicion';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

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
        const parsed = parseInt(parseFloat(str));
        return isNaN(parsed) ? 0 : parsed;
    } catch {
        return 0;
    }
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

        const sheets = google.sheets({ version: 'v4', auth });
        
        // Read the entire sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:Z`
        });
        
        const rows = response.data.values || [];
        
        if (rows.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                totalRecords: 0,
                message: 'No data found in sheet'
            });
        }
        
        // First row is headers
        const headers = rows[0];
        
        // Find column indices
        const ciudadCol = headers.findIndex(h => h && h.toLowerCase().includes('ciudad'));
        const edificioCol = headers.findIndex(h => h && h.toLowerCase().includes('edificio'));
        
        if (ciudadCol === -1 || edificioCol === -1) {
            throw new Error('Could not find Ciudad or Edificio columns');
        }
        
        // Get all item columns (everything after Edificio)
        const itemColumns = [];
        for (let i = edificioCol + 1; i < headers.length; i++) {
            if (headers[i] && headers[i].trim()) {
                itemColumns.push({
                    index: i,
                    name: headers[i].trim()
                });
            }
        }
        
        const allData = [];
        
        // Process each data row
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            
            const ciudad = row[ciudadCol] ? String(row[ciudadCol]).trim() : '';
            const edificio = row[edificioCol] ? String(row[edificioCol]).trim() : '';
            
            if (!ciudad || !edificio) continue;
            
            // Process each item column
            for (const itemCol of itemColumns) {
                const qty = row[itemCol.index] ? cleanNumericValue(row[itemCol.index]) : 0;
                
                // Include all items, even with qty = 0
                allData.push({
                    item: itemCol.name,
                    qty: qty,
                    ciudad: ciudad,
                    building: edificio,
                    responsable: edificio,
                    fecha: new Date().toISOString().split('T')[0]
                });
            }
        }
        
        res.status(200).json({
            success: true,
            data: allData,
            totalRecords: allData.length,
            sheetProcessed: SHEET_NAME
        });
        
    } catch (error) {
        console.error('Error in API:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};


