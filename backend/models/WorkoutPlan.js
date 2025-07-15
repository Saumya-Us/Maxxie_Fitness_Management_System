const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema(
  {
    workoutType: {
      type: String,
      required: [true, 'Workout Type is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      match: [/^\d+min$/, 'Duration must be in the format 30min'],
      trim: true,
    },
    sets: {
      type: Number,
      required: [true, 'Sets are required'],
      min: [1, 'Sets must be a positive integer'],
      validate: {
        validator: Number.isInteger,
        message: 'Sets must be a whole number'
      }
    },
    reps: {
      type: Number,
      required: [true, 'Reps are required'],
      min: [1, 'Reps must be a positive integer'],
      validate: {
        validator: Number.isInteger,
        message: 'Reps must be a whole number'
      }
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [100, 'Height must be at least 100 cm'],
      max: [250, 'Height must not exceed 250 cm'],
      validate: {
        validator: function(v) {
          return v >= 100 && v <= 250;
        },
        message: 'Height must be between 100 and 250 cm'
      }
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [30, 'Weight must be at least 30 kg'],
      max: [200, 'Weight must not exceed 200 kg'],
      validate: {
        validator: function(v) {
          return v >= 30 && v <= 200;
        },
        message: 'Weight must be between 30 and 200 kg'
      }
    },
    createdBy: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add a pre-save middleware to ensure data consistency
workoutPlanSchema.pre('save', function(next) {
  // Ensure duration is in the correct format
  if (this.duration && !this.duration.endsWith('min')) {
    this.duration = `${this.duration}min`;
  }
  next();
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);