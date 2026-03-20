// ============================
// Contrôleur : Messages
// Gestion des messages de contact
// ============================

const Message = require("../models/Message");

// ─────────────────────────────────────────────
// POST /api/messages - Enregistrer un nouveau message de contact
// ─────────────────────────────────────────────
const createMessage = async (req, res) => {
  try {
    // Enregistrer le message reçu depuis le formulaire de contact
    const message = await Message.create(req.body);
    res.status(201).json({
      success: true,
      message: "Message envoyé avec succès ! Je vous répondrai sous peu.",
      data: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Erreur lors de l'envoi du message",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/messages - Récupérer tous les messages (usage privé)
// ─────────────────────────────────────────────
const getAllMessages = async (req, res) => {
  try {
    // Récupérer tous les messages, du plus récent au plus ancien
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des messages",
      error: error.message,
    });
  }
};

// Exporter les fonctions du contrôleur
module.exports = {
  createMessage,
  getAllMessages,
};
