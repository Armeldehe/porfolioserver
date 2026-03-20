// ============================
// Middleware d'authentification JWT
// Protège les routes privées de l'API
// ============================

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

/**
 * Middleware protect :
 * Vérifie le token JWT dans les headers et autorise l'accès
 * Utilisation : router.get("/route", protect, controller)
 */
const protect = async (req, res, next) => {
  let token;

  // Vérifier si le header Authorization contient un Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extraire le token du header (format : "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Vérifier et décoder le token avec la clé secrète
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'admin associé au token (sans son mot de passe)
      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: "Administrateur introuvable, accès refusé",
        });
      }

      // Passer au middleware ou contrôleur suivant
      next();
    } catch (error) {
      // Token invalide ou expiré
      return res.status(401).json({
        success: false,
        message: "Token invalide ou expiré, accès refusé",
      });
    }
  } else {
    // Aucun token fourni dans les headers
    return res.status(401).json({
      success: false,
      message: "Aucun token fourni, accès non autorisé",
    });
  }
};

module.exports = { protect };
