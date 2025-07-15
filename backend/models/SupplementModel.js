import mongoose from "mongoose";

const SupplementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: [0, 'Stock cannot be negative'] },
  description: { type: String },
  image: { type: String }, // Store image path
});

const Supplement = mongoose.model("Supplement", SupplementSchema);
export default Supplement;
