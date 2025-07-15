const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MembershipPlan = require('../models/MembershipPlan');

// Route to get all membership plans
router.get('/', async (req, res) => {
  try {
    const membershipPlans = await MembershipPlan.find();
    res.json(membershipPlans);
  } catch (err) {
    console.error('Error fetching membership plans:', err);
    res.status(500).json({ 
      message: 'Error fetching membership plans', 
      error: err.message 
    });
  }
});

// Create a new membership plan
router.post(
  '/',
  [
    body('planName')
      .notEmpty()
      .withMessage('Plan name is required')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Plan name must be between 3 and 50 characters'),
    body('duration')
      .notEmpty()
      .withMessage('Duration is required')
      .trim()
      .matches(/^\d+\s*(day|week|month|year)s?$/)
      .withMessage('Duration must be in format: 1 day, 2 weeks, 3 months, 1 year'),
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('features')
      .notEmpty()
      .withMessage('Features are required')
      .isArray()
      .withMessage('Features must be an array')
      .notEmpty()
      .withMessage('Features array cannot be empty'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
  ],
  async (req, res) => {
    console.log('Received POST request with body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    try {
      const membershipPlan = new MembershipPlan(req.body);
      console.log('Creating new membership plan:', membershipPlan);
      
      await membershipPlan.save();
      console.log('Membership plan saved successfully');
      
      res.status(201).json(membershipPlan);
    } catch (err) {
      console.error('Error creating membership plan:', err);
      res.status(500).json({ 
        message: 'Failed to save membership plan',
        error: err.message 
      });
    }
  }
);

// Update a membership plan
router.put(
  '/:id',
  [
    body('planName')
      .optional()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Plan name must be between 3 and 50 characters'),
    body('duration')
      .optional()
      .trim()
      .matches(/^\d+\s*(day|week|month|year)s?$/)
      .withMessage('Duration must be in format: 1 day, 2 weeks, 3 months, 1 year'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('features')
      .optional()
      .isArray()
      .withMessage('Features must be an array')
      .notEmpty()
      .withMessage('Features array cannot be empty'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    try {
      const membershipPlan = await MembershipPlan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!membershipPlan) {
        return res.status(404).json({ message: 'Membership Plan not found' });
      }
      
      res.json(membershipPlan);
    } catch (err) {
      console.error('Error updating membership plan:', err);
      res.status(500).json({ 
        message: 'Error updating membership plan',
        error: err.message 
      });
    }
  }
);

// Delete a membership plan
router.delete('/:id', async (req, res) => {
  try {
    const membershipPlan = await MembershipPlan.findByIdAndDelete(req.params.id);
    
    if (!membershipPlan) {
      return res.status(404).json({ message: 'Membership Plan not found' });
    }
    
    res.json({ message: 'Membership Plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting membership plan:', err);
    res.status(500).json({ 
      message: 'Error deleting membership plan',
      error: err.message 
    });
  }
});

module.exports = router; 