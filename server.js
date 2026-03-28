// ============================
// Serveur principal Express
// Point d'entrée de l'application backend
// Portfolio de Armel Quepin Dehe
// ============================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Importation de la configuration de la base de données
const connectDB = require("./config/db");

// Importation des routes
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Importation de la fonction de seed admin
const { seedAdmin } = require("./controllers/adminController");

// ─────────────────────────────────────────────
// Chargement des variables d'environnement
// ─────────────────────────────────────────────
dotenv.config();

// ─────────────────────────────────────────────
// Connexion à la base de données MongoDB
// puis création de l'admin par défaut si inexistant
// ─────────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  await seedAdmin();
};

startServer();

// ─────────────────────────────────────────────
// Initialisation de l'application Express
// ─────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────
// Middlewares globaux
// ─────────────────────────────────────────────

// Activation de CORS pour permettre les requêtes depuis le frontend
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Parsing du corps des requêtes en JSON
app.use(express.json());

// Parsing des données URL-encoded (formulaires)
app.use(express.urlencoded({ extended: false }));

// ─────────────────────────────────────────────
// Routes de l'API
// ─────────────────────────────────────────────

// Routes pour les projets
app.use("/api/projects", projectRoutes);

// Routes pour les compétences
app.use("/api/skills", skillRoutes);

// Routes pour les messages de contact
app.use("/api/messages", messageRoutes);

// Routes pour l'authentification admin
app.use("/api/admin", adminRoutes);

// Routes pour l'assistant IA
app.use("/api/ai", aiRoutes);

// Routes pour les designs Canva
const designRoutes = require("./routes/designRoutes");
app.use("/api/designs", designRoutes);

// Route de Keep-Alive / Health Check
app.get("/api/ping", (req, res) => {
  res.status(200).json({ success: true, message: "Server is awake" });
});

// ─────────────────────────────────────────────
// Route de test - Vérification du serveur
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 API Portfolio de Armel Quepin Dehe - Serveur actif",
    version: "1.0.0",
    endpoints: {
      projects: "/api/projects",
      skills: "/api/skills",
      messages: "/api/messages",
      admin: "/api/admin",
    },
  });
});

// ─────────────────────────────────────────────
// Gestion des routes inexistantes (404)
// ─────────────────────────────────────────────
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} introuvable`,
  });
});

// ─────────────────────────────────────────────
// Démarrage du serveur
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🌐 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL locale : http://localhost:${PORT}`);
  console.log(`📌 Endpoints disponibles :`);
  console.log(`   → GET    http://localhost:${PORT}/api/projects`);
  console.log(`   → POST   http://localhost:${PORT}/api/projects  [🔒 admin]`);
  console.log(`   → GET    http://localhost:${PORT}/api/skills`);
  console.log(`   → POST   http://localhost:${PORT}/api/skills    [🔒 admin]`);
  console.log(`   → POST   http://localhost:${PORT}/api/messages`);
  console.log(`   → GET    http://localhost:${PORT}/api/messages  [🔒 admin]`);
  console.log(`   → POST   http://localhost:${PORT}/api/admin/login`);
  console.log(`   → GET    http://localhost:${PORT}/api/admin/profile [🔒 admin]`);
  console.log(`   → PUT    http://localhost:${PORT}/api/admin/profile [🔒 admin]\n`);
});
