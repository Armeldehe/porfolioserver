// ============================
// Modèle Mongoose : Skill
// Représente une compétence technique
// ============================

const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  // Nom de la compétence (obligatoire)
  name: {
    type: String,
    required: [true, "Le nom de la compétence est obligatoire"],
    trim: true,
  },

  // Niveau de maîtrise de la compétence
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    default: "Intermediate",
  },

  // Catégorie de la compétence
  category: {
    type: String,
    enum: ["Frontend", "Backend", "Database", "Tools", "Design"],
    default: "Frontend",
  },

  // Icône représentant la compétence (URL ou nom d'icône)
  icon: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Skill", skillSchema);
