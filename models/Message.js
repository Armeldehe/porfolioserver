// ============================
// Modèle Mongoose : Message
// Représente un message de contact envoyé par un visiteur
// ============================

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // Nom de l'expéditeur (obligatoire)
  name: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,
  },

  // Adresse email de l'expéditeur (obligatoire)
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    trim: true,
    lowercase: true,
  },

  // Sujet du message
  subject: {
    type: String,
    trim: true,
    default: "",
  },

  // Contenu du message (obligatoire)
  message: {
    type: String,
    required: [true, "Le message est obligatoire"],
    trim: true,
  },

  // Date de réception du message
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
