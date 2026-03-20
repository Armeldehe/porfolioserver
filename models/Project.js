// ============================
// Modèle Mongoose : Project
// Représente un projet du portfolio
// ============================

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  // Titre du projet (obligatoire)
  title: {
    type: String,
    required: [true, "Le titre du projet est obligatoire"],
    trim: true,
  },

  // Description détaillée du projet (obligatoire)
  description: {
    type: String,
    required: [true, "La description du projet est obligatoire"],
    trim: true,
  },

  // URL ou chemin de l'image du projet (obligatoire)
  image: {
    type: String,
    required: [true, "L'image du projet est obligatoire"],
  },

  // Liste des technologies utilisées dans le projet
  technologies: {
    type: [String],
    default: [],
  },

  // Lien vers le dépôt GitHub du projet
  githubLink: {
    type: String,
    default: "",
  },

  // Lien vers la version en ligne du projet
  liveLink: {
    type: String,
    default: "",
  },

  // Lien vers une vidéo de démonstration du projet
  videoDemo: {
    type: String,
    default: "",
  },

  // Indique si le projet est mis en avant (featured)
  featured: {
    type: Boolean,
    default: false,
  },

  // Date de création du projet
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
