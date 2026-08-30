// Granular Skill Gap Analysis & Job Readiness Engine

/**
 * Compare candidate profile skills against target career requirements
 */
export function analyzeSkillGaps(targetCareer, userSkills = []) {
  const normalizedUserSkills = (userSkills || []).map((s) => s.toLowerCase().trim()).filter(Boolean);

  const strongCompetencies = [];
  const developingSkills = [];
  const missingCoreSkills = [];

  const required = targetCareer.requiredSkills || [];

  required.forEach((reqSkill) => {
    const reqName = reqSkill.name;
    const reqLower = reqName.toLowerCase();

    // 1. Direct or strong substring match
    const exactMatch = normalizedUserSkills.find(
      (us) => us === reqLower || us.includes(reqLower) || reqLower.includes(us)
    );

    // 2. Token / adjacent technology match
    const tokenMatch =
      !exactMatch &&
      reqLower.split(/[\s/]+/).some(
        (token) => token.length > 2 && normalizedUserSkills.some((us) => us.includes(token))
      );

    if (exactMatch) {
      strongCompetencies.push({
        name: reqName,
        targetLevel: reqSkill.level,
        importance: reqSkill.importance,
        whyItMatters: reqSkill.whyItMatters || "Core foundational competency for this role.",
        status: "Mastered / Active",
        confidencePercent: 90,
      });
    } else if (tokenMatch) {
      developingSkills.push({
        name: reqName,
        targetLevel: reqSkill.level,
        importance: reqSkill.importance,
        whyItMatters: reqSkill.whyItMatters || "Critical for scaling beyond beginner syntax.",
        status: "Developing / Familiar",
        confidencePercent: 55,
        recommendation: `Convert adjacent knowledge in ${reqName} into production-grade projects.`,
      });
    } else {
      missingCoreSkills.push({
        name: reqName,
        targetLevel: reqSkill.level,
        importance: reqSkill.importance,
        whyItMatters: reqSkill.whyItMatters || "Essential industry requirement for entry-level screening.",
        status: "Skill Gap",
        confidencePercent: 15,
        recommendation: `Priority focus: Start with structured documentation and hands-on exercises in ${reqName}.`,
      });
    }
  });

  // Calculate Weighted Job Readiness Metric
  const totalWeight = required.reduce((acc, s) => acc + (s.importance === "Core" ? 10 : 5), 0) || 1;
  const earnedWeight =
    strongCompetencies.reduce((acc, s) => acc + (s.importance === "Core" ? 10 : 5), 0) +
    developingSkills.reduce((acc, s) => acc + (s.importance === "Core" ? 5 : 2.5), 0);

  const readinessPercent = Math.min(Math.max(Math.round((earnedWeight / totalWeight) * 100), 20), 96);

  // Top 3 Priority Gaps with explicit justification
  const topPriorityGaps = getTopPriorityGaps(missingCoreSkills, developingSkills);

  return {
    targetCareerTitle: targetCareer.title,
    readinessPercent,
    summary: {
      totalRequiredCount: required.length,
      strongCount: strongCompetencies.length,
      developingCount: developingSkills.length,
      missingCount: missingCoreSkills.length,
    },
    strongCompetencies,
    developingSkills,
    missingCoreSkills,
    topPriorityGaps,
    priorityActionPlan: generateActionPlan(topPriorityGaps, developingSkills),
  };
}

/**
 * Identify top 3 highest-leverage skills to learn first with explicit 'Why it matters'
 */
function getTopPriorityGaps(missing, developing) {
  const combined = [
    ...missing.filter((m) => m.importance === "Core"),
    ...developing.filter((d) => d.importance === "Core"),
    ...missing.filter((m) => m.importance !== "Core"),
  ];

  return combined.slice(0, 3).map((skill, index) => ({
    rank: index + 1,
    name: skill.name,
    targetLevel: skill.targetLevel,
    whyItMatters: skill.whyItMatters,
    recommendation: skill.recommendation,
    estimatedRampUp: skill.importance === "Core" ? "3 - 4 weeks" : "1 - 2 weeks",
  }));
}

/**
 * Generate structured, timeline-bound action plan
 */
function generateActionPlan(topGaps, developing) {
  const plan = [];

  if (topGaps.length > 0) {
    plan.push({
      priority: "Priority 1 • Core Skill Acquisition",
      action: `Focus on mastering top priority gaps: ${topGaps.map((g) => g.name).join(", ")}.`,
      estimatedTime: "Weeks 1 - 4",
      rationale: topGaps[0]?.whyItMatters || "Foundational for role screening.",
    });
  }

  if (developing.length > 0) {
    plan.push({
      priority: "Priority 2 • Practical Project Hardening",
      action: `Harden developing competencies (${developing.slice(0, 2).map((d) => d.name).join(", ")}) by writing clean code with automated tests.`,
      estimatedTime: "Weeks 5 - 8",
      rationale: "Proves hands-on ability beyond tutorial theory.",
    });
  }

  plan.push({
    priority: "Priority 3 • Portfolio Verification & Mock Interviews",
    action: "Deploy a flagship project to a live public URL and prepare 3 behavioral and technical case studies.",
    estimatedTime: "Weeks 9 - 12",
    rationale: "Demonstrates end-to-end delivery to prospective hiring managers.",
  });

  return plan;
}
