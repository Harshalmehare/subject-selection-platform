const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

// Initialize Express App
const app = express();
const PORT = 5000;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(cors());

// Define Excel file path (absolute path)
const filePath = path.join(__dirname, 'student_selections.xlsx');

// Endpoint to store student data in Excel
app.post('/store-student', (req, res) => {
  const studentData = req.body; // Get the data from the frontend (array of student records)

  if (!Array.isArray(studentData) || studentData.length === 0) {
    return res.status(400).json({ error: 'Data should be an array of student records' });
  }

  console.log('Received student data:', studentData); // Log received data

  let workbook;
  let worksheet;
  let existingData = [];

  try {
    if (fs.existsSync(filePath)) {
      console.log('File exists, reading existing workbook...');
      workbook = xlsx.readFile(filePath);
      worksheet = workbook.Sheets['Student Selections'];

      // Convert existing worksheet data to JSON
      if (worksheet) {
        existingData = xlsx.utils.sheet_to_json(worksheet);
      }
    } else {
      console.log('File does not exist, creating new workbook...');
      workbook = xlsx.utils.book_new();
    }

    // Combine existing data with the new data
    const updatedData = [...existingData, ...studentData];

    // Convert combined data back to a worksheet
    worksheet = xlsx.utils.json_to_sheet(updatedData);

    // Append or update the worksheet in the workbook
    const sheetName = 'Student Selections';
    if (workbook.SheetNames.includes(sheetName)) {
      workbook.Sheets[sheetName] = worksheet;
    } else {
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    // Write the updated workbook to file
    console.log('Writing updated data to Excel file at:', filePath);
    xlsx.writeFile(workbook, filePath);
    console.log('Data successfully appended to Excel file.');

    res.status(200).json({ message: 'Data successfully stored in Excel!' });
  } catch (err) {
    console.error('Error writing to Excel:', err.message);
    res.status(500).json({ error: `Failed to write data to Excel: ${err.message}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
