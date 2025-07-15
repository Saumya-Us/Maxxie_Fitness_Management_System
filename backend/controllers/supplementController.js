import Supplement from "../models/SupplementModel.js";

// Create a new supplement
export async function createSupplement(req, res) {
  try {
    const { name, brand, category, price, stock, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : ""; // Store image path

    // Validate required fields
    if (!name || !brand || !category || !price || stock === undefined || !description) {
      return res.status(400).json({ message: "All fields (name, brand, category, price, stock, description) are required." });
    }

    // Create a new supplement
    const newSupplement = new Supplement({
      name,
      brand,
      category,
      price,
      stock,
      description,
      image,
    });

    await newSupplement.save();
    
    res.status(201).json({ message: "Supplement added successfully!", supplement: newSupplement });
  } catch (error) {
    console.error("Error adding supplement:", error);
    res.status(500).json({ message: "Error adding supplement", error: error.message });
  }
}

// Get all supplements
export async function getAllSupplements(req, res) {
  try {
    const supplements = await Supplement.find();
    res.json(supplements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching supplements", error: error.message });
  }
}

// Get a single supplement by ID
export async function getSupplementById(req, res) {
  try {
    const supplement = await Supplement.findById(req.params.id);
    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }
    res.json(supplement);
  } catch (error) {
    res.status(500).json({ message: "Error fetching supplement", error: error.message });
  }
}

// Update a supplement by ID
export async function updateSupplement(req, res) {
  try {
    const { name, brand, category, price, stock, description, image } = req.body;

    // Validate input fields
    if (!name || !brand || !category || !price || stock === undefined || !description) {
      return res.status(400).json({ message: "All fields (name, brand, category, price, stock, description, image) are required." });
    }

    const updatedSupplement = await Supplement.findByIdAndUpdate(
      req.params.id,
      { name, brand, category, price, stock, description, image },
      { new: true, runValidators: true }
    );

    if (!updatedSupplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }

    res.json({ message: "Supplement updated successfully!", supplement: updatedSupplement });
  } catch (error) {
    res.status(500).json({ message: "Error updating supplement", error: error.message });
  }
}

// Delete a supplement by ID
export async function deleteSupplement(req, res) {
  try {
    const deletedSupplement = await Supplement.findByIdAndDelete(req.params.id);
    if (!deletedSupplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }
    res.json({ message: "Supplement deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting supplement", error: error.message });
  }
}
