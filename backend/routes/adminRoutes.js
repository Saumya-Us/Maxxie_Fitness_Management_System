import express from "express";
import Supplement from "../models/SupplementModel.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Fetch all supplements (for inventory management)
router.get("/inventory", async (req, res) => {
  try {
    const supplements = await Supplement.find();
    res.json(supplements);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ 
      message: "Error fetching inventory",
      error: error.message 
    });
  }
});

// Update stock quantity
router.patch("/update-stock/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    
    // Validate quantity is a number and not undefined
    if (quantity === undefined || typeof quantity !== 'number') {
      return res.status(400).json({ 
        message: "Quantity must be a valid number",
        error: "INVALID_QUANTITY"
      });
    }

    const supplement = await Supplement.findById(req.params.id);
    
    if (!supplement) {
      return res.status(404).json({ 
        message: "Supplement not found",
        error: "SUPPLEMENT_NOT_FOUND"
      });
    }

    // Calculate new stock level
    const newStock = supplement.stock + quantity;
    
    // Validate stock doesn't go below 0
    if (newStock < 0) {
      return res.status(400).json({ 
        message: "Stock cannot be negative",
        currentStock: supplement.stock,
        error: "NEGATIVE_STOCK"
      });
    }

    // Update stock
    supplement.stock = newStock;
    await supplement.save();

    res.json({ 
      message: "Stock updated successfully", 
      supplement,
      isLowStock: supplement.stock <= 10
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ 
      message: "Error updating stock", 
      error: error.message,
      errorCode: "SERVER_ERROR"
    });
  }
});

// Get low stock supplements
router.get("/low-stock", async (req, res) => {
  try {
    const lowStockSupplements = await Supplement.find({ stock: { $lte: 10 } });
    res.json(lowStockSupplements);
  } catch (error) {
    console.error("Error fetching low stock supplements:", error);
    res.status(500).json({ 
      message: "Error fetching low stock supplements",
      error: error.message 
    });
  }
});

// Delete a supplement
router.delete("/:id", async (req, res) => {
  try {
    const supplement = await Supplement.findByIdAndDelete(req.params.id);
    if (!supplement) {
      return res.status(404).json({ 
        message: "Supplement not found",
        error: "SUPPLEMENT_NOT_FOUND"
      });
    }
    res.json({ message: "Supplement deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplement:", error);
    res.status(500).json({ 
      message: "Error deleting supplement",
      error: error.message 
    });
  }
});

export default router;
