// ============================
// Configuration de la base de données MongoDB
// Connexion via Mongoose
// ============================

const mongoose = require("mongoose");

/**
 * Fonction de connexion à MongoDB
 * Utilise la variable d'environnement MONGO_URI
 */
const connectDB = async () => {
  try {
    // Connexion à MongoDB avec l'URI définie dans .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connecté avec succès : ${conn.connection.host}`);
  } catch (error) {
    // En cas d'erreur de connexion, afficher le message et quitter le processus
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
