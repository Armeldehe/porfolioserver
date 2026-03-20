// ============================
// Routes : Projects
// Définition des routes pour les projets
// ============================

const express = require("express");
const router = express.Router();

// Importation du contrôleur des projets
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// Importation du middleware d'authentification JWT
const { protect } = require("../middleware/authMiddleware");

// Route GET - Récupérer tous les projets
router.get("/", getAllProjects);

// Route GET - Récupérer un projet par son ID
router.get("/:id", getProjectById);

// Route POST - Créer un nouveau projet (protégée : admin uniquement)
router.post("/", protect, createProject);

// Route PUT - Mettre à jour un projet existant (protégée : admin uniquement)
router.put("/:id", protect, updateProject);

// Route DELETE - Supprimer un projet (protégée : admin uniquement)
router.delete("/:id", protect, deleteProject);

module.exports = router;
