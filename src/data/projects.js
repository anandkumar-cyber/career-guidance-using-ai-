// Curated Portfolio Projects Matrix with Explicit Skill-Gap Solutions & GitHub Specs

export const projectCatalog = {
  "software-engineer": [
    {
      level: "Beginner",
      title: "Real-Time Collaborative Task Board",
      stack: ["JavaScript", "HTML5", "CSS3", "LocalStorage / WebSockets"],
      summary: "A kanban-style task manager featuring drag-and-drop mechanics, priority filtering, and instant state persistence.",
      gapSolved: "Solves gaps in DOM manipulation, event delegation, client-side state management, and semantic HTML5.",
      githubSpec: "Implement custom drag events, optimistic UI updates, modular ES6 architecture, and automated unit tests with Jest.",
      portfolioImpact: "Demonstrates DOM mastery, event loop understanding, and clean client-side state design.",
      resumeBullet: "Engineered a responsive Kanban board with zero external frameworks, implementing optimistic UI updates and local persistence."
    },
    {
      level: "Intermediate",
      title: "Full-Stack DevLink & Portfolio Platform",
      stack: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
      summary: "A multi-tenant developer profile builder where users create customized portfolio links with analytics tracking and custom slugs.",
      gapSolved: "Solves gaps in Relational Database Schema Design, REST API architecture, JWT authentication, and component state management.",
      githubSpec: "RESTful JSON API with JWT auth, relational database schema with foreign keys, image upload integration, and rate limiting.",
      portfolioImpact: "Validates ability to design robust full-stack architectures, relational data modeling, and secure authentication.",
      resumeBullet: "Built and deployed a full-stack developer portfolio platform supporting 100+ simulated users with JWT authentication and PostgreSQL."
    },
    {
      level: "Advanced (Production-Grade)",
      title: "Distributed Microservices E-Commerce Core",
      stack: ["TypeScript", "Next.js", "Go / Node", "Redis", "Docker", "RabbitMQ"],
      summary: "High-throughput checkout and inventory microservice handling concurrent order placement, event streaming, and distributed locks.",
      gapSolved: "Solves gaps in Asynchronous Message Queues, Distributed Locking, Redis Caching, and Docker Containerization.",
      githubSpec: "Separate services for Auth, Catalog, and Orders. Uses Redis for distributed rate limiting and RabbitMQ for asynchronous event notifications.",
      portfolioImpact: "Proves enterprise readiness, concurrency handling, message queuing, and containerized deployment workflows.",
      resumeBullet: "Architected a containerized microservices platform with RabbitMQ event bus, preventing race conditions under high concurrent checkout traffic."
    }
  ],
  "frontend-engineer": [
    {
      level: "Beginner",
      title: "Accessible Dark/Light UI Component Library",
      stack: ["React", "TypeScript", "Tailwind CSS", "Storybook", "Axe-core"],
      summary: "A production-quality component system featuring accessible modals, dropdowns, tabs, and form controls tested for keyboard navigation.",
      gapSolved: "Solves gaps in Web Accessibility (WCAG AA), Storybook documentation, and TypeScript component prop typing.",
      githubSpec: "ARIA attributes on all components, focus trapping in modal dialogs, Storybook documentation, and automated axe-core accessibility tests.",
      portfolioImpact: "Proves design system craftsmanship, strict accessibility adherence, and clean UI engineering.",
      resumeBullet: "Authored an accessible 20-component React library in Storybook with 100% WCAG AA keyboard navigation compliance."
    },
    {
      level: "Intermediate",
      title: "Real-Time SaaS Analytics Dashboard",
      stack: ["Next.js (App Router)", "TypeScript", "Chart.js", "Zustand", "Tailwind CSS"],
      summary: "A high-performance analytics console visualizing live revenue funnels, custom date ranges, and CSV data export with sub-second page transitions.",
      gapSolved: "Solves gaps in Next.js Server Components, client state caching with Zustand, and interactive data visualization.",
      githubSpec: "Dynamic route handlers, optimistic mutations, client-side data filtering, and responsive chart layouts across mobile and desktop.",
      portfolioImpact: "Validates Next.js modern paradigms, state hydration, and complex responsive dashboard layouts.",
      resumeBullet: "Built a responsive Next.js analytics dashboard with Zustand state caching, achieving 98+ Lighthouse performance score."
    },
    {
      level: "Advanced (Production-Grade)",
      title: "Web Platform Performance & Asset Optimization Suite",
      stack: ["TypeScript", "Web Workers", "WASM", "Lighthouse CI", "Vite"],
      summary: "A client-side image and vector asset compressor utilizing Web Workers and WebAssembly for zero-server lag conversions.",
      gapSolved: "Solves gaps in Web Workers, multithreaded browser execution, WebAssembly, and Core Web Vitals optimization.",
      githubSpec: "Offloads image compression to background Web Workers, streams progress events, and enforces Lighthouse CI thresholds.",
      portfolioImpact: "Proves elite browser platform knowledge, web performance engineering, and client-side processing.",
      resumeBullet: "Engineered an in-browser asset compression suite leveraging Web Workers, reducing main-thread CPU blocking by 85%."
    }
  ],
  "ai-engineer": [
    {
      level: "Beginner",
      title: "Custom Document Semantic Q&A CLI",
      stack: ["Python", "OpenAI / HuggingFace API", "ChromaDB / FAISS"],
      summary: "A command-line tool that parses PDF manuals and answers domain-specific queries using embeddings and vector similarity search.",
      gapSolved: "Solves gaps in Vector Embeddings, Document Chunking Strategies, and RAG fundamentals.",
      githubSpec: "Chunking strategies, cosine similarity retrieval, context prompt formatting, and token cost calculation logging.",
      portfolioImpact: "Demonstrates practical understanding of vector embeddings, RAG architecture, and token optimization.",
      resumeBullet: "Developed an open-source RAG document search tool in Python using FAISS vector search, reducing context lookup latency by 40%."
    },
    {
      level: "Intermediate",
      title: "Multimodal AI Content Summarizer & Podcast Generator",
      stack: ["Python", "FastAPI", "Whisper", "PyTorch", "React"],
      summary: "An end-to-end web app that transcribes audio interviews, extracts key insights, and synthesizes executive bullet points with TTS.",
      gapSolved: "Solves gaps in Audio Transcription Pipelines (Whisper), Asynchronous FastAPI endpoints, and Audio Streaming.",
      githubSpec: "Asynchronous processing with Celery/Redis, audio streaming with WebSockets, and structured JSON output validation using Pydantic.",
      portfolioImpact: "Proves competency in asynchronous ML pipelines, audio processing, and production API integration.",
      resumeBullet: "Engineered an asynchronous multimodal transcription and summarization pipeline using FastAPI and Whisper, handling 1hr audio files under 45s."
    },
    {
      level: "Advanced (Production-Grade)",
      title: "Autonomous Agentic Code Reviewer with Static Analysis",
      stack: ["Python", "LangGraph / LangChain", "Docker", "Tree-sitter", "GitHub API"],
      summary: "An autonomous agent that inspects GitHub pull requests, builds an AST graph, identifies security vulnerabilities, and posts inline review comments.",
      gapSolved: "Solves gaps in Agentic Reflection Loops, Abstract Syntax Tree (AST) parsing, and automated software verification.",
      githubSpec: "Multi-agent reflection loop with fallback heuristics, rate limit backoff, sandbox execution of code snippets, and automated benchmark scoring.",
      portfolioImpact: "Highlights state-of-the-art agent orchestration, AST parsing, and automated software engineering workflows.",
      resumeBullet: "Built a self-healing AI pull-request review bot with LangGraph, reducing code quality triage time by performing automated AST linting."
    }
  ],
  "data-scientist": [
    {
      level: "Beginner",
      title: "Exploratory Tech Compensation & Career Trends Analysis",
      stack: ["Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter"],
      summary: "A rigorous data investigation into global engineering compensation trends, analyzing experience, remote flexibility, and skill premiums.",
      gapSolved: "Solves gaps in Data Cleaning, Exploratory Data Analysis (EDA), and Visual Statistical Storytelling.",
      githubSpec: "Data cleaning pipeline, outlier detection, distribution analysis, correlation matrices, and clear markdown documentation.",
      portfolioImpact: "Exhibits strong exploratory data analysis (EDA), data cleaning hygiene, and visual storytelling.",
      resumeBullet: "Analyzed 10,000+ tech compensation records in Python, producing actionable insight visual reports on remote salary disparities."
    },
    {
      level: "Intermediate",
      title: "Customer Churn Prediction & Lifetime Value Engine",
      stack: ["Python", "Scikit-Learn", "XGBoost", "Streamlit", "SQL"],
      summary: "An interactive dashboard that predicts SaaS customer churn probabilities and generates individual retention intervention recommendations.",
      gapSolved: "Solves gaps in Supervised Machine Learning (XGBoost), Feature Engineering, Hyperparameter Tuning, and ROC-AUC evaluation.",
      githubSpec: "Feature engineering, cross-validation, hyperparameter tuning, ROC-AUC metric evaluation, and an interactive Streamlit frontend.",
      portfolioImpact: "Shows end-to-end machine learning modeling linked to real business ROI metrics.",
      resumeBullet: "Trained an XGBoost classification model achieving 0.88 ROC-AUC on customer churn data, deploying a live interactive UI for risk scoring."
    },
    {
      level: "Advanced (Production-Grade)",
      title: "Automated A/B Testing & Statistical Experimentation Suite",
      stack: ["Python", "FastAPI", "Statsmodels", "PostgreSQL", "React Charts"],
      summary: "A self-serve experimentation engine calculating sample size requirements, sequential p-values, and Bayesian conversion distributions.",
      gapSolved: "Solves gaps in Statistical Hypothesis Testing, CUPED Variance Reduction, and A/B Test Experimentation.",
      githubSpec: "Frequentist & Bayesian statistical engines, delta method for variance reduction, automated cuped feature, and REST API endpoints.",
      portfolioImpact: "Proves senior-level grasp of experimental design, statistical rigor, and production data tools.",
      resumeBullet: "Designed an automated A/B test analysis engine with CUPED variance reduction, cutting required sample sizes for experiments by 25%."
    }
  ],
  "cloud-devops-engineer": [
    {
      level: "Beginner",
      title: "Automated Multi-Environment CI/CD Pipeline",
      stack: ["GitHub Actions", "Docker", "Node.js / Python", "AWS S3 / CloudFront"],
      summary: "A continuous integration and delivery pipeline with automated linting, test suites, semantic versioning, and zero-downtime static deployments.",
      gapSolved: "Solves gaps in CI/CD Automation, Multi-stage Docker Builds, and Cloud Object Storage Hosting.",
      githubSpec: "Multi-stage Docker builds, caching optimization, environment secrets management, and automated Slack/Discord deployment alerts.",
      portfolioImpact: "Demonstrates modern CI/CD automation and container build optimization.",
      resumeBullet: "Created a GitHub Actions CI/CD workflow utilizing multi-stage Docker builds, reducing pipeline execution duration by 60%."
    },
    {
      level: "Intermediate",
      title: "Kubernetes Microservices Cluster with Ingress & TLS",
      stack: ["Kubernetes (k3s/Minikube)", "Helm", "Nginx Ingress", "Cert-Manager"],
      summary: "A high-availability cluster running load-balanced services with auto-healing, rolling updates, ConfigMaps, and automated SSL certificate renewal.",
      gapSolved: "Solves gaps in Kubernetes Orchestration, Helm Chart Templating, Ingress Routing, and SSL Automation.",
      githubSpec: "Custom Helm charts, resource requests and limits, readiness/liveness probes, and Horizontal Pod Autoscaler (HPA) triggers.",
      portfolioImpact: "Validates hands-on container orchestration, service discovery, and traffic routing.",
      resumeBullet: "Configured a production-simulated Kubernetes cluster with custom Helm charts, HPA autoscaling, and automated TLS ingress."
    },
    {
      level: "Advanced (Production-Grade)",
      title: "GitOps Cloud Infrastructure as Code (IaC) with Observability",
      stack: ["Terraform", "ArgoCD", "AWS (EKS, RDS, VPC)", "Prometheus & Grafana"],
      summary: "Complete reproducible cloud infrastructure provisioned via Terraform and synchronized automatically with GitOps, monitored by metrics and alerting.",
      gapSolved: "Solves gaps in Terraform State Locking, GitOps Continuous Sync (ArgoCD), and Prometheus Cluster Observability.",
      githubSpec: "Modular Terraform scripts with remote state locking in S3/DynamoDB, ArgoCD declarative deployments, and Grafana dashboard alerts.",
      portfolioImpact: "Demonstrates enterprise-level infrastructure engineering, declarative state management, and production observability.",
      resumeBullet: "Engineered zero-drift cloud infrastructure via modular Terraform and ArgoCD GitOps, setting up Prometheus alerting for SLA monitoring."
    }
  ],
  "cybersecurity-analyst": [
    {
      level: "Beginner",
      title: "Automated Network Port Scanner & Banner Grabber",
      stack: ["Python", "Sockets", "Scapy", "CLI"],
      summary: "A multi-threaded port scanner that probes IP subnets, fingerprints active services, and flags exposed common vulnerable ports.",
      gapSolved: "Solves gaps in TCP/IP Socket Programming, Port Scanning Protocols, and Network Reconnaissance.",
      githubSpec: "Socket timeout handling, banner parsing, customizable port ranges, and structured JSON report exports.",
      portfolioImpact: "Shows core networking protocol mastery and security tool programming.",
      resumeBullet: "Programmed a multi-threaded Python port scanner capable of subnet reconnaissance and service banner classification."
    },
    {
      level: "Intermediate",
      title: "Log Analytics & SIEM Intrusion Detection Dashboard",
      stack: ["Python", "Elasticsearch", "Logstash", "Kibana (ELK) / Splunk"],
      summary: "A centralized security monitoring console that ingests web and firewall access logs to detect brute-force attacks and suspicious traffic.",
      gapSolved: "Solves gaps in SIEM Log Parsing, Threat Correlation Rules, and Security Operations Center (SOC) Alerting.",
      githubSpec: "Regex parsing for Apache/Nginx logs, IP geolocation enrichment, alert rules for failed authentication surges, and visual threat graphs.",
      portfolioImpact: "Proves capability in incident response, threat detection engineering, and log forensics.",
      resumeBullet: "Configured an ELK security pipeline ingesting 50,000+ daily log events, creating automated detection alerts for credential stuffing."
    },
    {
      level: "Advanced (Production-Grade)",
      title: "Automated Web Application Vulnerability & SAST Scanner",
      stack: ["Python", "FastAPI", "Docker", "OWASP ZAP API", "Burp Suite"],
      summary: "A security scanner that crawls target web applications, audits CORS configurations, flags SQL injection / XSS vectors, and generates remediation advice.",
      gapSolved: "Solves gaps in OWASP Top 10 Vulnerability Assessment, Dynamic Web Fuzzing, and Security Automation.",
      githubSpec: "Headless browser crawling, automated payload fuzzing, false-positive filtering, and executive PDF compliance report generation.",
      portfolioImpact: "Highlights offensive and defensive web security expertise and automated vulnerability management.",
      resumeBullet: "Built an automated OWASP top-10 security scanning suite with Python and ZAP API, detecting high-severity misconfigurations in CI/CD."
    }
  ]
};
