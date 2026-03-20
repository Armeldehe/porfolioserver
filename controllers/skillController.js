// ============================
// Contrôleur : Skills
// Gestion des compétences techniques
// ============================

const Skill = require("../models/Skill");

// ─────────────────────────────────────────────
// GET /api/skills - Récupérer toutes les compétences
// ─────────────────────────────────────────────
const getAllSkills = async (req, res) => {
  try {
    // Récupérer toutes les compétences, triées par catégorie puis par nom
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des compétences",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// POST /api/skills - Ajouter une nouvelle compétence
// ─────────────────────────────────────────────
const createSkill = async (req, res) => {
  try {
    // Créer une nouvelle compétence avec les données reçues
    const skill = await Skill.create(req.body);
    res.status(201).json({
      success: true,
      message: "Compétence ajoutée avec succès",
      data: skill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Erreur lors de l'ajout de la compétence",
      error: error.message,
    });
  }
};

// Exporter les fonctions du contrôleur
module.exports = {
  getAllSkills,
  createSkill,
};
