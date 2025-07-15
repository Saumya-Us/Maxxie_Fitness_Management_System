const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"], // Allowed roles are only "admin" and "member"
      default: "member", // Default role is "member"
    },
    deleteRequest: {
      type: Boolean,
      default: false,
    },
    selectedPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      default: null,
    },
    selectedPlanName: {
      type: String,
      default: null,
    },
    
    
  },
  { timestamps: true }
);



const UserModel = mongoose.model('userdata', UserSchema);

module.exports = UserModel;