const express  = require("express");
const router   = express.Router();
const rateLimit = require("express-rate-limit");
const OpenAI   = require("openai");

// ─── Rate limiter ────────────────────────────────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,    // 5 minutes
  max: 20,                     // 20 requêtes max par fenêtre
  message: { error: "Trop de messages. Réessayez dans quelques minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── OpenAI client (initialisé à la demande) ──────────────────────────────────
let openai = null;
const getOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};

// ─── Contexte / System Prompt ────────────────────────────────────────────────
const SYSTEM_PROMPT = `Tu es l'assistant IA officiel d'Armel Quepin Dehe, développeur Fullstack MERN certifié.

PROFIL D'ARMEL :
- Développeur Fullstack MERN (MongoDB, Express.js, React.js, Node.js)
- Expert React, Next.js, TailwindCSS, Framer Motion
- Maîtrise Canva pour le design graphique et CapCut pour la création vidéo
- Disponible pour missions freelance et opportunités CDI
- Passionné par les applications modernes, performantes et à design premium
- Réalise des projets complets (frontend + backend + base de données)
- Travaille à distance et en présentiel

TON RÔLE :
- Représenter Armel de manière professionnelle et valorisante
- Répondre aux questions sur ses compétences, projets, disponibilité, tarifs
- Orienter les visiteurs vers la prise de contact
- Rester concis, professionnel et engageant

RÈGLES :
- Réponses en FRANÇAIS par défaut (adapte-toi à la langue du visiteur)
- Maximum 150 mots par réponse
- Toujours proposer une action (voir projets, me contacter, découvrir les skills)
- Ne jamais inventer de faits précis sur des projets ou clients spécifiques
- Si une question sort du contexte portfolio, redirige poliment vers le sujet

CALL-TO-ACTION : Toujours terminer par une suggestion comme "Voulez-vous voir mes projets ?" ou "N'hésitez pas à me contacter directement !"`;

// ─── Fallback sans clé API ────────────────────────────────────────────────────
const FALLBACKS = {
  default: "Je suis l'assistant d'Armel Dehe, développeur Fullstack MERN. Armel est disponible pour vos projets web — de la conception à la mise en ligne. Souhaitez-vous voir ses projets ou le contacter directement ?",
  skills:  "Armel maîtrise React, Node.js, Express, MongoDB, TailwindCSS, Framer Motion. Il crée des applications complètes avec une attention particulière au design premium et aux performances. Voulez-vous en savoir plus ?",
  contact: "Vous pouvez contacter Armel via le formulaire de contact sur ce site, ou par email. Il répond généralement sous 24h et est disponible pour des missions freelance comme en CDI.",
  projects:"Armel a réalisé plusieurs applications web fullstack, des dashboards admin, des portfolios et des applications e-commerce. Chaque projet est pensé pour être performant et agréable à utiliser. Souhaitez-vous voir le portfolio complet ?",
};

function getFallback(message) {
  const m = message.toLowerCase();
  if (m.includes("compétence") || m.includes("skill") || m.includes("technolog") || m.includes("maîtri")) return FALLBACKS.skills;
  if (m.includes("contact") || m.includes("email") || m.includes("disponib") || m.includes("freelance")) return FALLBACKS.contact;
  if (m.includes("projet") || m.includes("réalis") || m.includes("application") || m.includes("travail")) return FALLBACKS.projects;
  return FALLBACKS.default;
}

// ─── POST /api/ai/chat ────────────────────────────────────────────────────────
router.post("/chat", chatLimiter, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message requis." });
    }
    if (message.length > 500) {
      return res.status(400).json({ error: "Message trop long (max 500 caractères)." });
    }

    const client = getOpenAI();

    // Sans clé API → réponse fallback
    if (!client) {
      return res.json({ reply: getFallback(message), fallback: true });
    }

    // Construire l'historique de conversation (max 6 derniers messages)
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    const completion = await client.chat.completions.create({
      model:      "gpt-4o-mini",
      messages,
      max_tokens: 250,
      temperature: 0.75,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || FALLBACKS.default;
    res.json({ reply });

  } catch (err) {
    console.error("[AI Chat Error]", err.message);
    res.status(500).json({ reply: FALLBACKS.default, error: true });
  }
});

module.exports = router;
