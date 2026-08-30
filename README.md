# AI Career Intelligence Platform

[![Release](https://img.shields.io/badge/version-2.0.0-blue.svg?style=flat-square)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/badge/Tests-10%20Passed-success.svg?style=flat-square)]()
[![Platform: Web / Offline Compatible](https://img.shields.io/badge/Platform-Web%20%2F%20Offline%20Compatible-indigo.svg?style=flat-square)]()

A production-grade **AI-Powered Career Intelligence Platform** engineered for students, graduates, and software engineers transitioning into specialized modern technology disciplines.

Unlike generic career quizzes or open-ended chat simulations, this platform combines a **deterministic multi-factor algorithmic engine** with a **context-aware LLM personalizer** to deliver transparent career compatibility scores, granular skill gap matrices, dynamic 6-month learning roadmaps, and targeted portfolio project specifications.

---

## 🏛️ System Architecture

The platform uses a hybrid architectural separation of concerns: **Deterministic Algorithmic Engines** provide verified structured facts and bounds, while the **LLM Layer** provides contextual reasoning, personalized explanations, and conversational mentorship.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER PROFILE & ASSESSMENT                       │
│     (Academic Stage, Verified Skills, Domain Interests, Goals, Style)  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               DETERMINISTIC MULTI-FACTOR MATCH ENGINE                  │
│   • Technical Skills Overlap (40%)    • Educational Alignment (15%)    │
│   • Domain Interest Synergy (25%)     • Work Style Fit (10%)           │
│   • Practical Strengths (10%)                                          │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│        SKILL GAP ANALYZER         │ │    DYNAMIC PERSONALIZED ROADMAP   │
│ • Strong Competencies (Active)    │ │ • Adapts to candidate's baseline  │
│ • Developing / Adjacent Skills    │ │ • Phased 6-Month Milestones       │
│ • Critical Core Skill Gaps        │ │ • Actionable Task Checklists      │
│ • Top 3 Priority Gaps with "WHY"  │ │ • Effort estimates (10-12 hrs/wk) │
│ • Job Readiness Score (0-100%)    │ │ • Curated Free Resources          │
└───────────────────────────────────┘ └───────────────────────────────────┘
                  │                                   │
                  └─────────────────┬─────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      PORTFOLIO PROJECT BLUEPRINTS                      │
│     Tiered Builds: Beginner → Intermediate → Production-Grade          │
│     • Explicit "Skill Gap Solved" mapping                              │
│     • Recommended Stack  • GitHub Specs  • ATS Resume Bullets          │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CONTEXT-AWARE AI CAREER ADVISOR                      │
│    Grounded in Candidate Profile, Active Roadmap & Skill Gaps          │
│    • Express 5 Backend + OpenAI GPT-4o-mini Integration                │
│    • Offline Career Guidance Engine Heuristic Fallback                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Core Features & Capabilities

### 1. Transparent Career Matching
- Evaluates candidates across **16 comprehensive industry career tracks** (Full-Stack, Frontend Platform, Backend Distributed Systems, AI & Machine Learning, Data Science, Data Platform Engineering, Cloud & DevOps, SRE, Cybersecurity, Penetration Testing, Product Design, Technical Product Management, Mobile Engineering, QA Automation, Solutions Architecture, and Web3 Smart Contracts).
- Uses honest, calibrated match language (**"Estimated Match"**, **"Profile Compatibility"**, **"AI Career Fit"**) accompanied by explicit transparency disclaimers.

### 2. Granular Skill Gap Analysis & Top 3 Priorities
- Categorizes competencies into:
  - 🟢 **Strong Competencies**: Active skills verified in candidate profile.
  - 🟡 **Developing Skills**: Adjacent technologies requiring project hardening.
  - 🔴 **Critical Core Gaps**: Priority skills required for entry-level screening.
- Automatically identifies the **Top 3 Priority Skill Gaps** with an explicit rationale explaining **why each skill matters** and estimated ramp-up times.

### 3. Dynamic Personalized 6-Month Roadmaps
- Roadmaps dynamically adapt to the user's verified baseline:
  - Candidates with verified foundations are fast-tracked to advanced modules.
  - Beginners receive structured foundational syntax and tooling tracks.
- Includes effort estimates (10-12 hrs/week), deliverable milestones, and interactive task checkboxes with state persisted in `localStorage`.

### 4. Targeted Portfolio Projects
- Tiered portfolio builds (Beginner, Intermediate, Advanced) explicitly stating:
  > *"What skill gap does this project solve?"*
- Complete with recommended tech stacks, GitHub architecture specifications, and ATS-compliant resume bullets.

### 5. Dual-Mode AI Advisor
- **Cloud AI Mode**: When an OpenAI API key is configured on the backend, delivers structured JSON responses grounded in the candidate's verified profile and active roadmap.
- **Offline Guidance Engine Mode**: When offline or running without external APIs, provides heuristic guidance without hallucinating or making false claims.

---

## 🔒 Security & Privacy Engineering

- **Zero-Secret Client**: All API keys reside exclusively server-side in `.env`. Zero secrets in client scripts or HTML bundles.
- **Strict Guardrails**: Prompt constraints forbid the LLM from inventing or hallucinating candidate degrees, certifications, experience, or salary figures.
- **Security Headers & Middleware**: Configured with `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, and memory rate limiting (40 req/min).
- **Sanitized I/O**: Strict body length restrictions (500kb max) and XSS prevention via text escaping (`escapeHtml`).
- **Client-Side Privacy**: User profiles, roadmap states, and assessment records reside locally in the candidate's browser `localStorage`.

---

## 🛠️ Tech Stack & Requirements

- **Frontend**: Vanilla ES6+ Modules, Semantic HTML5, CSS3 Design Tokens (`Plus Jakarta Sans`, `JetBrains Mono`).
- **Backend**: Node.js, Express 5.1.0, OpenAI SDK v6.3.0 (`gpt-4o-mini`).
- **Testing**: Built-in Node.js Assert Test Suite (`node tests/test-runner.js`).
- **Storage**: Browser `localStorage` for offline persistence.

---

## ⚡ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/career-intelligence-platform.git
cd career-intelligence-platform
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your OpenAI API key (optional):
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=5000
```
> **Note**: The application is fully functional without an API key using its built-in Offline Algorithmic Engine.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start the Application
```bash
npm start
```
Open your browser at `http://localhost:5000`.

---

## 🌐 Deployment Options

### Standalone Browser Mode (GitHub Pages / Static Web)
Open `index.html` directly in any modern browser. The deterministic multi-factor match algorithms, skill gap matrix, dynamic roadmaps, and offline advisor execute 100% client-side.

### Node.js Production Server (Render / Railway / Docker)
Deploy with `npm start`. Ensure `OPENAI_API_KEY` is added to your hosting platform's environment variables.

---

## ⚠️ Limitations & Non-Goals

- **Estimated Fit**: Match scores are algorithmic compatibility estimates based on candidate-provided inputs, not guarantees of employment or career success.
- **Curated Taxonomy**: The system evaluates 16 major technology tracks. Emerging niche sub-disciplines outside this taxonomy are mapped to the closest adjacent track.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
