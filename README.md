# Career Assistant

Career Assistant is a standalone student guidance website that helps students discover career paths based on their interests, favorite subjects, strengths, and work style.

The project is designed for students who feel confused about what to pursue in the future. A student can enter details such as an interest in coding, love for maths, strong problem-solving ability, or curiosity about technology, and the website will return career opportunities with a simple roadmap for each one.

## Project Goal

The goal of this project is to help students:

- understand which careers match their interests
- explore practical career opportunities instead of generic advice
- see the skills needed for each career
- get a step-by-step roadmap to start learning

Example:
A student who enjoys coding and mathematics may receive recommendations such as Software Engineer, Data Scientist, and AI Engineer, along with the skills and roadmap for each path.

## Features

- Modern responsive frontend
- Student profile form for career discovery
- Dynamic career recommendation cards
- Match score for each career
- Required skills for each role
- Individual roadmap for each career path
- Fully standalone frontend
- Works directly in the browser
- No installation or terminal required
- Local recommendation engine in JavaScript

## Tech Stack

- HTML
- CSS
- JavaScript

## Project Structure

```text
career ai/
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

## File Explanation

### `index.html`

This is the main frontend structure of the website.

It includes:

- hero section
- navigation
- student input form
- sample profile section
- results container
- result card template

### `style.css`

This file contains the full visual design of the project.

It controls:

- colors
- layout
- responsive design
- typography
- buttons
- cards
- roadmap styling
- result section styling

### `script.js`

This file handles the full website behavior.

It is responsible for:

- reading form input
- validating required fields
- showing loading states
- generating recommendation results in the browser
- rendering career cards dynamically
- showing errors if something goes wrong

It now contains the local recommendation engine, so the website works even when opened directly as a normal file.

### `server.js`

This file is now optional.

The main website does not need it anymore, because the recommendation logic runs directly in `script.js`. You can keep `server.js` only if you later want to turn the project back into a backend-powered version.

### `package.json`

This file contains the project metadata, dependencies, and scripts.

Main scripts:

- `npm start` starts the backend server
- `npm run dev` starts the backend in watch mode

### `.env.example`

This file shows the environment variables used by the project.

Example:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

## How the Recommendation System Works

The current website works fully in the browser using a local rule-based recommendation engine.

The browser has a built-in career catalog containing roles such as:

- Software Engineer
- Data Scientist
- AI Engineer
- UX/UI Designer
- Cybersecurity Analyst
- Product Manager

The browser compares the student profile with:

- interests
- subjects
- strengths
- work style
- important keywords

Then it scores each career and returns the top 3 matches.

## How To Run the Project

Open [index.html](/Users/anandkumar/Desktop/career%20ai%20/index.html) directly in your browser.

That is all. No terminal, no `npm install`, and no server is required.

## Deploying Publicly

This project is now ready to be deployed as a static website.

### Best option for this project

Because the current version runs fully in the browser and does not need a backend, the easiest deployment options are:

- GitHub Pages
- Netlify
- Vercel

### Files added for deployment

- `.gitignore` keeps local-only files out of Git
- `netlify.toml` adds simple Netlify publish settings
- `vercel.json` adds simple Vercel settings and response headers

### Deploy with GitHub Pages

This project is now prepared for GitHub Pages with:

- `.nojekyll` so GitHub Pages serves the site as plain static files
- `.github/workflows/deploy-pages.yml` so the site deploys automatically from the `main` branch

Steps:

1. Create a GitHub repository and push this project to it.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `GitHub Actions` as the source.
5. Push to the `main` branch and GitHub will publish the site automatically.

After deployment, the public URL will usually look like:

```text
https://your-username.github.io/your-repository-name/
```

### Deploy with Netlify

1. Push the project to GitHub.
2. In Netlify, choose `Add new project` and import the GitHub repository.
3. Keep the publish directory as the project root.
4. Deploy the site.

You can also drag and drop the project folder manually in Netlify for a quick static deployment.

### Deploy with Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Vercel will detect it as a static site.
4. Deploy it without any build command.

### Recommended path

If you want the easiest GitHub-based public launch, GitHub Pages is now ready to use for this project.

If you later want preview deployments and simpler custom domain workflows, Netlify or Vercel are still excellent options.

## Important Note

You can now open `index.html` directly using a normal `file://` browser URL or by double-clicking it.

## Example Student Input

- Interests: coding, maths, robotics
- Favorite subjects: mathematics, computer science
- Strengths: logical thinking, creativity
- Work style: analytical
- Goals: confused between software engineering, AI, and data science

Expected output:

- Software Engineer
- Data Scientist
- AI Engineer

Each result also includes:

- why it matches
- skills required
- a step-by-step roadmap

## Future Improvements

- Add login and saved student profiles
- Add more career categories
- Add charts and visual comparisons between careers
- Add course recommendations and learning resources
- Add career filtering by stream or education level
- Add multilingual support
- Add database storage

## Summary

Career Assistant is a beginner-friendly standalone project with a polished frontend and a built-in recommendation engine to help students understand possible career paths.

It is especially useful for students who know what they enjoy, but do not yet know which career direction fits them best.
