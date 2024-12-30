import React, { useState } from 'react';
import axios from 'axios';
import { TextField, MenuItem, Button, Container } from '@mui/material';

const App = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branchSubjectsMap = {
    Engineering: ['C', 'C++','Java'],
    Science: ['Math', 'Physics'],
  };

  const handleBranchChange = (event) => {
    const selectedBranch = event.target.value;
    setBranch(selectedBranch);
    setSubjectsList(branchSubjectsMap[selectedBranch] || []);
  };

  const handleSubmit = async () => {
    if (!name || !rollNumber || !branch || !subject) {
      alert('Please fill out all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const studentData = [{ name, roll_number: rollNumber, branch, subject }];
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/store-student`, studentData);

      if (response.data.message) {
        alert(response.data.message);
        // Reset form
        setName('');
        setRollNumber('');
        setBranch('');
        setSubject('');
        setSubjectsList([]);
      } else {
        alert('Error: Unknown response structure');
      }
    } catch (error) {
      if (error.response) {
        alert('Error: ' + error.response.data.error);
      } else if (error.request) {
        alert('Error: No response from server');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <h1>Student Major Subject Selection Platform</h1>
      <form>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Roll Number"
          variant="outlined"
          fullWidth
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          select
          label="Branch"
          fullWidth
          value={branch}
          onChange={handleBranchChange}
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="Engineering">Engineering</MenuItem>
          <MenuItem value="Science">Science</MenuItem>
        </TextField>
        <TextField
          select
          label="Subject"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{ marginBottom: 2 }}
        >
          {subjectsList.map((sub, index) => (
            <MenuItem key={index} value={sub}>
              {sub}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ marginTop: '20px' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Container>
  );
};

export default App;
