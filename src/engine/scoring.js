// Multi-Factor Career Matching & Explainability Engine
import { careerCatalog } from "../data/careers.js";

/**
 * Tokenize and normalize user profile strings for semantic keyword matching
 */
export function normalizeText(text) {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Calculate multi-factor match score between user profile and a career
 */
export function scoreCareerMatch(career, profile) {
  const profileTokens = [
    profile.fullName,
    profile.educationLevel,
    profile.degreeOrStream,
    profile.interestsText,
    (profile.selectedInterests || []).join(" "),
    (profile.skills || []).join(" "),
    profile.subjectsText,
    profile.strengthsText,
    profile.workStyle,
    profile.careerGoals,
    profile.dreamOutcome,
    profile.experienceDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // 1. Skill Match (Weight: 40 points max)
  const userSkills = (profile.skills || []).map((s) => s.toLowerCase().trim());
  let coreSkillMatches = 0;
  let preferredSkillMatches = 0;
  const coreSkillsTotal = career.requiredSkills.filter((s) => s.importance === "Core").length || 1;
  const preferredSkillsTotal = career.requiredSkills.filter((s) => s.importance !== "Core").length || 1;

  career.requiredSkills.forEach((req) => {
    const reqName = req.name.toLowerCase();
    const isDirectMatch = userSkills.some(
      (us) =>
        us === reqName ||
        us.includes(reqName) ||
        reqName.includes(us) ||
        reqName.split(/[\s/]+/).some((part) => part.length > 2 && us.includes(part))
    );

    if (isDirectMatch) {
      if (req.importance === "Core") coreSkillMatches++;
      else preferredSkillMatches++;
    }
  });

  const coreRatio = coreSkillMatches / coreSkillsTotal;
  const prefRatio = preferredSkillMatches / preferredSkillsTotal;
  // Scaled progressive curve: 35 pts for core skills + 5 for preferred
  const normalizedSkillScore = Math.min(Math.round(Math.pow(coreRatio, 0.85) * 35 + prefRatio * 5), 40);

  // 2. Interest & Keyword Match (Weight: 25 points max)
  let keywordHits = 0;
  career.matchKeywords.forEach((kw) => {
    if (profileTokens.includes(kw)) {
      keywordHits++;
    }
  });
  const normalizedInterestScore = Math.min(Math.round(Math.min(keywordHits, 5) * 5), 25);

  // 3. Subject & Background Alignment (Weight: 15 points max)
  let subjectHits = 0;
  career.recommendedSubjects.forEach((subj) => {
    if (profileTokens.includes(subj)) {
      subjectHits++;
    }
  });
  const normalizedSubjectScore = Math.min(Math.round(Math.min(subjectHits, 3) * 5), 15);

  // 4. Work Style Fit (Weight: 10 points max)
  let styleScore = 5; // Baseline
  if (profile.workStyle && career.workStyles.includes(profile.workStyle.toLowerCase())) {
    styleScore = 10;
  }
  const normalizedStyleScore = Math.min(styleScore, 10);

  // 5. Strengths Alignment (Weight: 10 points max)
  let strengthHits = 0;
  career.strengths.forEach((str) => {
    if (profileTokens.includes(str)) {
      strengthHits++;
    }
  });
  const normalizedStrengthScore = Math.min(Math.round(5 + Math.min(strengthHits, 2) * 2.5), 10);

  // Total Score Calculation (Calculated out of 100)
  const rawTotal =
    normalizedSkillScore +
    normalizedInterestScore +
    normalizedSubjectScore +
    normalizedStyleScore +
    normalizedStrengthScore;

  // Add realistic calibration floor (minimum 40%, capped at 97% to maintain realistic AI estimation honesty)
  const matchScore = Math.min(Math.max(rawTotal, 42), 97);

  // Qualitative match tier
  let matchTier = "Moderate Alignment";
  if (matchScore >= 80) matchTier = "High Match (Top Recommendation)";
  else if (matchScore >= 65) matchTier = "Strong Potential";
  else if (matchScore >= 50) matchTier = "Developing Alignment";

  const matchingSkillsCount = coreSkillMatches + preferredSkillMatches;

  return {
    careerId: career.id,
    careerTitle: career.title,
    category: career.category,
    matchScore,
    matchTier,
    breakdown: {
      skillsScore: normalizedSkillScore,
      skillsMax: 40,
      interestScore: normalizedInterestScore,
      interestMax: 25,
      educationScore: normalizedSubjectScore,
      educationMax: 15,
      workStyleScore: normalizedStyleScore,
      workStyleMax: 10,
      strengthScore: normalizedStrengthScore,
      strengthMax: 10,
    },
    matchingSkillsCount,
    totalSkillsRequired: career.requiredSkills.length,
    whyItFits: generateFitRationale(career, profile, {
      matchingSkillsCount,
      hasStyleMatch: normalizedStyleScore > 5,
    }),
    careerDetails: career,
  };
}

/**
 * Generate transparent, personalized explanation for why a career matched
 */
function generateFitRationale(career, profile, stats) {
  const highlights = [];

  if (stats.matchingSkillsCount > 0) {
    highlights.push(`${stats.matchingSkillsCount} overlapping technical skills in your current profile`);
  }

  if (profile.interestsText && career.matchKeywords.some((k) => profile.interestsText.toLowerCase().includes(k))) {
    highlights.push("active curiosity in related domain technologies");
  }

  if (stats.hasStyleMatch) {
    highlights.push(`your preferred ${profile.workStyle || "practical"} working style`);
  }

  if (highlights.length === 0) {
    return career.whyItFitsSummary;
  }

  return `High synergy driven by ${highlights.join(", ")}, positioning you well for this learning path.`;
}

/**
 * Score all careers and rank top recommendations
 */
export function getRankedRecommendations(profile) {
  const scored = careerCatalog.map((career) => scoreCareerMatch(career, profile));
  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored;
}
