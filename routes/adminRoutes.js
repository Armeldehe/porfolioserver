// ============================
// Routes : Admin
// Authentification et profil administrateur
// ============================

const express = require("express");
const router = express.Router();

// Importation du contrôleur admin
const { loginAdmin, getAdminProfile, updateAdminProfile } = require("../controllers/adminController");

// Importation du middleware de protection JWT
const { protect } = require("../middleware/authMiddleware");

// Route POST - Connexion de l'administrateur (publique)
router.post("/login", loginAdmin);

// Route GET - Récupérer le profil admin (protégée par JWT)
router.get("/profile", protect, getAdminProfile);

// Route PUT - Mettre à jour le profil admin (protégée par JWT)
router.put("/profile", protect, updateAdminProfile);

module.exports = router;
