import React, { useState, ChangeEvent } from 'react';
import { Button, TextField, Box, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';

interface FormData {
  firstName: string;
  lastName: string;
  address: string;
  file: File | null;
}

const FormToCSV: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    address: '',
    file: null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = () => {
    // Create a file input element programmatically
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;     if (target.files && target.files.length > 0) {
        setFormData(prev => ({
          ...prev,
          file: target.files![0]
        }));
      }
    };
    
    // Trigger the file dialog
    input.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to an API
    console.log('Form submitted:', formData);
  };

  const exportToCSV = () => {
    // Prepare data for CSV
    const data = [
      ['Field', 'Value'],
      ['First Name', formData.firstName],
      ['Last Name', formData.lastName],
      ['Address', formData.address],
      ['File Name', formData.file?.name || 'No file uploaded'],
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Form Data');
    
    // Generate and download the file
    XLSX.writeFile(wb, 'form_data.xlsx');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: '40px auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Sample User Information Form
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            variant="outlined"
          />
        </Box>
        
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          multiline
          rows={3}
          sx={{ mb: 2 }}
          variant="outlined"
        />
        
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={handleFileChange}
          sx={{ mb: 2, width: '100%' }}
        >
          {formData.file ? formData.file.name : 'Upload File'}
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          {/* <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Submit
          </Button> */}
          <Button
            variant="outlined"
            color="success"
            onClick={exportToCSV}
            fullWidth
            disabled={!formData.firstName && !formData.lastName && !formData.address}
          >
            Export to Excel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default FormToCSV;