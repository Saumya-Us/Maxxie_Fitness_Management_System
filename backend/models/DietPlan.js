const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema(
  {
    dietType: {
      type: String,
      required: [true, 'Diet Type is required'],
      enum: {
        values: ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Keto', 'Paleo'],
        message: 'Diet Type must be one of: Vegetarian, Vegan, Non-Vegetarian, Keto, or Paleo'
      },
      trim: true
    },
    foodAllergies: {
      type: String,
      required: [true, 'Food Allergies is required'],
      enum: {
        values: ['Nuts', 'Dairy', 'Gluten', 'None'],
        message: 'Food Allergies must be one of: Nuts, Dairy, Gluten, or None'
      },
      trim: true
    },
    medicalConditions: {
      type: String,
      required: [true, 'Medical Conditions is required'],
      enum: {
        values: ['Diabetes', 'Hypertension', 'None'],
        message: 'Medical Conditions must be one of: Diabetes, Hypertension, or None'
      },
      trim: true
    },
    caloricIntakeGoal: {
      type: String,
      required: [true, 'Caloric Intake Goal is required'],
      enum: {
        values: ['Weight Loss', 'Maintenance', 'Muscle Gain'],
        message: 'Caloric Intake Goal must be one of: Weight Loss, Maintenance, or Muscle Gain'
      },
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Add pre-save middleware to ensure data consistency
dietPlanSchema.pre('save', function(next) {
  // Trim all string fields
  Object.keys(this._doc).forEach(key => {
    if (typeof this[key] === 'string') {
      this[key] = this[key].trim();
    }
  });
  next();
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);