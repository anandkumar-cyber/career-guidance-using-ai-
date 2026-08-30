// Dynamic Personalized Roadmap Synthesizer

/**
 * Generate a personalized 6-month roadmap adapted to user's actual skill gaps
 */
export function generateCareerRoadmap(targetCareer, gapAnalysis = null, userSkills = []) {
  const normalizedUserSkills = (userSkills || []).map((s) => s.toLowerCase());
  const missingSkills = (gapAnalysis?.missingCoreSkills || []).map((s) => s.name);
  const developingSkills = (gapAnalysis?.developingSkills || []).map((s) => s.name);
  const strongSkills = (gapAnalysis?.strongCompetencies || []).map((s) => s.name);

  const careerId = targetCareer.id;

  // Generate dynamic 6-month trajectory
  const phases = [
    // Month 1
    generatePhase1(targetCareer, strongSkills, missingSkills),
    // Month 2
    generatePhase2(targetCareer, strongSkills, developingSkills, missingSkills),
    // Month 3
    generatePhase3(targetCareer, missingSkills, developingSkills),
    // Month 4
    generatePhase4(targetCareer),
    // Month 5
    generatePhase5(targetCareer),
    // Month 6
    generatePhase6(targetCareer),
  ];

  return {
    targetCareerTitle: targetCareer.title,
    careerCategory: targetCareer.category,
    durationMonths: 6,
    estimatedEffort: "10 - 12 hours / week",
    totalTasksCount: phases.reduce((acc, p) => acc + p.tasks.length, 0),
    phases,
  };
}

function generatePhase1(career, strongSkills, missingSkills) {
  const hasStrongBase = strongSkills.length >= 2;
  const topMissing = missingSkills.slice(0, 2);

  if (hasStrongBase) {
    return {
      month: 1,
      phaseTitle: `Accelerated Foundations & ${topMissing[0] || "Advanced Core"} Fast-Track`,
      focus: `Leverage your verified background in ${strongSkills.slice(0, 2).join(" & ")} while immediately targeting ${topMissing[0] || "core patterns"}.`,
      estimatedHours: "10 hrs/week",
      tasks: [
        { id: `${career.id}-m1-t1`, label: `Review strict production conventions for ${strongSkills[0] || "core language"} and clean architecture`, completed: false },
        { id: `${career.id}-m1-t2`, label: `Complete deep-dive hands-on modules in ${topMissing[0] || "core technology"}`, completed: false },
        { id: `${career.id}-m1-t3`, label: "Establish Git repository with CI linting and automated pre-commit hooks", completed: false },
      ],
      milestoneDeliverable: "Standardized GitHub repo template with strict typing, linting, and automated checks.",
      resources: [
        { title: `${career.title} Industry Standard Patterns`, type: "Documentation" },
        { title: "Clean Code & Architecture Guide", type: "Reference" },
      ],
    };
  }

  return {
    month: 1,
    phaseTitle: `Foundations & Core Syntax Setup for ${career.title}`,
    focus: "Master syntax essentials, developer environment setup, version control, and problem-solving basics.",
    estimatedHours: "12 hrs/week",
    tasks: [
      { id: `${career.id}-m1-t1`, label: `Master core programming syntax and idioms relevant to ${career.title}`, completed: false },
      { id: `${career.id}-m1-t2`, label: "Configure professional IDE environment, debugger, and terminal aliases", completed: false },
      { id: `${career.id}-m1-t3`, label: "Build 3 modular command-line or algorithmic exercises with Git version control", completed: false },
    ],
    milestoneDeliverable: "GitHub portfolio repository containing 3 documented algorithmic exercises.",
    resources: [
      { title: "Official Syntax Handbook & Documentation", type: "Documentation" },
      { title: "Git & GitHub Collaboration Workflow", type: "Guide" },
    ],
  };
}

function generatePhase2(career, strongSkills, developingSkills, missingSkills) {
  const targetFocus = developingSkills[0] || missingSkills[0] || "Core Frameworks";

  return {
    month: 2,
    phaseTitle: `Applied Frameworks & Data Layer (${targetFocus})`,
    focus: `Dive into ${targetFocus}, relational modeling, state management, and modern component or service architecture.`,
    estimatedHours: "10 hrs/week",
    tasks: [
      { id: `${career.id}-m2-t1`, label: `Implement structured data models and CRUD operations in ${targetFocus}`, completed: false },
      { id: `${career.id}-m2-t2`, label: "Handle error boundaries, asynchronous operations, and loading feedback states", completed: false },
      { id: `${career.id}-m2-t3`, label: "Write automated unit tests verifying core business logic functions", completed: false },
    ],
    milestoneDeliverable: "Interactive multi-component module integrated with persistent storage.",
    resources: [
      { title: `${targetFocus} Official Developer Documentation`, type: "Official Docs" },
      { title: "Testing & Reliability Best Practices", type: "Tutorial" },
    ],
  };
}

function generatePhase3(career, missingSkills, developingSkills) {
  const gapFocus = missingSkills[1] || developingSkills[1] || "APIs & Security";

  return {
    month: 3,
    phaseTitle: `System Architecture, ${gapFocus} & Integrations`,
    focus: `Close critical gaps in ${gapFocus}, API contracts, authentication, and state synchronization.`,
    estimatedHours: "12 hrs/week",
    tasks: [
      { id: `${career.id}-m3-t1`, label: `Build and document secure API contracts or pipelines using ${gapFocus}`, completed: false },
      { id: `${career.id}-m3-t2`, label: "Implement authentication, rate limiting, and defensive input validation", completed: false },
      { id: `${career.id}-m3-t3`, label: "Conduct peer code reviews and optimize query/rendering performance", completed: false },
    ],
    milestoneDeliverable: "Full-stack integration with end-to-end authentication and validated contracts.",
    resources: [
      { title: "API Security & OWASP Top 10 Guidelines", type: "Security Guide" },
      { title: "System Design Principles & Performance", type: "Architecture Reference" },
    ],
  };
}

function generatePhase4(career) {
  return {
    month: 4,
    phaseTitle: "Production Capstone Project & Cloud Deployment",
    focus: "Architect and deploy a flagship portfolio project solving a real user or industry problem.",
    estimatedHours: "12 hrs/week",
    tasks: [
      { id: `${career.id}-m4-t1`, label: "Architect full capstone project addressing verified real-world requirements", completed: false },
      { id: `${career.id}-m4-t2`, label: "Containerize application with Docker and deploy to cloud (Vercel/Render/AWS)", completed: false },
      { id: `${career.id}-m4-t3`, label: "Configure CI/CD automated test pipeline on GitHub Actions", completed: false },
    ],
    milestoneDeliverable: "Live deployed production web application with public URL and CI/CD badge.",
    resources: [
      { title: "Docker & Container Deployment Runbook", type: "Guide" },
      { title: "GitHub Actions CI/CD Pipeline Setup", type: "Docs" },
    ],
  };
}

function generatePhase5(career) {
  return {
    month: 5,
    phaseTitle: "Performance Profiling, Observability & Quality Hardening",
    focus: "Benchmark latency, optimize resource consumption, write integration tests, and record case study walkthroughs.",
    estimatedHours: "10 hrs/week",
    tasks: [
      { id: `${career.id}-m5-t1`, label: "Profile memory, CPU, or bundle size to achieve industry standard SLAs", completed: false },
      { id: `${career.id}-m5-t2`, label: "Add structured logging, health check probes, and observability metrics", completed: false },
      { id: `${career.id}-m5-t3`, label: "Record a 3-minute technical Loom video explaining architectural tradeoffs", completed: false },
    ],
    milestoneDeliverable: "Performance benchmarking report and video architecture breakdown.",
    resources: [
      { title: "Production Observability & Metrics Guide", type: "Reference" },
      { title: "Technical Portfolio Presentation Playbook", type: "Handbook" },
    ],
  };
}

function generatePhase6(career) {
  return {
    month: 6,
    phaseTitle: "ATS Resume Polish, Mock Interviews & Job Pipeline",
    focus: "Structure ATS-compliant resume bullets, practice technical interviews, and target 20 curated companies.",
    estimatedHours: "10 hrs/week",
    tasks: [
      { id: `${career.id}-m6-t1`, label: "Format ATS-compliant resume with quantifiable Google XYZ metric bullets", completed: false },
      { id: `${career.id}-m6-t2`, label: `Complete 5 mock technical interviews focusing on ${career.category} topics`, completed: false },
      { id: `${career.id}-m6-t3`, label: "Submit 20 tailored job/internship applications with personalized referrals", completed: false },
    ],
    milestoneDeliverable: "Polished portfolio site, finalized resume, and active recruiter outreach tracker.",
    resources: [
      { title: "Technical Interview Handbook (Blind 75 / NeetCode)", type: "Practice" },
      { title: "Google XYZ Resume Formatting Guide", type: "Template" },
    ],
  };
}
