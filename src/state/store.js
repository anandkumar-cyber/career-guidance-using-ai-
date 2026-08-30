// Centralized Reactive Application Store with LocalStorage Persistence
import { careerCatalog } from "../data/careers.js";
import { getRankedRecommendations } from "../engine/scoring.js";
import { analyzeSkillGaps } from "../engine/gapAnalysis.js";
import { generateCareerRoadmap } from "../engine/roadmapGenerator.js";
import { projectCatalog } from "../data/projects.js";

const STORAGE_KEY = "career_intelligence_platform_v2";

class Store {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  getDefaultProfile() {
    return {
      fullName: "",
      educationLevel: "College / University Student",
      degreeOrStream: "Computer Science / Tech",
      graduationYear: "2026",
      skills: ["JavaScript", "Python", "SQL", "Git & GitHub"],
      selectedInterests: ["AI & Machine Learning", "Web & Full-Stack"],
      interestsText: "Building scalable web applications, machine learning, and automation tools.",
      subjectsText: "Mathematics, Computer Science, Algorithms",
      strengthsText: "Problem solving, logical reasoning, rapid prototyping",
      workStyle: "analytical",
      careerGoals: "Aiming to land a high-impact software or AI engineering role within 6 months.",
      dreamOutcome: "Build production-grade systems, contribute to open source, and grow toward tech leadership.",
      experienceDescription: "Built 2 full-stack web apps with React and Node, experimented with Python ML scripts.",
    };
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          profile: parsed.profile || this.getDefaultProfile(),
          targetCareerId: parsed.targetCareerId || "software-engineer",
          recommendations: parsed.recommendations || [],
          completedTaskIds: new Set(parsed.completedTaskIds || []),
          chatMessages: parsed.chatMessages || [],
          hasCompletedAssessment: Boolean(parsed.hasCompletedAssessment),
        };
      }
    } catch (e) {
      console.warn("Failed to load state from localStorage:", e);
    }

    return {
      profile: this.getDefaultProfile(),
      targetCareerId: "software-engineer",
      recommendations: [],
      completedTaskIds: new Set(),
      chatMessages: [
        {
          id: "welcome-msg",
          sender: "assistant",
          timestamp: new Date().toISOString(),
          text: "Hello! I am your AI Career Advisor. I have access to your active profile, target career goals, and learning roadmap. Ask me anything about what to learn next, project ideas, resume bullets, or interview strategies.",
        },
      ],
      hasCompletedAssessment: false,
    };
  }

  saveState() {
    try {
      const serializable = {
        profile: this.state.profile,
        targetCareerId: this.state.targetCareerId,
        recommendations: this.state.recommendations,
        completedTaskIds: Array.from(this.state.completedTaskIds),
        chatMessages: this.state.chatMessages.slice(-25),
        hasCompletedAssessment: this.state.hasCompletedAssessment,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.warn("Failed to save state to localStorage:", e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event) {
    this.saveState();
    this.listeners.forEach((listener) => listener(this.state, event));
  }

  getProfile() {
    return this.state.profile;
  }

  setProfile(updatedFields) {
    this.state.profile = { ...this.state.profile, ...updatedFields };
    this.state.hasCompletedAssessment = true;
    this.recomputeCareerIntelligence();
    this.notify("PROFILE_UPDATED");
  }

  recomputeCareerIntelligence() {
    const ranked = getRankedRecommendations(this.state.profile);
    this.state.recommendations = ranked;

    // Default target career to top match if not manually set
    if (!this.state.targetCareerId && ranked.length > 0) {
      this.state.targetCareerId = ranked[0].careerId;
    }
  }

  setTargetCareer(careerId) {
    this.state.targetCareerId = careerId;
    this.notify("TARGET_CAREER_CHANGED");
  }

  getTargetCareer() {
    const found = careerCatalog.find((c) => c.id === this.state.targetCareerId);
    return found || careerCatalog[0];
  }

  getGapAnalysis() {
    const target = this.getTargetCareer();
    return analyzeSkillGaps(target, this.state.profile.skills);
  }

  getRoadmap() {
    const target = this.getTargetCareer();
    const gaps = this.getGapAnalysis();
    return generateCareerRoadmap(target, gaps, this.state.profile.skills);
  }

  getProjects() {
    const target = this.getTargetCareer();
    return (
      projectCatalog[target.id] ||
      projectCatalog["software-engineer"] ||
      []
    );
  }

  toggleTaskCompletion(taskId) {
    if (this.state.completedTaskIds.has(taskId)) {
      this.state.completedTaskIds.delete(taskId);
    } else {
      this.state.completedTaskIds.add(taskId);
    }
    this.notify("TASK_TOGGLED");
  }

  isTaskCompleted(taskId) {
    return this.state.completedTaskIds.has(taskId);
  }

  getRoadmapProgressPercent() {
    const roadmap = this.getRoadmap();
    const total = roadmap.totalTasksCount || 1;
    let completed = 0;
    roadmap.phases.forEach((phase) => {
      phase.tasks.forEach((task) => {
        if (this.state.completedTaskIds.has(task.id)) {
          completed++;
        }
      });
    });
    return Math.round((completed / total) * 100);
  }

  addChatMessage(sender, text) {
    const msg = {
      id: "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      sender,
      text,
      timestamp: new Date().toISOString(),
    };
    this.state.chatMessages.push(msg);
    this.notify("CHAT_MESSAGE_ADDED");
    return msg;
  }

  getChatMessages() {
    return this.state.chatMessages;
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    this.notify("RESET_ALL");
  }
}

export const store = new Store();
// Initial calculation
store.recomputeCareerIntelligence();
