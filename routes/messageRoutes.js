// ============================
// Routes : Messages
// Définition des routes pour les messages de contact
// ============================

const express = require("express");
const router = express.Router();

// Importation du contrôleur des messages
const {
  createMessage,
  getAllMessages,
} = require("../controllers/messageController");

// Importation du middleware d'authentification JWT
const { protect } = require("../middleware/authMiddleware");

// Route POST - Envoyer un message de contact
router.post("/", createMessage);

// Route GET - Récupérer tous les messages (protégée : admin uniquement)
router.get("/", protect, getAllMessages);

module.exports = router;
