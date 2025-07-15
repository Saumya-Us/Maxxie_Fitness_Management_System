import mongoose from 'mongoose';

const dietFeedbackSchema = new mongoose.Schema({
  dietPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DietPlan',
    required: true
  },
  user: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 5
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('DietFeedback', dietFeedbackSchema);
