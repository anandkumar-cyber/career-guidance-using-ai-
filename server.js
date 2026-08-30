import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
import { careerCatalog } from "./src/data/careers.js";
import { getRankedRecommendations } from "./src/engine/scoring.js";
import { analyzeSkillGaps } from "./src/engine/gapAnalysis.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;

// Initialize OpenAI client safely
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Middleware
app.use(express.json({ limit: "500kb" }));
app.use(express.static(__dirname));

// Security & CORS response headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Memory rate limiter for API routes
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 40;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || "global";
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - clientData.startTime > RATE_LIMIT_WINDOW_MS) {
    clientData.count = 1;
    clientData.startTime = now;
  } else {
    clientData.count++;
  }

  rateLimitMap.set(ip, clientData);

  if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: "Too many requests. Please wait a minute before trying again.",
    });
  }

  next();
}

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    aiAdvisorEnabled: Boolean(openai),
    careersCatalogCount: careerCatalog.length,
    engineMode: openai ? "Hybrid Deterministic + LLM" : "Offline Algorithmic Engine",
  });
});

/**
 * AI Career Analysis Endpoint (Structured JSON Output with Strict Guardrails)
 */
app.post("/api/career-guidance", rateLimiter, async (req, res) => {
  const profile = req.body || {};

  // Basic input validation
  if (!profile.interestsText && !profile.skills?.length && !profile.careerGoals) {
    return res.status(400).json({
      error: "Please provide at least skills, domain interests, or career goals for analysis.",
    });
  }

  // 1. Calculate deterministic fact-based baseline
  const localRankings = getRankedRecommendations(profile);
  const topMatches = localRankings.slice(0, 3);
  const topCareer = topMatches[0]?.careerDetails || careerCatalog[0];
  const gaps = analyzeSkillGaps(topCareer, profile.skills);

  // If no OpenAI key configured, return algorithmic output immediately
  if (!openai) {
    return res.json({
      result: {
        source: "deterministic_algorithmic_engine",
        disclaimer: "Estimated profile compatibility score calculated via deterministic multi-factor match algorithms. Not a scientific or employment guarantee.",
        career_recommendations: topMatches,
        topGaps: gaps.topPriorityGaps,
      },
    });
  }

  try {
    const prompt = `You are a Principal Career Intelligence Advisor.
Analyze this candidate profile against structured deterministic match facts.

CRITICAL GUARDRAILS:
- Do NOT invent user skills, degrees, certifications, or employment history.
- Ground all advice strictly in candidate inputs and target role competencies.

Structured Facts:
- Top Career Fit: ${topCareer.title} (${topMatches[0]?.matchScore}% estimated fit)
- Verified Candidate Skills: ${(profile.skills || []).join(", ") || "None specified"}
- Verified Skill Gaps: ${gaps.missingCoreSkills.map((m) => m.name).join(", ") || "None"}
- Candidate Goals: ${profile.careerGoals || "Career advancement"}

Return a strict JSON object adhering exactly to this schema:
{
  "career": "${topCareer.title}",
  "matchExplanation": "2-3 sentences explaining specific alignment between verified skills and role requirements",
  "strengths": ["string array of 2-3 verified strengths"],
  "skillGaps": ["string array of top 2-3 verified missing skills"],
  "recommendedActions": ["string array of 3 prioritized concrete actions for Weeks 1-4"],
  "roadmapAdjustments": ["string array of 2 tailored recommendations to adjust standard learning roadmap"],
  "confidenceNotes": "Estimated match note based on candidate's provided skills"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional technical career advisor. Output valid JSON only." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 800,
    });

    const parsedAiResult = JSON.parse(completion.choices[0].message.content || "{}");

    res.json({
      result: {
        source: "hybrid_ai_engine",
        disclaimer: "Estimated match based on candidate profile inputs and industry competency benchmarks. Not an employment guarantee.",
        aiStructuredAnalysis: parsedAiResult,
        career_recommendations: topMatches,
        topGaps: gaps.topPriorityGaps,
      },
    });
  } catch (error) {
    console.error("OpenAI API call failed, falling back to algorithmic engine:", error.message);
    res.json({
      result: {
        source: "deterministic_algorithmic_engine_fallback",
        disclaimer: "Estimated profile compatibility score calculated via deterministic multi-factor match algorithms.",
        career_recommendations: topMatches,
        topGaps: gaps.topPriorityGaps,
      },
    });
  }
});

/**
 * Context-Aware AI Career Advisor Chat Endpoint
 */
app.post("/api/advisor-chat", rateLimiter, async (req, res) => {
  const { query, profile, targetCareer } = req.body || {};

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Valid query string is required." });
  }

  // Restrict query length for security
  const sanitizedQuery = String(query).substring(0, 500);

  if (!openai) {
    return res.json({
      reply: `**Offline Career Guidance Engine**: For **${targetCareer?.title || "your target role"}**, focus on mastering your top missing skills (${(targetCareer?.requiredSkills || []).slice(0, 2).map((s) => s.name).join(", ")}), deploying a GitHub portfolio project, and following your phased roadmap.`,
    });
  }

  try {
    const systemPrompt = `You are the Context-Aware AI Career Advisor for the Career Intelligence Platform.
You are mentoring a candidate targeting the role of: ${targetCareer?.title || "Software Engineering"}.

CANDIDATE CONTEXT:
- Academic Level: ${profile?.educationLevel || "Not specified"} (${profile?.degreeOrStream || "Tech"})
- Verified Skills: ${(profile?.skills || []).join(", ") || "None"}
- Target Ambition: ${profile?.careerGoals || "Career advancement"}

GUARDRAILS:
- Never fabricate candidate experience, certifications, or past achievements.
- Provide structured, practical, encouraging advice.
- Use markdown bolding and bullet lists for readability. Keep answers within 3-4 concise paragraphs.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: sanitizedQuery },
      ],
      temperature: 0.6,
      max_tokens: 600,
    });

    const reply = completion.choices[0].message.content || "I am analyzing your path. Keep building!";
    res.json({ reply });
  } catch (error) {
    console.error("Advisor chat error:", error.message);
    res.json({
      reply: `For **${targetCareer?.title || "your target role"}**, prioritize building projects that solve real problems, writing clean documentation, and practicing core problem-solving.`,
    });
  }
});

// Serve frontend for all SPA routes
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Career Intelligence Platform active at http://localhost:${port}`);
});
