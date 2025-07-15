const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const DietPlan = require('../models/DietPlan');

// Get all diet plans
router.get('/', async (req, res) => {
  try {
    const dietPlans = await DietPlan.find();
    res.json(dietPlans);
  } catch (err) {
    console.error('Error fetching diet plans:', err);
    res.status(500).json({ 
      message: 'Error fetching diet plans', 
      error: err.message 
    });
  }
});

// Create a new diet plan
router.post(
  '/',
  [
    body('dietType')
      .notEmpty()
      .withMessage('Diet Type is required')
      .isIn(['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Keto', 'Paleo'])
      .withMessage('Diet Type must be Vegetarian, Vegan, Non-Vegetarian, Keto, or Paleo')
      .trim(),
    body('foodAllergies')
      .notEmpty()
      .withMessage('Food Allergies is required')
      .isIn(['Nuts', 'Dairy', 'Gluten', 'None'])
      .withMessage('Food Allergies must be Nuts, Dairy, Gluten, or None')
      .trim(),
    body('medicalConditions')
      .notEmpty()
      .withMessage('Medical Conditions is required')
      .isIn(['Diabetes', 'Hypertension', 'None'])
      .withMessage('Medical Conditions must be Diabetes, Hypertension, or None')
      .trim(),
    body('caloricIntakeGoal')
      .notEmpty()
      .withMessage('Caloric Intake Goal is required')
      .isIn(['Weight Loss', 'Maintenance', 'Muscle Gain'])
      .withMessage('Caloric Intake Goal must be Weight Loss, Maintenance, or Muscle Gain')
      .trim(),
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
      const newDietPlan = new DietPlan(req.body);
      console.log('Creating new diet plan:', newDietPlan);
      
      await newDietPlan.save();
      console.log('Diet plan saved successfully');
      
      res.status(201).json(newDietPlan);
    } catch (err) {
      console.error('Error creating diet plan:', err);
      res.status(500).json({ 
        message: 'Failed to save diet plan',
        error: err.message 
      });
    }
  }
);

// Update a diet plan
router.put(
  '/:id',
  [
    body('dietType')
      .optional()
      .isIn(['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Keto', 'Paleo'])
      .withMessage('Diet Type must be Vegetarian, Vegan, Non-Vegetarian, Keto, or Paleo')
      .trim(),
    body('foodAllergies')
      .optional()
      .isIn(['Nuts', 'Dairy', 'Gluten', 'None'])
      .withMessage('Food Allergies must be Nuts, Dairy, Gluten, or None')
      .trim(),
    body('medicalConditions')
      .optional()
      .isIn(['Diabetes', 'Hypertension', 'None'])
      .withMessage('Medical Conditions must be Diabetes, Hypertension, or None')
      .trim(),
    body('caloricIntakeGoal')
      .optional()
      .isIn(['Weight Loss', 'Maintenance', 'Muscle Gain'])
      .withMessage('Caloric Intake Goal must be Weight Loss, Maintenance, or Muscle Gain')
      .trim(),
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
      const dietPlan = await DietPlan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!dietPlan) {
        return res.status(404).json({ message: 'Diet Plan not found' });
      }
      
      res.json(dietPlan);
    } catch (err) {
      console.error('Error updating diet plan:', err);
      res.status(500).json({ 
        message: 'Error updating diet plan',
        error: err.message 
      });
    }
  }
);

// Delete a diet plan
router.delete('/:id', async (req, res) => {
  try {
    const dietPlan = await DietPlan.findByIdAndDelete(req.params.id);
    
    if (!dietPlan) {
      return res.status(404).json({ message: 'Diet Plan not found' });
    }
    
    res.json({ message: 'Diet Plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting diet plan:', err);
    res.status(500).json({ 
      message: 'Error deleting diet plan',
      error: err.message 
    });
  }
});

module.exports = router;