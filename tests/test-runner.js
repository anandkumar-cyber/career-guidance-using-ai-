// Comprehensive Automated Test Runner for AI Career Intelligence Platform
import assert from "assert";
import { careerCatalog } from "../src/data/careers.js";
import { skillTaxonomy } from "../src/data/skills.js";
import { projectCatalog } from "../src/data/projects.js";
import { scoreCareerMatch, getRankedRecommendations } from "../src/engine/scoring.js";
import { analyzeSkillGaps } from "../src/engine/gapAnalysis.js";
import { generateCareerRoadmap } from "../src/engine/roadmapGenerator.js";

console.log("==========================================================");
console.log("RUNNING AUTOMATED TEST SUITE: AI CAREER INTELLIGENCE PLATFORM");
console.log("==========================================================");

let testsPassed = 0;
let testsFailed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
    testsFailed++;
  }
}

// --------------------------------------------------------------------------
// 1. Career Catalog Data Integrity
// --------------------------------------------------------------------------
console.log("\n[Group 1: Career Catalog Integrity]");

it("should contain at least 15 comprehensive industry career tracks", () => {
  assert.ok(careerCatalog.length >= 15, `Catalog only has ${careerCatalog.length} careers`);
});

it("every career track must have complete, valid structured fields", () => {
  careerCatalog.forEach((career) => {
    assert.ok(career.id, "Missing id");
    assert.ok(career.title, `Missing title in ${career.id}`);
    assert.ok(career.category, `Missing category in ${career.id}`);
    assert.ok(career.shortDescription, `Missing shortDescription in ${career.id}`);
    assert.ok(Array.isArray(career.requiredSkills) && career.requiredSkills.length >= 4, `Insufficient skills in ${career.id}`);
    assert.ok(career.salaryRange, `Missing salaryRange in ${career.id}`);
    assert.ok(career.difficulty, `Missing difficulty in ${career.id}`);
    assert.ok(career.marketDemand, `Missing marketDemand in ${career.id}`);
    assert.ok(career.whyItFitsSummary, `Missing whyItFitsSummary in ${career.id}`);

    // Verify each skill has whyItMatters justification
    career.requiredSkills.forEach((s) => {
      assert.ok(s.name, `Missing skill name in ${career.id}`);
      assert.ok(s.whyItMatters, `Missing whyItMatters in skill ${s.name} of ${career.id}`);
    });
  });
});

// --------------------------------------------------------------------------
// 2. Deterministic Multi-Factor Scoring Engine
// --------------------------------------------------------------------------
console.log("\n[Group 2: Multi-Factor Scoring Engine]");

it("should rank AI Engineer top for Python + Math + Deep Learning profile", () => {
  const profile = {
    skills: ["Python", "PyTorch", "Linear Algebra", "Scikit-Learn"],
    interestsText: "Machine learning, neural networks, transformers",
    subjectsText: "Mathematics, Calculus, Statistics",
    workStyle: "analytical",
    careerGoals: "AI Engineer",
  };

  const ranked = getRankedRecommendations(profile);
  assert.ok(ranked.length >= 3, "Did not return ranked list");
  assert.strictEqual(ranked[0].careerId, "ai-engineer", `Expected ai-engineer, got ${ranked[0].careerId}`);
  assert.ok(ranked[0].matchScore >= 80, `Expected score >= 80, got ${ranked[0].matchScore}`);
});

it("should rank Cybersecurity top for Networking + Linux + Security profile", () => {
  const profile = {
    skills: ["TCP/IP Networking", "Linux", "SIEM", "Python"],
    interestsText: "Ethical hacking, threat detection, firewalls",
    subjectsText: "Networking, Cryptography",
    workStyle: "investigative",
    careerGoals: "Security Analyst",
  };

  const ranked = getRankedRecommendations(profile);
  assert.ok(ranked[0].careerId.includes("security") || ranked[0].careerId.includes("cyber"), `Expected security role, got ${ranked[0].careerId}`);
});

it("score breakdowns should sum up transparently without exceeding maximum caps", () => {
  const profile = { skills: ["JavaScript", "React", "Node.js"] };
  const scoreData = scoreCareerMatch(careerCatalog[0], profile);
  const b = scoreData.breakdown;

  assert.ok(b.skillsScore <= b.skillsMax, "Skills score exceeded maximum cap");
  assert.ok(b.interestScore <= b.interestMax, "Interest score exceeded maximum cap");
  assert.ok(b.educationScore <= b.educationMax, "Education score exceeded maximum cap");
  assert.ok(scoreData.matchScore <= 98, "Match score exceeded safety cap");
});

// --------------------------------------------------------------------------
// 3. Skill Gap Analysis & Top 3 Priority Calculation
// --------------------------------------------------------------------------
console.log("\n[Group 3: Skill Gap Analysis & Readiness Engine]");

it("should accurately categorize strong vs missing skills", () => {
  const target = careerCatalog.find((c) => c.id === "software-engineer");
  const userSkills = ["JavaScript / TypeScript", "React / Modern Frontend"];

  const gaps = analyzeSkillGaps(target, userSkills);
  assert.strictEqual(gaps.strongCompetencies.length, 2, "Expected 2 strong competencies");
  assert.ok(gaps.missingCoreSkills.length >= 2, "Expected missing core skills");
  assert.ok(gaps.readinessPercent >= 20 && gaps.readinessPercent <= 90, "Readiness score out of reasonable bounds");
});

it("should generate Top 3 Priority Gaps with explicit whyItMatters reasons", () => {
  const target = careerCatalog.find((c) => c.id === "software-engineer");
  const gaps = analyzeSkillGaps(target, ["JavaScript"]);

  assert.strictEqual(gaps.topPriorityGaps.length, 3, "Expected exactly 3 priority gaps");
  gaps.topPriorityGaps.forEach((g) => {
    assert.ok(g.name, "Missing gap skill name");
    assert.ok(g.whyItMatters, "Missing whyItMatters explanation in priority gap");
    assert.ok(g.estimatedRampUp, "Missing ramp up time");
  });
});

// --------------------------------------------------------------------------
// 4. Dynamic Personalized Roadmap Generation
// --------------------------------------------------------------------------
console.log("\n[Group 4: Dynamic Roadmap Synthesizer]");

it("should adapt Month 1 phase for candidate who already has strong foundations", () => {
  const target = careerCatalog.find((c) => c.id === "software-engineer");
  const userSkillsWithBase = ["JavaScript / TypeScript", "React / Modern Frontend"];
  const gaps = analyzeSkillGaps(target, userSkillsWithBase);

  const roadmap = generateCareerRoadmap(target, gaps, userSkillsWithBase);
  assert.strictEqual(roadmap.phases.length, 6, "Expected 6 monthly phases");
  assert.ok(roadmap.phases[0].phaseTitle.includes("Accelerated"), "Expected accelerated phase title for experienced base");
});

it("should generate standard foundation phase for candidate with zero skills", () => {
  const target = careerCatalog.find((c) => c.id === "software-engineer");
  const gaps = analyzeSkillGaps(target, []);

  const roadmap = generateCareerRoadmap(target, gaps, []);
  assert.ok(roadmap.phases[0].phaseTitle.includes("Foundations"), "Expected foundation title for beginner");
});

// --------------------------------------------------------------------------
// 5. Portfolio Project Skill-Gap Alignment
// --------------------------------------------------------------------------
console.log("\n[Group 5: Portfolio Project Specifications]");

it("every project blueprint must explicitly state what skill gap it solves", () => {
  Object.keys(projectCatalog).forEach((careerId) => {
    const projects = projectCatalog[careerId];
    assert.ok(Array.isArray(projects) && projects.length >= 3, `Expected at least 3 tiered projects for ${careerId}`);

    projects.forEach((proj) => {
      assert.ok(proj.title, "Missing project title");
      assert.ok(proj.gapSolved, `Missing gapSolved in project ${proj.title}`);
      assert.ok(proj.githubSpec, `Missing githubSpec in project ${proj.title}`);
      assert.ok(proj.resumeBullet, `Missing resumeBullet in project ${proj.title}`);
    });
  });
});

// --------------------------------------------------------------------------
// Final Summary
// --------------------------------------------------------------------------
console.log("\n==========================================================");
console.log(`TEST RESULTS: ${testsPassed} Passed, ${testsFailed} Failed.`);
console.log("==========================================================");

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log("ALL TEST ASSERTIONS VERIFIED SUCCESSFULLY! ✓\n");
}

