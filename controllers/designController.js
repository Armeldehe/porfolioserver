const Design = require("../models/designModel");

// @desc    Obtenir tous les designs
// @route   GET /api/designs
// @access  Public
exports.getDesigns = async (req, res) => {
  try {
    const designs = await Design.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: designs.length,
      data: designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des designs",
      error: error.message
    });
  }
};

// @desc    Créer un design
// @route   POST /api/designs
// @access  Private/Admin
exports.createDesign = async (req, res) => {
  try {
    const { title, description, imageUrl, category } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un titre et une URL d'image"
      });
    }

    const design = await Design.create({
      title,
      description,
      imageUrl,
      category
    });

    res.status(201).json({
      success: true,
      data: design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du design",
      error: error.message
    });
  }
};

// @desc    Supprimer un design
// @route   DELETE /api/designs/:id
// @access  Private/Admin
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design non trouvé"
      });
    }

    await design.deleteOne();

    res.status(200).json({
      success: true,
      message: "Design supprimé avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du design",
      error: error.message
    });
  }
};
