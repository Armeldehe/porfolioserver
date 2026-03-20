const mongoose = require("mongoose");

const designSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Le titre est obligatoire"],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, "L'URL de l'image est obligatoire"]
  },
  category: {
    type: String,
    default: "Canva"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Design", designSchema);
