// ============================
// Contrôleur : Admin
// Authentification et gestion du profil administrateur
// ============================

const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// ─────────────────────────────────────────────
// Utilitaire : Générer un token JWT
// ─────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valide pendant 7 jours
  });
};

// ─────────────────────────────────────────────
// POST /api/admin/login - Connexion de l'administrateur
// ─────────────────────────────────────────────
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier que les champs requis sont fournis
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un email et un mot de passe",
      });
    }

    // Rechercher l'admin par son email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe avec la méthode du modèle
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Générer le token JWT et retourner les informations admin
    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/admin/profile - Récupérer le profil admin (route protégée)
// ─────────────────────────────────────────────
const getAdminProfile = async (req, res) => {
  try {
    // L'admin est déjà injecté par le middleware protect (req.admin)
    res.status(200).json({
      success: true,
      data: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        createdAt: req.admin.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// Fonction utilitaire : Créer l'admin par défaut (seed)
// À appeler au démarrage du serveur si aucun admin n'existe
// ─────────────────────────────────────────────
const seedAdmin = async () => {
  try {
    // Vérifier si un admin existe déjà dans la base de données
    const existingAdmin = await Admin.findOne({ email: "admin@armel.com" });

    if (!existingAdmin) {
      // Créer l'admin par défaut (le mot de passe sera hashé automatiquement)
      await Admin.create({
        name: "Armel Quepin Dehe",
        email: "admin@armel.com",
        password: "admin123",
        role: "admin",
      });
      console.log("✅ Admin par défaut créé : admin@armel.com / admin123");
    } else {
      console.log("ℹ️  Admin déjà existant en base de données");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin par défaut :", error.message);
  }
};

// ─────────────────────────────────────────────
// PUT /api/admin/profile - Mettre à jour le profil admin (route protégée)
// ─────────────────────────────────────────────
const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
      // Mettre à jour les champs si fournis
      admin.name  = req.body.name || admin.name;
      admin.email = req.body.email || admin.email;
      
      if (req.body.password) {
        admin.password = req.body.password;
      }

      const updatedAdmin = await admin.save();

      res.status(200).json({
        success: true,
        message: "Profil mis à jour avec succès",
        admin: {
          id: updatedAdmin._id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          role: updatedAdmin.role,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Administrateur non trouvé",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du profil",
      error: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  seedAdmin,
};
