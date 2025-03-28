const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const EXCEL_FILE = path.join(__dirname, 'internships.xlsx');

// Load or create Excel file
let workbook;
try {
  workbook = XLSX.readFile(EXCEL_FILE);
} catch (e) {
  workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Internships');
}

app.post('/api/internships', (req, res) => {
  try {
    const newEntry = req.body;
        
    // Get first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Add new entry
    data.push(newEntry);
    
    // Update worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    
    // Save file
    XLSX.writeFile(workbook, EXCEL_FILE);
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update Excel file' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});