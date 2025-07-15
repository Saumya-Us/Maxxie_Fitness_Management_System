import express from 'express';
import { body, validationResult } from 'express-validator';
import DietFeedback from '../models/DietFeedback.js';
import DietPlan from '../models/DietPlan.js';


const router = express.Router();

// Submit feedback for a diet plan
router.post(
  '/',
  [
    body('dietPlanId').notEmpty(),
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
      // Verify diet plan exists
      const plan = await DietPlan.findById(req.body.dietPlanId);
      if (!plan) {
        return res.status(404).json({ message: 'Diet plan not found' });
      }

      const feedback = new DietFeedback(req.body);
      await feedback.save();
      res.status(201).json(feedback);
    } catch (err) {
      res.status(500).json({ message: 'Failed to submit feedback', error: err.message });
    }
  }
);

// Get feedback for a specific diet plan
router.get('/plan/:dietPlanId', async (req, res) => {
  try {
    const feedback = await DietFeedback.find({ dietPlanId: req.params.dietPlanId })
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feedback', error: err.message });
  }
});

// (Optional) Get unread feedback notifications
router.get('/unread', async (req, res) => {
  try {
    const feedback = await DietFeedback.find({ read: false })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// (Optional) Mark feedback as read
router.patch('/:id/read', async (req, res) => {
  try {
    const feedback = await DietFeedback.findByIdAndUpdate(
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
