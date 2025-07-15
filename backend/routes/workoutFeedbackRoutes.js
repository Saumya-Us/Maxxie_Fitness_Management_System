import express from 'express';
import { body, validationResult } from 'express-validator';
import WorkoutFeedback from '../models/WorkoutFeedback.js';
import WorkoutPlan from '../models/WorkoutPlan.js';

const router = express.Router();

// Submit feedback for a workout plan
router.post(
  '/',
  [
    body('planId').notEmpty(),
    body('user').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').isString().isLength({ min: 5 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Verify workout plan exists
      const plan = await WorkoutPlan.findById(req.body.planId);
      if (!plan) {
        return res.status(404).json({ message: 'Workout plan not found' });
      }

      const feedback = new WorkoutFeedback(req.body);
      await feedback.save();
      res.status(201).json(feedback);
    } catch (err) {
      res.status(500).json({ message: 'Failed to submit feedback', error: err.message });
    }
  }
);

// Get feedback for a specific workout plan
router.get('/plan/:planId', async (req, res) => {
  try {
    const feedback = await WorkoutFeedback.find({ planId: req.params.planId })
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feedback', error: err.message });
  }
});

// Get unread feedback notifications
router.get('/unread', async (req, res) => {
    try {
      const feedback = await WorkoutFeedback.find({ read: false })
        .sort({ createdAt: -1 })
        .limit(10);
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching notifications', error: err.message });
    }
  });

// Mark feedback as read
router.patch('/:id/read', async (req, res) => {
    try {
      const feedback = await WorkoutFeedback.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ message: 'Error marking as read', error: err.message });
    }
  });

export default router;