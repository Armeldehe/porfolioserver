// ============================
// Modèle Mongoose : Admin
// Représente l'administrateur du portfolio
// ============================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  // Nom de l'administrateur (obligatoire)
  name: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,
  },

  // Email de connexion (obligatoire et unique)
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    trim: true,
    lowercase: true,
  },

  // Mot de passe hashé (obligatoire)
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
  },

  // Rôle de l'utilisateur (admin par défaut)
  role: {
    type: String,
    default: "admin",
  },

  // Date de création du compte
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ─────────────────────────────────────────────
// Middleware pre-save : Hacher le mot de passe avant la sauvegarde
// ─────────────────────────────────────────────
adminSchema.pre("save", async function (next) {
  // Ne hacher que si le mot de passe a été modifié
  if (!this.isModified("password")) return next();

  // Générer un sel et hacher le mot de passe
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─────────────────────────────────────────────
// Méthode : Comparer le mot de passe saisi avec le hash
// ─────────────────────────────────────────────
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
