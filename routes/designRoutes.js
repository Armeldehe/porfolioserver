const express = require("express");
const router = express.Router();
const { getDesigns, createDesign, deleteDesign } = require("../controllers/designController");
const { protect } = require("../middleware/authMiddleware");

// Routes publiques
router.get("/", getDesigns);

// Routes protégées (Admin)
router.post("/", protect, createDesign);
router.delete("/:id", protect, deleteDesign);

module.exports = router;
