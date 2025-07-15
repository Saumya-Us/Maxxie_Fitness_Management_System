const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, 'Plan Name is required'],
      trim: true,
      minlength: [3, 'Plan name must be at least 3 characters long'],
      maxlength: [50, 'Plan name cannot exceed 50 characters']
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
      match: [/^\d+\s*(day|week|month|year)s?$/, 'Duration must be in format: 1 day, 2 weeks, 3 months, 1 year']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
      validate: {
        validator: function(v) {
          return v >= 0;
        },
        message: 'Price must be a positive number'
      }
    },
    features: {
      type: [String],
      required: [true, 'Features are required'],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Features array cannot be empty'
      }
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

membershipPlanSchema.pre('save', function(next) {
  if (this.planName) this.planName = this.planName.trim();
  if (this.duration) this.duration = this.duration.trim();
  if (this.description) this.description = this.description.trim();
  if (this.features && !Array.isArray(this.features)) {
    this.features = [this.features];
  }
  next();
});

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
