import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.use(express.json());
app.use(express.static(__dirname));

const careerCatalog = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    keywords: ["coding", "programming", "apps", "software", "web", "logic", "computer"],
    subjects: ["maths", "mathematics", "computer science", "informatics"],
    workStyles: ["analytical", "practical"],
    strengths: ["problem solving", "logical thinking", "creativity"],
    explanation:
      "This path fits students who enjoy coding, mathematics, and solving structured problems by building real products and systems.",
    skills: ["Programming fundamentals", "Data structures", "Web development", "Git and GitHub", "Problem solving"],
    roadmap: [
      "Start with one language such as JavaScript, Python, or Java and build small projects every week.",
      "Learn core computer science topics like data structures, algorithms, and databases.",
      "Create portfolio projects such as websites, apps, or tools and publish them on GitHub.",
      "Apply for internships, coding competitions, or freelance work to gain practical experience."
    ]
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    keywords: ["data", "statistics", "coding", "analysis", "research", "numbers"],
    subjects: ["maths", "mathematics", "statistics", "computer science", "economics"],
    workStyles: ["analytical"],
    strengths: ["logical thinking", "curiosity", "problem solving"],
    explanation:
      "This is a strong option for students who like maths, coding, patterns, and learning from data to make decisions.",
    skills: ["Python", "Statistics", "Data visualization", "Machine learning basics", "SQL"],
    roadmap: [
      "Build a strong base in mathematics, statistics, and Python programming.",
      "Practice analyzing datasets and presenting insights with charts and dashboards.",
      "Learn machine learning basics and complete beginner projects like prediction models.",
      "Create a portfolio of data projects and look for internships in analytics or AI teams."
    ]
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    keywords: ["ai", "machine learning", "coding", "automation", "intelligence", "models"],
    subjects: ["maths", "mathematics", "computer science", "physics", "statistics"],
    workStyles: ["analytical", "creative"],
    strengths: ["problem solving", "logical thinking", "curiosity"],
    explanation:
      "AI engineering suits students who love coding and maths and want to create smart systems that can learn and automate tasks.",
    skills: ["Python", "Linear algebra", "Machine learning", "Model deployment", "Prompt design"],
    roadmap: [
      "Learn Python deeply and strengthen maths topics such as probability, algebra, and calculus.",
      "Study machine learning fundamentals and build projects like chatbots or recommendation systems.",
      "Understand how to use AI APIs, train simple models, and deploy them in applications.",
      "Showcase AI projects publicly and pursue internships in AI, ML, or software product teams."
    ]
  },
  {
    id: "ux-designer",
    title: "UX/UI Designer",
    keywords: ["design", "creativity", "interface", "user", "visual", "apps"],
    subjects: ["art", "psychology", "computer science", "english"],
    workStyles: ["creative"],
    strengths: ["creativity", "communication", "empathy"],
    explanation:
      "Students who enjoy creativity, digital products, and understanding how people think can do very well in UX/UI design.",
    skills: ["Wireframing", "Visual design", "User research", "Figma", "Design systems"],
    roadmap: [
      "Learn design principles, typography, color, and layout through small interface redesigns.",
      "Practice using design tools like Figma to create app and website screens.",
      "Study user research and usability so designs solve real student or customer problems.",
      "Build a portfolio of case studies and apply for internships in product design or UI design."
    ]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    keywords: ["security", "networks", "systems", "hacking", "coding", "protection"],
    subjects: ["computer science", "maths", "mathematics", "technology"],
    workStyles: ["analytical", "practical"],
    strengths: ["attention to detail", "logical thinking", "problem solving"],
    explanation:
      "This path is ideal for students who are curious about systems, digital safety, and solving technical threats.",
    skills: ["Networking", "Linux basics", "Security fundamentals", "Scripting", "Threat analysis"],
    roadmap: [
      "Understand how computers, operating systems, and networks work.",
      "Practice basic scripting and learn security concepts such as vulnerabilities and authentication.",
      "Use beginner labs and ethical hacking platforms to develop hands-on skills safely.",
      "Work toward certifications, projects, or internships in security operations and system protection."
    ]
  },
  {
    id: "product-manager",
    title: "Product Manager",
    keywords: ["business", "apps", "planning", "strategy", "leadership", "technology"],
    subjects: ["economics", "maths", "english", "computer science"],
    workStyles: ["leadership", "creative"],
    strengths: ["communication", "leadership", "problem solving"],
    explanation:
      "Students who like technology, decision-making, and coordinating people can grow into product management.",
    skills: ["Communication", "Market research", "Roadmapping", "Product thinking", "Team collaboration"],
    roadmap: [
      "Learn how digital products are built and how user problems are identified.",
      "Practice writing feature ideas, simple product plans, and user stories.",
      "Collaborate on projects with designers and developers to understand cross-functional work.",
      "Build a portfolio of product case studies and seek internships in product or operations roles."
    ]
  }
];

function tokenizeProfile(payload) {
  return [
    payload.studentName,
    payload.studentStage,
    payload.interests,
    payload.subjects,
    payload.strengths,
    payload.workStyle,
    payload.goals,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function scoreCareer(career, profileText, payload) {
  let score = 45;

  career.keywords.forEach((keyword) => {
    if (profileText.includes(keyword)) {
      score += 8;
    }
  });

  career.subjects.forEach((subject) => {
    if (profileText.includes(subject)) {
      score += 6;
    }
  });

  career.strengths.forEach((strength) => {
    if (profileText.includes(strength)) {
      score += 5;
    }
  });

  if (payload.workStyle && career.workStyles.includes(payload.workStyle)) {
    score += 10;
  }

  if (profileText.includes("coding") && profileText.includes("math")) {
    if (career.id === "software-engineer" || career.id === "data-scientist" || career.id === "ai-engineer") {
      score += 14;
    }
  }

  return Math.min(score, 98);
}

function buildLocalRecommendations(payload) {
  const profileText = tokenizeProfile(payload);

  const topCareers = careerCatalog
    .map((career) => ({
      career_title: career.title,
      match_score: scoreCareer(career, profileText, payload),
      explanation: career.explanation,
      required_skills: career.skills,
      roadmap: career.roadmap,
    }))
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 3);

  return { career_recommendations: topCareers };
}

async function buildAiRecommendations(payload) {
  if (!openai) {
    return buildLocalRecommendations(payload);
  }

  const prompt = `
You are a helpful AI career assistant for students.

Analyze this student profile and recommend exactly 3 careers.
Return only valid JSON with this shape:
{
  "career_recommendations": [
    {
      "career_title": "string",
      "match_score": 0,
      "explanation": "string",
      "required_skills": ["string"],
      "roadmap": ["string", "string", "string", "string"]
    }
  ]
}

Student profile:
${JSON.stringify(payload, null, 2)}
`;

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  const rawText = response.output_text?.trim();

  if (!rawText) {
    throw new Error("AI returned an empty response.");
  }

  return JSON.parse(rawText);
}

app.post("/api/career-guidance", async (req, res) => {
  const payload = req.body || {};

  if (!payload.interests || !payload.subjects || !payload.goals) {
    return res.status(400).json({
      error: "Interests, favorite subjects, and goals/confusion are required.",
    });
  }

  try {
    const result = await buildAiRecommendations(payload);
    res.json({ result });
  } catch (error) {
    console.error("Career guidance error:", error);

    try {
      const fallback = buildLocalRecommendations(payload);
      res.json({
        result: fallback,
        fallback: true,
      });
    } catch {
      res.status(500).json({
        error: "Unable to generate career guidance right now.",
      });
    }
  }
});

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Career Assistant running at http://localhost:${port}`);
});
