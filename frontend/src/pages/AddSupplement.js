import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  MenuItem, Box, Typography, IconButton, useTheme, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const categories = [
  'Protein',
  'Pre-Workout',
  'Post-Workout',
  'Vitamins'
];

const initialForm = {
  name: '',
  brand: '',
  category: '',
  price: '',
  stock: '',
  description: '',
  image: null,
};

const SupplementModal = ({ open, onClose, onAdded }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be a positive number';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    else if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) newErrors.stock = 'Stock must be a non-negative integer';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (!formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleClose = () => {
    setFormData(initialForm);
    setErrors({});
    setImagePreview(null);
    setFileName('');
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, submit: '' }));
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) formDataToSend.append(key, formData[key]);
      });
      await axios.post('http://localhost:5000/api/supplements', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
      });
      if (onAdded) onAdded();
      handleClose();
    } catch (error) {
      let errorMessage = 'Failed to add supplement. ';
      if (error.response) errorMessage += `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
      else if (error.request) errorMessage += 'No response from server. Please check if the server is running.';
      else errorMessage += error.message;
      setErrors(prev => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4, background: theme.palette.background.paper } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">Add New Supplement</Typography>
        <IconButton onClick={handleClose} size="large" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ px: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            error={!!errors.brand}
            helperText={errors.brand}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            error={!!errors.category}
            helperText={errors.category}
            select
            fullWidth
            required
          >
            <MenuItem value="">Select a category</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            label="Price (LKR)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            margin="normal"
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            error={!!errors.stock}
            helperText={errors.stock}
            fullWidth
            required
            inputProps={{ min: 0, step: 1 }}
          />
          <TextField
            margin="normal"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            required
            multiline
            minRows={3}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              color={errors.image ? 'error' : 'primary'}
              sx={{ borderRadius: 2 }}
            >
              Choose Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {fileName && (
              <Typography variant="body2" sx={{ ml: 2, display: 'inline', color: theme.palette.text.secondary }}>
                {fileName}
              </Typography>
            )}
            {errors.image && (
              <Typography variant="caption" color="error" display="block">{errors.image}</Typography>
            )}
            {imagePreview && (
              <Box mt={2}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: 120, borderRadius: 6 }} />
              </Box>
            )}
          </Box>
          {errors.submit && (
            <Box mt={2} sx={{
              background: theme.palette.error.light,
              color: theme.palette.error.dark,
              p: 1.5,
              borderRadius: 2,
              border: `1px solid ${theme.palette.error.main}`
            }}>
              <Typography variant="body2">{errors.submit}</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="secondary" variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          type="submit"
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, minWidth: 120 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Add Supplement'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplementModal;
