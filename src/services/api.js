// Client API Service for AI Career Insights and Career Advisor Chat
import { store } from "../state/store.js";

/**
 * Generate deep AI career insights from backend or local intelligent fallback
 */
export async function fetchAiCareerInsights(profile) {
  try {
    const response = await fetch("/api/career-guidance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.info("Using local AI-calibrated intelligence engine:", error.message);
    // Return ranked recommendations from local calculation
    store.recomputeCareerIntelligence();
    return {
      source: "local_engine",
      career_recommendations: store.state.recommendations.slice(0, 3),
    };
  }
}

/**
 * Send query to AI Career Advisor assistant
 */
export async function sendAdvisorChatQuery(userQuery, profile, targetCareer) {
  try {
    const response = await fetch("/api/advisor-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: userQuery,
        profile,
        targetCareer,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.info("Using local contextual advisor heuristic engine:", error.message);
    return generateContextualLocalAdvisorReply(userQuery, profile, targetCareer);
  }
}

/**
 * High-quality fallback rule-based contextual advisor replies when backend is offline
 */
function generateContextualLocalAdvisorReply(query, profile, targetCareer) {
  const q = query.toLowerCase();
  const career = targetCareer || { title: "Software Engineering", requiredSkills: [] };
  const userSkills = profile.skills || [];

  if (q.includes("learn next") || q.includes("next step") || q.includes("where to start")) {
    const missing = career.requiredSkills
      ?.filter((s) => !userSkills.some((us) => us.toLowerCase().includes(s.name.toLowerCase())))
      .slice(0, 3)
      .map((s) => s.name)
      .join(", ");

    return `Based on your target of **${career.title}**, your highest-yield priority right now is to tackle your core missing competencies: **${missing || "production architecture and automated testing"}**. I recommend diving into Month 1–2 of your roadmap, dedicating 10–12 hours/week to hands-on coding rather than just watching tutorials.`;
  }

  if (q.includes("project") || q.includes("build") || q.includes("portfolio")) {
    return `For **${career.title}**, recruiters look for projects that demonstrate problem solving and end-to-end delivery rather than simple clone apps. Check the **Portfolio Projects** tab for your tailored project tier—specifically, building a production-grade system with automated CI/CD and measurable throughput metrics will give you immense portfolio leverage.`;
  }

  if (q.includes("resume") || q.includes("cv") || q.includes("interview")) {
    return `To make your resume standout for **${career.title}** roles:\n\n1. **Use the Google XYZ Formula**: "Accomplished [X] as measured by [Y], by doing [Z]".\n2. **Highlight Quantifiable Outcomes**: Mention latency cuts, test coverage %, or database query speedups.\n3. **Link Live Demos**: Ensure every GitHub project has a deployed live link and architecture diagram in the README.`;
  }

  if (q.includes("ready") || q.includes("internship") || q.includes("job")) {
    const readiness = store.getGapAnalysis().readinessPercent;
    return `Your calculated role readiness for **${career.title}** is currently **${readiness}%**. You have a solid foundation in ${userSkills.slice(0, 3).join(", ")}. Completing 2 structured portfolio projects and 3 roadmap milestones will position you favorably for entry-level and internship screenings.`;
  }

  return `Regarding your journey toward **${career.title}**: Ensure you maintain steady consistency across your 6-month roadmap. Focus heavily on turning theoretical concepts into verifiable GitHub repositories and case studies. Feel free to ask me for specific learning resources, project breakdowns, or interview mock questions!`;
}

