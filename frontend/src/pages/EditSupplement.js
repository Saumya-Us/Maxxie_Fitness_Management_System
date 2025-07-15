import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/forms.css';

const EditSupplement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: null
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupplement = async () => {
      try {
        // Check if id is undefined or invalid
        if (!id) {
          console.error('No supplement ID provided');
          setErrors(prev => ({
            ...prev,
            fetch: 'No supplement ID provided'
          }));
          setIsLoading(false);
          // Redirect to home page after a short delay
          setTimeout(() => {
            navigate('/');
          }, 2000);
          return;
        }

        // Validate that id is a valid MongoDB ObjectId format
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
          console.error('Invalid supplement ID format');
          setErrors(prev => ({
            ...prev,
            fetch: 'Invalid supplement ID format'
          }));
          setIsLoading(false);
          // Redirect to home page after a short delay
          setTimeout(() => {
            navigate('/');
          }, 2000);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/supplements/${id}`);
        const supplement = response.data;
        
        setFormData({
          name: supplement.name,
          brand: supplement.brand,
          category: supplement.category,
          price: supplement.price,
          stock: supplement.stock,
          description: supplement.description,
          image: null // We don't set the image here as it's a file
        });
        
        // Set image preview if exists
        if (supplement.image) {
          setImagePreview(`http://localhost:5000/uploads/${supplement.image}`);
          setFileName('Current image');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching supplement:', error);
        setErrors(prev => ({
          ...prev,
          fetch: 'Failed to load supplement data'
        }));
        setIsLoading(false);
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };

    fetchSupplement();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.stock) {
      newErrors.stock = 'Stock is required';
    } else if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative integer';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload an image file'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && !formData[key]) {
          return; // Skip image if no new image was selected
        }
        formDataToSend.append(key, formData[key]);
      });

      await axios.put(`http://localhost:5000/api/supplements/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error updating supplement:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to update supplement. Please try again.'
      }));
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (errors.fetch) {
    return <div className="error-message">{errors.fetch}</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Supplement</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter supplement name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Brand</label>
          <input
            type="text"
            name="brand"
            className={`form-input ${errors.brand ? 'error' : ''}`}
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Enter brand name"
          />
          {errors.brand && <span className="error-message">{errors.brand}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            className={`form-input form-select ${errors.category ? 'error' : ''}`}
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Select a category</option>
            <option value="Protein">Protein</option>
            <option value="Pre-Workout">Pre-Workout</option>
            <option value="Post-Workout">Post-Workout</option>
            <option value="Vitamins">Vitamins</option>
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Price (Rs.)</label>
          <input
            type="number"
            name="price"
            className={`form-input ${errors.price ? 'error' : ''}`}
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            step="0.01"
            min="0"
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Stock</label>
          <input
            type="number"
            name="stock"
            className={`form-input ${errors.stock ? 'error' : ''}`}
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="Enter stock quantity"
            min="0"
          />
          {errors.stock && <span className="error-message">{errors.stock}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter supplement description"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <input
            type="file"
            id="image"
            name="image"
            className="form-file-input"
            onChange={handleImageChange}
            accept="image/*"
          />
          <label htmlFor="image" className="form-file-label">
            {imagePreview ? 'Change Image' : 'Choose Image'}
            {fileName && <span className="file-name">{fileName}</span>}
          </label>
          {errors.image && <span className="error-message">{errors.image}</span>}
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        {errors.submit && (
          <div className="error-message" style={{ marginBottom: '1rem', position: 'static' }}>
            {errors.submit}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="form-cancel" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="form-submit">
            Update Supplement
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSupplement;