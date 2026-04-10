const form = document.getElementById("career-form");
const results = document.getElementById("results");
const errorBox = document.getElementById("errorBox");
const submitBtn = document.getElementById("submitBtn");
const btnLabel = document.getElementById("btnLabel");
const template = document.getElementById("resultCardTemplate");
const reportTitle = document.getElementById("reportTitle");
const reportText = document.getElementById("reportText");
const reportMetrics = document.getElementById("reportMetrics");
const comparisonBoard = document.getElementById("comparisonBoard");
const downloadReportBtn = document.getElementById("downloadReportBtn");
const printReportBtn = document.getElementById("printReportBtn");

const emptyStateMarkup = `
  <div class="empty-state">
    Share the student's interests and strengths above, then generate recommendations to see career paths here.
  </div>
`;

results.innerHTML = emptyStateMarkup;
comparisonBoard.innerHTML = "";

let lastGeneratedReport = "";

const careerCatalog = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    keywords: ["coding", "programming", "apps", "software", "web", "logic", "computer"],
    subjects: ["maths", "mathematics", "computer science", "informatics"],
    workStyles: ["analytical", "practical"],
    strengths: ["problem solving", "logical thinking", "creativity"],
    explanation:
      "This path is a strong match for students who enjoy coding, mathematics, and turning ideas into real apps, websites, and systems.",
    skills: ["Programming fundamentals", "Data structures", "Web development", "Git and GitHub", "Problem solving"],
    roadmap: [
      "Choose one language such as JavaScript, Python, or Java and build small projects regularly.",
      "Learn computer science basics like algorithms, data structures, and databases.",
      "Create a portfolio with websites, apps, or useful coding tools.",
      "Apply for internships, coding contests, or beginner freelance work to gain experience."
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
      "Data science suits students who like maths, coding, patterns, and solving real problems using data and evidence.",
    skills: ["Python", "Statistics", "Data visualization", "Machine learning basics", "SQL"],
    roadmap: [
      "Build a base in mathematics, statistics, and Python.",
      "Practice analyzing datasets and presenting insights with charts and dashboards.",
      "Learn machine learning basics through small prediction and classification projects.",
      "Publish data projects in a portfolio and explore internships in analytics or AI."
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
      "AI engineering is a great option for students who love coding and maths and want to build smart systems that can learn and automate tasks.",
    skills: ["Python", "Linear algebra", "Machine learning", "Model deployment", "Prompt design"],
    roadmap: [
      "Strengthen maths topics such as algebra, probability, and calculus while learning Python deeply.",
      "Study machine learning fundamentals and create AI mini-projects such as chatbots or recommendation tools.",
      "Learn how AI models are integrated into products and how to deploy them.",
      "Build an AI portfolio and target internships in AI, ML, or software teams."
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
      "This path works well for students who enjoy creativity, digital products, and designing smooth experiences for users.",
    skills: ["Wireframing", "Visual design", "User research", "Figma", "Design systems"],
    roadmap: [
      "Learn layout, typography, color, and interface design principles.",
      "Practice with tools like Figma by redesigning simple app or website screens.",
      "Study user research and usability testing to understand how people use products.",
      "Build a design portfolio with clear case studies and apply for internships."
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
      "Cybersecurity is a good fit for students who are curious about systems, digital safety, and protecting technology from threats.",
    skills: ["Networking", "Linux basics", "Security fundamentals", "Scripting", "Threat analysis"],
    roadmap: [
      "Understand operating systems, networking, and how the internet works.",
      "Learn security basics such as authentication, encryption, and vulnerabilities.",
      "Use beginner labs and ethical practice platforms to build hands-on skills.",
      "Pursue certifications, projects, or internships in security and system administration."
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
      "Product management fits students who enjoy technology, planning, decision-making, and working with people to build useful products.",
    skills: ["Communication", "Market research", "Roadmapping", "Product thinking", "Team collaboration"],
    roadmap: [
      "Learn how products solve user problems and how digital teams work together.",
      "Practice writing feature ideas, user stories, and simple product plans.",
      "Join team projects to understand collaboration between design, business, and engineering.",
      "Create product case studies and explore internships in product, operations, or startups."
    ]
  }
];

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle("loading", isLoading);
  btnLabel.textContent = isLoading ? "Analyzing profile..." : "Generate career roadmap";
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = "block";
}

function clearError() {
  errorBox.textContent = "";
  errorBox.style.display = "none";
}

function normalizeFormData(formData) {
  const selectedInterestTags = formData.getAll("interestTags").map((value) => value.trim()).filter(Boolean);
  const manualInterests = formData.get("interests")?.trim() || "";
  const selectedGrade = formData.get("studentGrade")?.trim() || "";
  const customStage = formData.get("studentStageCustom")?.trim() || "";
  const resolvedStage = selectedGrade === "other" ? customStage : (selectedGrade || customStage);
  const mergedInterests = [selectedInterestTags.join(", "), manualInterests].filter(Boolean).join(", ");

  return {
    inputMode: formData.get("inputMode")?.trim() || "guided",
    studentName: formData.get("studentName")?.trim() || "",
    studentStage: resolvedStage,
    studentGrade: selectedGrade,
    studentStageCustom: customStage,
    interests: mergedInterests,
    interestTags: selectedInterestTags,
    subjects: formData.get("subjects")?.trim() || "",
    strengths: formData.get("strengths")?.trim() || "",
    stream: formData.get("stream")?.trim() || "",
    workStyle: formData.get("workStyle")?.trim() || "",
    goals: formData.get("goals")?.trim() || "",
    dreamOutcome: formData.get("dreamOutcome")?.trim() || "",
    studentDescription: formData.get("studentDescription")?.trim() || "",
  };
}

function validatePayload(payload) {
  const hasGuidedData = Boolean(payload.interests || payload.subjects || payload.goals || payload.strengths || payload.dreamOutcome);
  const hasDescription = Boolean(payload.studentDescription);

  if (payload.inputMode === "guided" && !hasGuidedData) {
    return "Please fill in the guided form details before generating the roadmap.";
  }

  if (payload.inputMode === "description" && !hasDescription) {
    return "Please write the full student description before generating the roadmap.";
  }

  if (payload.inputMode === "both" && (!hasGuidedData || !hasDescription)) {
    return "Please complete both the guided form and the full description.";
  }

  if (!hasGuidedData && !hasDescription) {
    return "Please add either guided details, a full description, or both.";
  }

  return "";
}

function createTag(text) {
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = text;
  return tag;
}

function tokenizeProfile(payload) {
  return [
    payload.studentName,
    payload.studentStage,
    payload.interests,
    payload.subjects,
    payload.strengths,
    payload.stream,
    payload.workStyle,
    payload.goals,
    payload.dreamOutcome,
    payload.studentDescription,
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
    if (["software-engineer", "data-scientist", "ai-engineer"].includes(career.id)) {
      score += 14;
    }
  }

  return Math.min(score, 98);
}

function buildRecommendations(payload) {
  const profileText = tokenizeProfile(payload);

  return {
    career_recommendations: careerCatalog
      .map((career) => ({
        career_title: career.title,
        match_score: scoreCareer(career, profileText, payload),
        explanation: career.explanation,
        required_skills: career.skills,
        roadmap: career.roadmap,
      }))
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 3),
  };
}

function inferReason(payload, career) {
  const reasons = [];

  if (payload.interests.toLowerCase().includes("coding")) {
    reasons.push("coding interest");
  }

  if (payload.subjects.toLowerCase().includes("math")) {
    reasons.push("mathematics strength");
  }

  if (payload.strengths.toLowerCase().includes("creative")) {
    reasons.push("creative ability");
  }

  if (payload.workStyle) {
    reasons.push(`${payload.workStyle} work style`);
  }

  if (payload.studentDescription) {
    reasons.push("detailed personal description");
  }

  return reasons[0] ? `Strong match through ${reasons.slice(0, 2).join(" and ")}.` : `Aligned well with the ${career.career_title} profile.`;
}

function formatStream(stream) {
  if (!stream) {
    return "Flexible across streams";
  }

  const map = {
    science: "Science",
    commerce: "Commerce",
    arts: "Arts / Humanities",
    general: "Flexible / Undecided",
  };

  return map[stream] || "Flexible across streams";
}

function buildReportSummary(payload, careers) {
  const student = payload.studentName || "This student";
  const topCareer = careers[0]?.career_title || "the right path";
  const topScore = careers[0]?.match_score || 0;
  const advantage = payload.strengths || payload.subjects || payload.interests || "emerging strengths";

  reportTitle.textContent = `${student}'s premium career direction report`;
  reportText.textContent = `${student} appears best aligned with ${topCareer}. The current profile suggests a high fit for structured growth, especially where ${advantage.toLowerCase()} can be turned into long-term career strength.`;

  reportMetrics.innerHTML = `
    <div class="report-metric">
      <span>Top fit</span>
      <strong>${topCareer}</strong>
    </div>
    <div class="report-metric">
      <span>Confidence</span>
      <strong>${topScore}% profile match</strong>
    </div>
    <div class="report-metric">
      <span>Best advantage</span>
      <strong>${advantage}</strong>
    </div>
  `;
}

function renderComparison(careers) {
  if (!careers.length) {
    comparisonBoard.innerHTML = "";
    return;
  }

  comparisonBoard.innerHTML = `
    <article class="comparison-card">
      <h3>Quick comparison</h3>
      <div class="comparison-grid">
        ${careers
          .map(
            (career) => `
              <div class="comparison-column">
                <strong>${career.career_title}</strong>
                <p>${career.match_score}% match</p>
                <p>${career.required_skills.slice(0, 3).join(", ")}</p>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function buildDownloadText(payload, careers) {
  const lines = [
    "Career Assistant Premium Report",
    "",
    `Input Mode: ${payload.inputMode || "guided"}`,
    `Student Name: ${payload.studentName || "Not provided"}`,
    `Class or Stage: ${payload.studentStage || "Not provided"}`,
    `Selected Grade: ${payload.studentGrade || "Not provided"}`,
    `Stream: ${formatStream(payload.stream)}`,
    `Interests: ${payload.interests || "Not provided"}`,
    `Interest Tags: ${payload.interestTags?.join(", ") || "Not provided"}`,
    `Favorite Subjects: ${payload.subjects || "Not provided"}`,
    `Strengths: ${payload.strengths || "Not provided"}`,
    `Work Style: ${payload.workStyle || "Not provided"}`,
    `Goals: ${payload.goals || "Not provided"}`,
    `Dream Outcome: ${payload.dreamOutcome || "Not provided"}`,
    `Full Description: ${payload.studentDescription || "Not provided"}`,
    "",
    "Recommended Careers:",
  ];

  careers.forEach((career, index) => {
    lines.push("");
    lines.push(`${index + 1}. ${career.career_title} (${career.match_score}% match)`);
    lines.push(`Why it fits: ${career.explanation}`);
    lines.push(`Required skills: ${career.required_skills.join(", ")}`);
    lines.push("Roadmap:");
    career.roadmap.forEach((step, stepIndex) => {
      lines.push(`  ${stepIndex + 1}. ${step}`);
    });
  });

  return lines.join("\n");
}

function downloadReport() {
  if (!lastGeneratedReport) {
    showError("Generate a career report first, then download it.");
    return;
  }

  const blob = new Blob([lastGeneratedReport], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "career-assistant-report.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function printReport() {
  if (!lastGeneratedReport) {
    showError("Generate a career report first, then print it.");
    return;
  }

  clearError();
  window.print();
}

function renderResults(data) {
  const careers = data?.career_recommendations;

  if (!Array.isArray(careers) || careers.length === 0) {
    results.innerHTML = `
      <div class="empty-state">
        No recommendations were returned. Try using more detail about interests, favorite subjects, and strengths.
      </div>
    `;
    return;
  }

  results.innerHTML = "";

  careers.forEach((career, index) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".result-card");
    const title = fragment.querySelector(".career-title");
    const matchPill = fragment.querySelector(".match-pill");
    const summary = fragment.querySelector(".career-summary");
    const fitReason = fragment.querySelector(".fit-reason");
    const fitStream = fragment.querySelector(".fit-stream");
    const skillsGroup = fragment.querySelector(".skills-group");
    const roadmapList = fragment.querySelector(".roadmap-list");

    title.textContent = career.career_title || "Career Option";
    matchPill.textContent = `${career.match_score || 0}% match`;
    summary.textContent = career.explanation || "A good fit based on the student profile.";
    fitReason.textContent = career.fit_reason || "Strong overlap with interests and strengths";
    fitStream.textContent = career.ideal_stream || "Flexible across streams";
    card.style.animationDelay = `${index * 0.08}s`;

    (career.required_skills || []).forEach((skill) => {
      skillsGroup.appendChild(createTag(skill));
    });

    (career.roadmap || career.next_steps || []).forEach((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      roadmapList.appendChild(item);
    });

    results.appendChild(fragment);
  });
}

async function submitCareerForm(event) {
  event.preventDefault();
  clearError();

  const payload = normalizeFormData(new FormData(form));
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    showError(validationMessage);
    return;
  }

  setLoading(true);

  try {
    await new Promise((resolve) => window.setTimeout(resolve, 550));
    const result = buildRecommendations(payload);
    const enrichedCareers = result.career_recommendations.map((career) => ({
      ...career,
      fit_reason: inferReason(payload, career),
      ideal_stream: formatStream(payload.stream),
    }));

    renderResults({ career_recommendations: enrichedCareers });
    buildReportSummary(payload, enrichedCareers);
    renderComparison(enrichedCareers);
    lastGeneratedReport = buildDownloadText(payload, enrichedCareers);
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    showError(error.message || "Something went wrong while generating the recommendations.");
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", submitCareerForm);
downloadReportBtn.addEventListener("click", downloadReport);
printReportBtn.addEventListener("click", printReport);
