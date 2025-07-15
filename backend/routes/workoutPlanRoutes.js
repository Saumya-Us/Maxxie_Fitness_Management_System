const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const WorkoutPlan = require('../models/WorkoutPlan');

// Route to get all workout plans
router.get('/', async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find();
    res.json(workoutPlans);
  } catch (err) {
    console.error('Error fetching workout plans:', err);
    res.status(500).json({ message: 'Error fetching workout plans', error: err.message });
  }
});

router.post(
  '/',
  [
    body('workoutType')
      .notEmpty()
      .withMessage('Workout type is required')
      .trim(),
    body('duration')
      .notEmpty()
      .withMessage('Duration is required')
      .matches(/^\d+min$/)
      .withMessage('Duration must be in the format 30min'),
    body('sets')
      .notEmpty()
      .withMessage('Sets are required')
      .isInt({ min: 1 })
      .withMessage('Sets must be a positive integer'),
    body('reps')
      .notEmpty()
      .withMessage('Reps are required')
      .isInt({ min: 1 })
      .withMessage('Reps must be a positive integer'),
    body('height')
      .notEmpty()
      .withMessage('Height is required')
      .isFloat({ min: 100, max: 250 })
      .withMessage('Height must be between 100 and 250 cm'),
    body('weight')
      .notEmpty()
      .withMessage('Weight is required')
      .isFloat({ min: 30, max: 200 })
      .withMessage('Weight must be between 30 and 200 kg'),
    body('createdBy')
      .optional()
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
      const workoutPlan = new WorkoutPlan(req.body);
      await workoutPlan.save();
      res.status(201).json(workoutPlan);
    } catch (err) {
      console.error('Error creating workout plan:', err);
      res.status(500).json({ 
        message: 'Failed to save workout plan',
        error: err.message 
      });
    }
  }
);

router.put(
  '/:id',
  [
    body('workoutType')
      .optional()
      .trim(),
    body('duration')
      .optional()
      .matches(/^\d+min$/)
      .withMessage('Duration must be in the format 30min'),
    body('sets')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Sets must be a positive integer'),
    body('reps')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Reps must be a positive integer'),
    body('height')
      .optional()
      .isFloat({ min: 100, max: 250 })
      .withMessage('Height must be between 100 and 250 cm'),
    body('weight')
      .optional()
      .isFloat({ min: 30, max: 200 })
      .withMessage('Weight must be between 30 and 200 kg'),
    body('createdBy')
      .optional()
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
      const workoutPlan = await WorkoutPlan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!workoutPlan) {
        return res.status(404).json({ message: 'Workout Plan not found' });
      }
      res.json(workoutPlan);
    } catch (err) {
      console.error('Error updating workout plan:', err);
      res.status(500).json({ 
        message: 'Error updating workout plan',
        error: err.message 
      });
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findByIdAndDelete(req.params.id);
    if (!workoutPlan) {
      return res.status(404).json({ message: 'Workout Plan not found' });
    }
    res.json({ message: 'Workout Plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting workout plan:', err);
    res.status(500).json({ 
      message: 'Error deleting workout plan',
      error: err.message 
    });
  }
});

module.exports = router;