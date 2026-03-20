// ============================
// Contrôleur : Projects
// Gestion de toutes les opérations CRUD sur les projets
// ============================

const Project = require("../models/Project");

// ─────────────────────────────────────────────
// GET /api/projects - Récupérer tous les projets
// ─────────────────────────────────────────────
const getAllProjects = async (req, res) => {
  try {
    // Récupérer tous les projets, triés du plus récent au plus ancien
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des projets",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/projects/:id - Récupérer un projet par son ID
// ─────────────────────────────────────────────
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    // Vérifier si le projet existe
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du projet",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// POST /api/projects - Créer un nouveau projet
// ─────────────────────────────────────────────
const createProject = async (req, res) => {
  try {
    // Créer un nouveau projet avec les données reçues
    const project = await Project.create(req.body);
    res.status(201).json({
      success: true,
      message: "Projet créé avec succès",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Erreur lors de la création du projet",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// PUT /api/projects/:id - Mettre à jour un projet
// ─────────────────────────────────────────────
const updateProject = async (req, res) => {
  try {
    // Trouver et mettre à jour le projet, puis retourner la version mise à jour
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,         // Retourne le document mis à jour
      runValidators: true, // Exécute les validateurs du schéma
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Projet mis à jour avec succès",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Erreur lors de la mise à jour du projet",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/projects/:id - Supprimer un projet
// ─────────────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Projet supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du projet",
      error: error.message,
    });
  }
};

// Exporter toutes les fonctions du contrôleur
module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
