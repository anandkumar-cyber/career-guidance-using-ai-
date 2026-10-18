// Main Application Coordinator & View Controllers (ES Module)
import { store } from "./src/state/store.js";
import { careerCatalog } from "./src/data/careers.js";
import { skillTaxonomy, domainInterests } from "./src/data/skills.js";
import { sendAdvisorChatQuery } from "./src/services/api.js";

// ==========================================================================
// DOM Element References
// ==========================================================================
const tabs = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
const modal = document.getElementById("assessmentModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const startAssessmentBtn = document.getElementById("startAssessmentBtn");
const startAssessmentTopBtn = document.getElementById("startAssessmentTopBtn");
const heroStartBtn = document.getElementById("heroStartBtn");
const editProfileBtn = document.getElementById("editProfileBtn");
const exportReportBtn = document.getElementById("exportReportBtn");
const heroShowcaseInspectBtn = document.getElementById("heroShowcaseInspectBtn");
const dashViewGapsBtn = document.getElementById("dashViewGapsBtn");
const dashAskAdvisorBtn = document.getElementById("dashAskAdvisorBtn");
const dashStartSkillPlanBtn = document.getElementById("dashStartSkillPlanBtn");

// Modal Navigation
const prevStepBtn = document.getElementById("prevStepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");
const submitAssessmentBtn = document.getElementById("submitAssessmentBtn");
const modalStepLabel = document.getElementById("modalStepLabel");
const modalProgressBar = document.getElementById("modalProgressBar");
const wizardSteps = document.querySelectorAll(".wizard-step");

// Chat Elements
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessagesContainer = document.getElementById("chatMessagesContainer");
const clearChatBtn = document.getElementById("clearChatBtn");
const promptChips = document.querySelectorAll(".prompt-chip");

// Explorer Elements
const explorerSearchInput = document.getElementById("explorerSearchInput");
const explorerCategoryFilter = document.getElementById("explorerCategoryFilter");

let currentStep = 1;
const TOTAL_STEPS = 5;

// ==========================================================================
// Tab Switching Controller
// ==========================================================================
function switchTab(tabId) {
  tabs.forEach((btn) => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  tabPanels.forEach((panel) => {
    const isTarget = panel.id === `tab-${tabId}`;
    panel.classList.toggle("active", isTarget);
  });
}

tabs.forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

document.querySelectorAll("a[data-tab]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetTab = link.dataset.tab;
    switchTab(targetTab);
    document.getElementById("app")?.scrollIntoView({ behavior: "smooth" });
  });
});

// ==========================================================================
// Multi-Step Onboarding Modal Controller
// ==========================================================================
function populateModalPills() {
  const skillsGrid = document.getElementById("skillsPillsGrid");
  const domainGrid = document.getElementById("domainPillsGrid");
  const profile = store.getProfile();

  // Populate Skill Pills
  if (skillsGrid && skillsGrid.children.length === 0) {
    const allSkills = [
      ...skillTaxonomy.programmingLanguages,
      ...skillTaxonomy.frameworksAndLibraries,
      ...skillTaxonomy.toolsAndInfrastructure,
    ];
    const uniqueSkills = Array.from(new Set(allSkills));

    uniqueSkills.forEach((skillName) => {
      const id = `skill-${skillName.toLowerCase().replace(/[^\w]/g, "-")}`;
      const isChecked = (profile.skills || []).some((s) => s.toLowerCase() === skillName.toLowerCase());

      const pillWrap = document.createElement("div");
      pillWrap.innerHTML = `
        <input type="checkbox" name="skillCheck" value="${escapeHtml(skillName)}" id="${id}" class="pill-checkbox" ${isChecked ? "checked" : ""}>
        <label for="${id}" class="pill-label">${escapeHtml(skillName)}</label>
      `;
      skillsGrid.appendChild(pillWrap);
    });
  }

  // Populate Domain Interest Pills
  if (domainGrid && domainGrid.children.length === 0) {
    domainInterests.forEach((domain) => {
      const id = `domain-${domain.id}`;
      const isChecked = (profile.selectedInterests || []).includes(domain.name);

      const pillWrap = document.createElement("div");
      pillWrap.innerHTML = `
        <input type="checkbox" name="domainCheck" value="${escapeHtml(domain.name)}" id="${id}" class="pill-checkbox" ${isChecked ? "checked" : ""}>
        <label for="${id}" class="pill-label">${escapeHtml(domain.name)}</label>
      `;
      domainGrid.appendChild(pillWrap);
    });
  }
}

function openAssessmentModal() {
  populateModalPills();
  const profile = store.getProfile();

  // Prefill Inputs
  const nameInput = document.getElementById("formFullName");
  if (nameInput) nameInput.value = profile.fullName || "";

  const eduSelect = document.getElementById("formEducationLevel");
  if (eduSelect) eduSelect.value = profile.educationLevel || "College / University Student";

  const degreeInput = document.getElementById("formDegreeOrStream");
  if (degreeInput) degreeInput.value = profile.degreeOrStream || "";

  const customSkills = document.getElementById("formCustomSkills");
  if (customSkills) customSkills.value = "";

  const interestsText = document.getElementById("formInterestsText");
  if (interestsText) interestsText.value = profile.interestsText || "";

  const expDesc = document.getElementById("formExperienceDescription");
  if (expDesc) expDesc.value = profile.experienceDescription || "";

  const strengthsInput = document.getElementById("formStrengthsText");
  if (strengthsInput) strengthsInput.value = profile.strengthsText || "";

  const workStyleSelect = document.getElementById("formWorkStyle");
  if (workStyleSelect) workStyleSelect.value = profile.workStyle || "analytical";

  const goalsInput = document.getElementById("formCareerGoals");
  if (goalsInput) goalsInput.value = profile.careerGoals || "";

  currentStep = 1;
  updateModalStepUI();
  modal.classList.add("open");
}

function closeAssessmentModal() {
  modal.classList.remove("open");
}

function updateModalStepUI() {
  wizardSteps.forEach((stepEl) => {
    const stepNum = parseInt(stepEl.dataset.step, 10);
    stepEl.style.display = stepNum === currentStep ? "block" : "none";
  });

  const titles = [
    "Background & Education",
    "Technical & Core Skills",
    "Domain Interests",
    "Experience & Proof",
    "Career Ambitions",
  ];

  if (modalStepLabel) {
    modalStepLabel.textContent = `Step ${currentStep} of ${TOTAL_STEPS} • ${titles[currentStep - 1]}`;
  }

  if (modalProgressBar) {
    modalProgressBar.style.width = `${(currentStep / TOTAL_STEPS) * 100}%`;
  }

  if (prevStepBtn) prevStepBtn.style.display = currentStep > 1 ? "block" : "none";
  if (nextStepBtn) nextStepBtn.style.display = currentStep < TOTAL_STEPS ? "block" : "none";
  if (submitAssessmentBtn) submitAssessmentBtn.style.display = currentStep === TOTAL_STEPS ? "block" : "none";
}

function saveCurrentModalData() {
  const name = document.getElementById("formFullName")?.value.trim() || "";
  const eduLevel = document.getElementById("formEducationLevel")?.value;
  const degree = document.getElementById("formDegreeOrStream")?.value.trim();

  // Gather Checked Skills
  const checkedSkills = Array.from(document.querySelectorAll("input[name='skillCheck']:checked")).map((i) => i.value);
  const extraSkills = (document.getElementById("formCustomSkills")?.value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allSkills = Array.from(new Set([...checkedSkills, ...extraSkills]));

  // Gather Checked Domains
  const checkedDomains = Array.from(document.querySelectorAll("input[name='domainCheck']:checked")).map((i) => i.value);
  const interestsText = document.getElementById("formInterestsText")?.value.trim();
  const expDesc = document.getElementById("formExperienceDescription")?.value.trim();
  const strengths = document.getElementById("formStrengthsText")?.value.trim();
  const workStyle = document.getElementById("formWorkStyle")?.value;
  const goals = document.getElementById("formCareerGoals")?.value.trim();

  store.setProfile({
    fullName: name,
    educationLevel: eduLevel,
    degreeOrStream: degree,
    skills: allSkills.length > 0 ? allSkills : store.getProfile().skills,
    selectedInterests: checkedDomains,
    interestsText: interestsText,
    experienceDescription: expDesc,
    strengthsText: strengths,
    workStyle: workStyle,
    careerGoals: goals,
  });
}

// Modal Event Listeners
if (startAssessmentBtn) startAssessmentBtn.addEventListener("click", openAssessmentModal);
if (startAssessmentTopBtn) startAssessmentTopBtn.addEventListener("click", openAssessmentModal);
if (heroStartBtn) heroStartBtn.addEventListener("click", openAssessmentModal);
if (editProfileBtn) editProfileBtn.addEventListener("click", openAssessmentModal);
if (closeModalBtn) closeModalBtn.addEventListener("click", closeAssessmentModal);

if (nextStepBtn) {
  nextStepBtn.addEventListener("click", () => {
    if (currentStep === 1) {
      const nameInput = document.getElementById("formFullName");
      if (!nameInput?.value.trim()) {
        nameInput?.focus();
        return;
      }
    }
    if (currentStep < TOTAL_STEPS) {
      currentStep++;
      updateModalStepUI();
    }
  });
}

if (prevStepBtn) {
  prevStepBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateModalStepUI();
    }
  });
}

if (submitAssessmentBtn) {
  submitAssessmentBtn.addEventListener("click", () => {
    saveCurrentModalData();
    closeAssessmentModal();
    switchTab("overview");
    document.getElementById("app")?.scrollIntoView({ behavior: "smooth" });
  });
}

// ==========================================================================
// Dynamic View Renderers
// ==========================================================================

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderOverview() {
  const profile = store.getProfile();
  const target = store.getTargetCareer();
  const gaps = store.getGapAnalysis();
  const recommendations = store.state.recommendations;
  const currentMatch = recommendations.find((r) => r.careerId === target.id) || recommendations[0];

  // User Header Info - Zero dummy data
  const userNameEl = document.getElementById("userNameDisplay");
  const userStatusEl = document.getElementById("userStatusDisplay");
  const userAvatarEl = document.getElementById("userAvatar");

  if (userNameEl) {
    userNameEl.textContent = profile.fullName ? `${profile.fullName}'s Workspace` : "Your Career Workspace";
  }
  if (userStatusEl) {
    userStatusEl.textContent = `Targeting ${target.title} • ${profile.educationLevel || "Active Track"}`;
  }
  if (userAvatarEl) {
    const initials = profile.fullName
      ? profile.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "CP";
    userAvatarEl.textContent = initials;
  }

  // Target Hero Widget
  const dashTargetTitle = document.getElementById("dashTargetTitle");
  const dashTargetDesc = document.getElementById("dashTargetDesc");
  const dashMatchBadge = document.getElementById("dashMatchBadge");
  const dashCategoryBadge = document.getElementById("dashCategoryBadge");
  const dashSalary = document.getElementById("dashSalary");
  const dashReadiness = document.getElementById("dashReadiness");
  const dashRoadmapProgress = document.getElementById("dashRoadmapProgress");
  const dashWhyItFits = document.getElementById("dashWhyItFits");
  const dashMatchTier = document.getElementById("dashMatchTier");

  if (dashTargetTitle) dashTargetTitle.textContent = target.title;
  if (dashTargetDesc) dashTargetDesc.textContent = target.shortDescription;
  if (dashMatchBadge) dashMatchBadge.textContent = `${currentMatch?.matchScore || 90}% Career Fit`;
  if (dashCategoryBadge) dashCategoryBadge.textContent = target.category;
  if (dashSalary) dashSalary.textContent = `${target.salaryRange.split("(")[0]} (US Entry–Mid)`;
  if (dashReadiness) dashReadiness.textContent = `${gaps.readinessPercent}% Role Readiness`;

  const totalTasks = store.getRoadmap().totalTasksCount;
  const completedTasks = store.state.completedTaskIds.size;
  if (dashRoadmapProgress) dashRoadmapProgress.textContent = `${completedTasks} of ${totalTasks} Tasks Done`;

  if (dashWhyItFits) dashWhyItFits.textContent = currentMatch?.whyItFits || target.whyItFitsSummary;
  if (dashMatchTier) dashMatchTier.textContent = currentMatch?.matchTier || "Estimated Fit";

  // Next Best Action Card on Overview
  const topGap = gaps.topPriorityGaps?.[0];
  const nextActionTitle = document.getElementById("nextActionTitle");
  const nextActionDesc = document.getElementById("nextActionDesc");
  const nextActionTime = document.getElementById("nextActionTime");

  if (nextActionTitle && topGap) {
    nextActionTitle.textContent = `Master ${topGap.name}`;
    if (nextActionDesc) {
      nextActionDesc.textContent = `${topGap.name} is currently your highest-leverage priority skill gap. ${topGap.whyItMatters}`;
    }
    if (nextActionTime) {
      nextActionTime.textContent = `Estimated effort: ${topGap.estimatedRampUp || "3–4 weeks"}`;
    }
  }

  // Score Breakdown Bars
  const breakdownContainer = document.getElementById("scoreBreakdownList");
  if (breakdownContainer && currentMatch?.breakdown) {
    const b = currentMatch.breakdown;
    breakdownContainer.innerHTML = `
      <div class="factor-row">
        <div class="factor-labels">
          <span>Technical Skills Overlap</span>
          <span>${b.skillsScore} / ${b.skillsMax} pts</span>
        </div>
        <div class="factor-bar"><div class="factor-fill" style="width:${(b.skillsScore / b.skillsMax) * 100}%;"></div></div>
      </div>
      <div class="factor-row">
        <div class="factor-labels">
          <span>Domain Interest Alignment</span>
          <span>${b.interestScore} / ${b.interestMax} pts</span>
        </div>
        <div class="factor-bar"><div class="factor-fill" style="width:${(b.interestScore / b.interestMax) * 100}%; background:var(--accent-cyan);"></div></div>
      </div>
      <div class="factor-row">
        <div class="factor-labels">
          <span>Educational & Background Synergy</span>
          <span>${b.educationScore} / ${b.educationMax} pts</span>
        </div>
        <div class="factor-bar"><div class="factor-fill" style="width:${(b.educationScore / b.educationMax) * 100}%; background:var(--success);"></div></div>
      </div>
      <div class="factor-row">
        <div class="factor-labels">
          <span>Work Style & Strengths Fit</span>
          <span>${b.workStyleScore + b.strengthScore} / ${b.workStyleMax + b.strengthMax} pts</span>
        </div>
        <div class="factor-bar"><div class="factor-fill" style="width:${((b.workStyleScore + b.strengthScore) / 20) * 100}%; background:var(--warning);"></div></div>
      </div>
    `;
  }

  // Top 3 Priority Skill Gaps on Overview
  const actionContainer = document.getElementById("dashActionList");
  if (actionContainer) {
    const topGaps = gaps.topPriorityGaps || [];
    if (topGaps.length > 0) {
      actionContainer.innerHTML = topGaps
        .map(
          (g) => `
        <div style="background:var(--bg-subtle); padding:12px 14px; border-radius:var(--radius-md); border-left:3px solid var(--primary);">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <strong style="font-size:0.86rem; color:var(--text-main);">#${g.rank} Priority: <span style="color:var(--primary);">${escapeHtml(g.name)}</span></strong>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Est. ${escapeHtml(g.estimatedRampUp)}</span>
          </div>
          <p style="font-size:0.82rem; color:var(--text-muted); margin:0;">${escapeHtml(g.whyItMatters)}</p>
        </div>
      `
        )
        .join("");
    } else {
      actionContainer.innerHTML = `
        <div style="background:var(--success-subtle); padding:12px; border-radius:var(--radius-md); color:var(--success);">
          <strong>All core competencies active!</strong> Focus on capstone portfolio deployment.
        </div>
      `;
    }
  }

  // Readiness Dial
  const dashReadinessScore = document.getElementById("dashReadinessScore");
  const dashReadinessBar = document.getElementById("dashReadinessBar");
  if (dashReadinessScore) dashReadinessScore.textContent = `${gaps.readinessPercent}%`;
  if (dashReadinessBar) dashReadinessBar.style.width = `${gaps.readinessPercent}%`;

  // Hero Spotlight Sync
  const heroRole = document.getElementById("heroShowcaseRole");
  const heroCategory = document.getElementById("heroShowcaseCategory");
  const heroScore = document.getElementById("heroShowcaseScore");
  const heroProgressBar = document.getElementById("heroProgressBar");
  const heroTags = document.getElementById("heroShowcaseTags");

  if (heroRole) heroRole.textContent = target.title;
  if (heroCategory) heroCategory.textContent = target.category;
  if (heroScore) heroScore.textContent = `${currentMatch?.matchScore || 92}%`;
  if (heroProgressBar) heroProgressBar.style.width = `${currentMatch?.matchScore || 92}%`;
  if (heroTags) {
    heroTags.innerHTML = target.requiredSkills
      .slice(0, 4)
      .map((s) => `<span class="pill-tag">${escapeHtml(s.name)}</span>`)
      .join("");
  }
}

function renderMatches() {
  const container = document.getElementById("matchesContainer");
  if (!container) return;

  const recommendations = store.state.recommendations;
  const currentTargetId = store.state.targetCareerId;

  container.innerHTML = recommendations
    .map((rec) => {
      const isSelected = rec.careerId === currentTargetId;
      const c = rec.careerDetails;

      return `
      <article class="widget-card" style="margin-bottom:0; border: ${isSelected ? "2px solid var(--primary)" : "1px solid var(--border)"}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span class="pill-tag" style="background:var(--primary-subtle); color:var(--primary); font-weight:700;">${escapeHtml(rec.category)}</span>
              ${isSelected ? '<span class="pill-tag" style="background:var(--success-subtle); color:var(--success); font-weight:700;">Active Target</span>' : ""}
            </div>
            <h3 style="font-size:1.3rem; font-weight:800; color:var(--text-main);">${escapeHtml(rec.careerTitle)}</h3>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.7rem; font-weight:800; font-family:var(--font-mono); color:var(--primary);">${rec.matchScore}%</div>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Estimated Fit</span>
          </div>
        </div>

        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.55; margin-bottom:16px;">
          ${escapeHtml(c.shortDescription)}
        </p>

        <!-- Why It Fits Box -->
        <div style="background:var(--bg-subtle); padding:12px 14px; border-radius:var(--radius-md); margin-bottom:16px; border-left:3px solid var(--accent-cyan);">
          <strong style="display:block; font-size:0.75rem; text-transform:uppercase; color:var(--accent-cyan); margin-bottom:2px;">Why this path matches you</strong>
          <p style="font-size:0.86rem; color:var(--text-main); margin:0;">${escapeHtml(rec.whyItFits)}</p>
        </div>

        <!-- Meta Grid -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:10px; margin-bottom:16px; padding:12px; background:var(--bg-subtle); border:1px solid var(--border); border-radius:var(--radius-md);">
          <div>
            <span style="display:block; font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Estimated Comp</span>
            <strong style="font-size:0.82rem; color:var(--text-main);">${escapeHtml(c.salaryRange.split("(")[0])}</strong>
          </div>
          <div>
            <span style="display:block; font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Market Demand</span>
            <strong style="font-size:0.82rem; color:var(--success);">${escapeHtml(c.marketDemand)}</strong>
          </div>
          <div>
            <span style="display:block; font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Difficulty</span>
            <strong style="font-size:0.82rem; color:var(--text-main);">${escapeHtml(c.difficulty)}</strong>
          </div>
        </div>

        <div style="margin-bottom:14px;">
          <strong style="display:block; font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px;">Required Competencies</strong>
          <div class="mini-tag-list">
            ${c.requiredSkills.map((s) => `<span class="pill-tag">${escapeHtml(s.name)} (${s.level})</span>`).join("")}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:1px solid var(--border); flex-wrap:wrap; gap:10px;">
          <span style="font-size:0.8rem; color:var(--text-muted);">
            Progression: ${c.growthPath ? escapeHtml(c.growthPath.join(" → ")) : "Junior → Senior → Principal"}
          </span>
          <button class="btn ${isSelected ? "btn-secondary" : "btn-primary"} btn-sm set-target-btn" data-id="${rec.careerId}">
            ${isSelected ? "Selected Target Role" : "Set as Target Career &rarr;"}
          </button>
        </div>
      </article>
    `;
    })
    .join("");

  // Attach Target Selection Handlers
  document.querySelectorAll(".set-target-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const careerId = btn.dataset.id;
      store.setTargetCareer(careerId);
      renderAll();
      switchTab("overview");
      document.getElementById("app")?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function renderGaps() {
  const target = store.getTargetCareer();
  const gaps = store.getGapAnalysis();

  const targetNameEl = document.getElementById("gapTargetName");
  if (targetNameEl) targetNameEl.textContent = target.title;

  const strongCount = document.getElementById("gapStrongCount");
  const devCount = document.getElementById("gapDevelopingCount");
  const missingCount = document.getElementById("gapMissingCount");

  if (strongCount) strongCount.textContent = gaps.summary.strongCount;
  if (devCount) devCount.textContent = gaps.summary.developingCount;
  if (missingCount) missingCount.textContent = gaps.summary.missingCount;

  const strongList = document.getElementById("gapStrongList");
  const devList = document.getElementById("gapDevelopingList");
  const missingList = document.getElementById("gapMissingList");

  // Rich Skill Gap Cards
  if (strongList) {
    strongList.innerHTML =
      gaps.strongCompetencies.length > 0
        ? gaps.strongCompetencies
            .map(
              (s) => `
        <li class="gap-skill-card">
          <div class="gap-skill-header">
            <span class="gap-skill-title">${escapeHtml(s.name)}</span>
            <span class="gap-skill-level badge-strong">Active (${s.confidencePercent}%)</span>
          </div>
          <div class="progress-bar-bg" style="height:4px; margin-bottom:4px;"><div class="progress-bar-fill" style="width:${s.confidencePercent}%; background:var(--success);"></div></div>
          <p class="gap-skill-why">${escapeHtml(s.whyItMatters)}</p>
          <div class="gap-skill-action">Target Level: ${escapeHtml(s.targetLevel)} • Mastered</div>
        </li>
      `
            )
            .join("")
        : '<li style="font-size:0.85rem; color:var(--text-muted); padding:10px;">No verified active skills recorded yet. Update your skills in the profile!</li>';
  }

  if (devList) {
    devList.innerHTML =
      gaps.developingSkills.length > 0
        ? gaps.developingSkills
            .map(
              (s) => `
        <li class="gap-skill-card">
          <div class="gap-skill-header">
            <span class="gap-skill-title">${escapeHtml(s.name)}</span>
            <span class="gap-skill-level badge-developing">Developing (${s.confidencePercent}%)</span>
          </div>
          <div class="progress-bar-bg" style="height:4px; margin-bottom:4px;"><div class="progress-bar-fill" style="width:${s.confidencePercent}%; background:var(--warning);"></div></div>
          <p class="gap-skill-why">${escapeHtml(s.whyItMatters)}</p>
          <div class="gap-skill-action"><strong>Action:</strong> ${escapeHtml(s.recommendation)}</div>
        </li>
      `
            )
            .join("")
        : '<li style="font-size:0.85rem; color:var(--text-muted); padding:10px;">No adjacent skills identified.</li>';
  }

  if (missingList) {
    missingList.innerHTML =
      gaps.missingCoreSkills.length > 0
        ? gaps.missingCoreSkills
            .map(
              (s) => `
        <li class="gap-skill-card">
          <div class="gap-skill-header">
            <span class="gap-skill-title">${escapeHtml(s.name)}</span>
            <span class="gap-skill-level badge-missing">Priority Gap (${s.confidencePercent}%)</span>
          </div>
          <div class="progress-bar-bg" style="height:4px; margin-bottom:4px;"><div class="progress-bar-fill" style="width:${s.confidencePercent}%; background:var(--danger);"></div></div>
          <p class="gap-skill-why">${escapeHtml(s.whyItMatters)}</p>
          <div class="gap-skill-action"><strong>Action:</strong> ${escapeHtml(s.recommendation)}</div>
        </li>
      `
            )
            .join("")
        : '<li style="font-size:0.85rem; color:var(--success); padding:10px;">All core competencies active!</li>';
  }

  // Priority Action Plan
  const planContainer = document.getElementById("gapPlanList");
  if (planContainer) {
    planContainer.innerHTML = gaps.priorityActionPlan
      .map(
        (p) => `
      <div style="background:var(--bg-subtle); padding:14px; border-radius:var(--radius-md); border-left:3px solid var(--primary);">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; flex-wrap:wrap;">
          <strong style="font-size:0.85rem; color:var(--primary);">${escapeHtml(p.priority)}</strong>
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Est. ${escapeHtml(p.estimatedTime)}</span>
        </div>
        <p style="font-size:0.88rem; color:var(--text-main); margin-bottom:4px;">${escapeHtml(p.action)}</p>
        <span style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(p.rationale)}</span>
      </div>
    `
      )
      .join("");
  }
}

function renderRoadmap() {
  const roadmap = store.getRoadmap();
  const container = document.getElementById("roadmapPhasesContainer");
  const titleEl = document.getElementById("roadmapHeaderTitle");
  const progressEl = document.getElementById("roadmapProgressPercent");

  if (titleEl) titleEl.textContent = `6-Month Phased Roadmap for ${roadmap.targetCareerTitle}`;
  if (progressEl) progressEl.textContent = `${store.getRoadmapProgressPercent()}%`;

  if (!container) return;

  container.innerHTML = roadmap.phases
    .map((phase) => {
      return `
      <article class="phase-card">
        <div class="phase-top">
          <div>
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px;">
              <span class="phase-num">Month ${phase.month}</span>
              <span class="pill-tag" style="font-size:0.72rem;">⏱ ${escapeHtml(phase.estimatedHours || "10 hrs/week")}</span>
            </div>
            <h3 class="phase-title">${escapeHtml(phase.phaseTitle)}</h3>
          </div>
        </div>

        <p class="phase-focus"><strong>Core Focus:</strong> ${escapeHtml(phase.focus)}</p>

        <div class="task-checklist">
          ${phase.tasks
            .map((task) => {
              const isDone = store.isTaskCompleted(task.id);
              return `
              <label class="task-item" for="${task.id}">
                <input
                  type="checkbox"
                  id="${task.id}"
                  class="task-checkbox"
                  data-task-id="${task.id}"
                  ${isDone ? "checked" : ""}
                >
                <span class="task-label ${isDone ? "done" : ""}">${escapeHtml(task.label)}</span>
              </label>
            `;
            })
            .join("")}
        </div>

        <div class="deliverable-box">
          🎯 <strong>Phase Deliverable Milestone:</strong> ${escapeHtml(phase.milestoneDeliverable)}
        </div>

        ${
          phase.resources?.length
            ? `
          <div style="margin-top:12px; font-size:0.8rem; color:var(--text-muted);">
            <strong>Curated Learning Resources:</strong>
            ${phase.resources.map((r) => `<span class="pill-tag" style="margin-left:6px;">${escapeHtml(r.title)} (${escapeHtml(r.type)})</span>`).join("")}
          </div>
        `
            : ""
        }
      </article>
    `;
    })
    .join("");

  // Attach Checkbox Handlers
  container.querySelectorAll(".task-checkbox").forEach((box) => {
    box.addEventListener("change", (e) => {
      const taskId = e.target.dataset.taskId;
      store.toggleTaskCompletion(taskId);
    });
  });
}

function renderProjects() {
  const container = document.getElementById("projectDeckContainer");
  if (!container) return;

  const projects = store.getProjects();

  container.innerHTML = projects
    .map((proj) => {
      let tierClass = "tier-beginner";
      if (proj.level.includes("Intermediate")) tierClass = "tier-intermediate";
      if (proj.level.includes("Advanced")) tierClass = "tier-advanced";

      return `
      <article class="project-card">
        <span class="tier-badge ${tierClass}">${escapeHtml(proj.level)}</span>
        <h3 class="project-name">${escapeHtml(proj.title)}</h3>
        <p class="project-desc">${escapeHtml(proj.summary)}</p>

        <!-- What skill gap this solves -->
        <div style="background:var(--primary-subtle); padding:10px 12px; border-radius:var(--radius-md); margin-bottom:12px; border-left:3px solid var(--primary);">
          <strong style="display:block; font-size:0.72rem; text-transform:uppercase; color:var(--primary); margin-bottom:2px;">Skill Gap Solved</strong>
          <span style="font-size:0.8rem; color:var(--text-main);">${escapeHtml(proj.gapSolved || "Reinforces foundational architecture patterns.")}</span>
        </div>

        <div style="margin-bottom:12px;">
          <strong style="display:block; font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Recommended Stack</strong>
          <div class="mini-tag-list">
            ${proj.stack.map((tech) => `<span class="pill-tag">${escapeHtml(tech)}</span>`).join("")}
          </div>
        </div>

        <div class="project-spec-box">
          <strong style="display:block; font-size:0.72rem; text-transform:uppercase; color:var(--text-main); margin-bottom:4px;">GitHub Build Specification</strong>
          ${escapeHtml(proj.githubSpec)}
        </div>

        <div class="project-bullet-box">
          <strong style="display:block; font-size:0.72rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px;">ATS Resume Bullet Suggestion</strong>
          "${escapeHtml(proj.resumeBullet)}"
        </div>

        <p style="font-size:0.78rem; color:var(--text-muted); margin-top:auto;">
          💡 <em>${escapeHtml(proj.portfolioImpact)}</em>
        </p>
      </article>
    `;
    })
    .join("");
}

function renderAdvisorChat() {
  if (!chatMessagesContainer) return;

  const messages = store.getChatMessages();
  const target = store.getTargetCareer();

  const subheader = document.getElementById("advisorSubheader");
  if (subheader) subheader.textContent = `Mentoring for ${target.title} • Grounded in your profile`;

  chatMessagesContainer.innerHTML = messages
    .map(
      (m) => `
    <div class="message-bubble ${m.sender}">
      ${formatMessageContent(m.text)}
    </div>
  `
    )
    .join("");

  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function formatMessageContent(rawText) {
  let formatted = escapeHtml(rawText);
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\n\n/g, "<br><br>");
  formatted = formatted.replace(/\n/g, "<br>");
  return formatted;
}

function renderExplorer() {
  const container = document.getElementById("explorerGridContainer");
  if (!container) return;

  const query = (explorerSearchInput?.value || "").toLowerCase().trim();
  const categoryFilter = explorerCategoryFilter?.value || "ALL";

  const filtered = careerCatalog.filter((career) => {
    const matchesCat = categoryFilter === "ALL" || career.category === categoryFilter;
    const matchesQuery =
      !query ||
      career.title.toLowerCase().includes(query) ||
      career.shortDescription.toLowerCase().includes(query) ||
      career.matchKeywords.some((k) => k.includes(query)) ||
      career.requiredSkills.some((s) => s.name.toLowerCase().includes(query));

    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:48px 20px; background:white; border-radius:var(--radius-lg); border:1px solid var(--border);">
        <p style="font-size:1.05rem; font-weight:700; color:var(--text-main);">No matching career tracks found</p>
        <p style="color:var(--text-muted); font-size:0.88rem;">Try searching for keywords like "Python", "Cloud", "Security", or "Design".</p>
      </div>
    `;
    return;
  }

  const currentTargetId = store.state.targetCareerId;

  container.innerHTML = filtered
    .map((career) => {
      const isTarget = career.id === currentTargetId;
      return `
      <article class="explorer-card">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span class="pill-tag" style="background:var(--primary-subtle); color:var(--primary); font-weight:700;">${escapeHtml(career.category)}</span>
          <span class="pill-tag">${escapeHtml(career.difficulty)}</span>
        </div>

        <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:6px;">${escapeHtml(career.title)}</h3>
        <p style="font-size:0.84rem; color:var(--text-muted); line-height:1.5; margin-bottom:14px; flex-grow:1;">
          ${escapeHtml(career.shortDescription)}
        </p>

        <div style="font-size:0.78rem; margin-bottom:14px;">
          <span style="color:var(--text-muted);">Comp:</span> <strong>${escapeHtml(career.salaryRange.split("(")[0])}</strong>
        </div>

        <div class="mini-tag-list" style="margin-bottom:14px;">
          ${career.requiredSkills.slice(0, 3).map((s) => `<span class="pill-tag">${escapeHtml(s.name)}</span>`).join("")}
        </div>

        <button class="btn ${isTarget ? "btn-secondary" : "btn-subtle"} btn-sm explorer-select-btn" data-id="${career.id}">
          ${isTarget ? "Active Target" : "Select Role &rarr;"}
        </button>
      </article>
    `;
    })
    .join("");

  container.querySelectorAll(".explorer-select-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const careerId = btn.dataset.id;
      store.setTargetCareer(careerId);
      renderAll();
      switchTab("overview");
      document.getElementById("app")?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function exportBlueprint() {
  const profile = store.getProfile();
  const target = store.getTargetCareer();
  const gaps = store.getGapAnalysis();
  const roadmap = store.getRoadmap();

  const lines = [
    "# AI CAREER INTELLIGENCE BLUEPRINT",
    `Generated on: ${new Date().toLocaleDateString()}`,
    "Disclaimer: Estimated fit calculations represent AI-assisted estimates based on candidate profile inputs.",
    "--------------------------------------------------",
    "",
    "## CANDIDATE PROFILE",
    `- Name: ${profile.fullName || "Candidate"}`,
    `- Education Stage: ${profile.educationLevel || "Not specified"}`,
    `- Degree / Stream: ${profile.degreeOrStream || "Not specified"}`,
    `- Current Skills: ${(profile.skills || []).join(", ")}`,
    `- Target Goals: ${profile.careerGoals || "Career advancement"}`,
    "",
    "## TARGET CAREER PROFILE",
    `- Role: ${target.title}`,
    `- Domain Category: ${target.category}`,
    `- Compensation Benchmark: ${target.salaryRange}`,
    `- Market Demand: ${target.marketDemand}`,
    `- Strategic Fit: ${target.whyItFitsSummary}`,
    "",
    "## SKILL GAP ANALYSIS & READINESS",
    `- Calculated Job Readiness: ${gaps.readinessPercent}%`,
    `- Strong Competencies: ${gaps.strongCompetencies.map((s) => s.name).join(", ") || "None"}`,
    `- Developing Skills: ${gaps.developingSkills.map((s) => s.name).join(", ") || "None"}`,
    `- Critical Gaps: ${gaps.missingCoreSkills.map((s) => s.name).join(", ") || "None"}`,
    "",
    "## TOP 3 PRIORITY SKILL IMPROVEMENTS",
  ];

  gaps.topPriorityGaps.forEach((g) => {
    lines.push(`### #${g.rank} Priority: ${g.name} (${g.targetLevel})`);
    lines.push(`Why it matters: ${g.whyItMatters}`);
    lines.push(`Recommendation: ${g.recommendation}`);
    lines.push(`Ramp-up estimate: ${g.estimatedRampUp}`);
    lines.push("");
  });

  lines.push("## 6-MONTH PHASED LEARNING ROADMAP");
  roadmap.phases.forEach((phase) => {
    lines.push("");
    lines.push(`### Month ${phase.month}: ${phase.phaseTitle}`);
    lines.push(`Focus: ${phase.focus}`);
    lines.push(`Deliverable Milestone: ${phase.milestoneDeliverable}`);
    phase.tasks.forEach((t) => {
      const mark = store.isTaskCompleted(t.id) ? "[X]" : "[ ]";
      lines.push(`  ${mark} ${t.label}`);
    });
  });

  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `career-intelligence-blueprint-${target.id}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ==========================================================================
// Advisor Chat Submission & Prompt Chips
// ==========================================================================
async function handleChatSubmit(e) {
  if (e) e.preventDefault();
  const text = chatInput?.value.trim();
  if (!text) return;

  chatInput.value = "";
  store.addChatMessage("user", text);

  const profile = store.getProfile();
  const target = store.getTargetCareer();

  try {
    const reply = await sendAdvisorChatQuery(text, profile, target);
    store.addChatMessage("assistant", reply);
  } catch (err) {
    store.addChatMessage("assistant", "I am currently analyzing your trajectory. Focus on completing Month 1 of your roadmap!");
  }
}

if (chatForm) chatForm.addEventListener("submit", handleChatSubmit);

promptChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const promptText = chip.dataset.prompt;
    if (promptText && chatInput) {
      chatInput.value = promptText;
      handleChatSubmit();
    }
  });
});

if (clearChatBtn) {
  clearChatBtn.addEventListener("click", () => {
    store.state.chatMessages = [
      {
        id: "welcome-msg",
        sender: "assistant",
        timestamp: new Date().toISOString(),
        text: "Chat cleared. Ask me anything about your career trajectory or portfolio projects!",
      },
    ];
    store.notify("CHAT_CLEARED");
  });
}

// Quick action buttons
if (dashViewGapsBtn) dashViewGapsBtn.addEventListener("click", () => switchTab("gaps"));
if (dashAskAdvisorBtn) dashAskAdvisorBtn.addEventListener("click", () => switchTab("advisor"));
if (dashStartSkillPlanBtn) dashStartSkillPlanBtn.addEventListener("click", () => switchTab("gaps"));
if (heroShowcaseInspectBtn) heroShowcaseInspectBtn.addEventListener("click", () => switchTab("matches"));
if (exportReportBtn) exportReportBtn.addEventListener("click", exportBlueprint);

// Search Filters in Explorer
if (explorerSearchInput) explorerSearchInput.addEventListener("input", renderExplorer);
if (explorerCategoryFilter) explorerCategoryFilter.addEventListener("change", renderExplorer);

// ==========================================================================
// Master Re-render Cycle
// ==========================================================================
function renderAll() {
  renderOverview();
  renderMatches();
  renderGaps();
  renderRoadmap();
  renderProjects();
  renderAdvisorChat();
  renderExplorer();
}

// Subscribe to store updates
store.subscribe((state, event) => {
  renderAll();
});

// Initial Render on Page Load
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
});
renderAll();
