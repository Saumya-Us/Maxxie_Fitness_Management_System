import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createSupplement,
  getAllSupplements,
  getSupplementById,
  updateSupplement,
  deleteSupplement,
} from "../controllers/supplementController.js";

const router = express.Router();

router.post("/", upload.single("image"), createSupplement); // Handle image uploads
router.get("/", getAllSupplements);
router.get("/:id", getSupplementById);
router.put("/:id", upload.single("image"), updateSupplement); // Allow image updates
router.delete("/:id", deleteSupplement);

export default router;
