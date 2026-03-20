// ============================
// Routes : Skills
// Définition des routes pour les compétences
// ============================

const express = require("express");
const router = express.Router();

// Importation du contrôleur des compétences
const { getAllSkills, createSkill } = require("../controllers/skillController");

// Importation du middleware d'authentification JWT
const { protect } = require("../middleware/authMiddleware");

// Route GET - Récupérer toutes les compétences
router.get("/", getAllSkills);

// Route POST - Ajouter une nouvelle compétence (protégée : admin uniquement)
router.post("/", protect, createSkill);

module.exports = router;
