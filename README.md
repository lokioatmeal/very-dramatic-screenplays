# very-dramatic-screenplays

A **Hallmark-style romantic comedy screenplay generator** powered by OpenAI.

## Overview

This project generates short, charming screenplays following classic Hallmark conventions:
- Small-town settings
- Career vs. love tension
- Seasonal or emotional hooks
- Predictable but comforting resolutions

Optional **"adult-themed"** toggle adds maturity and innuendo (without explicit content).

## Architecture

- **Frontend**: Static Vite + Bootstrap, deployed to GitHub Pages
- **Backend**: Vercel serverless function (TypeScript) that calls OpenAI API
- **Separation**: Static site on GitHub Pages; API on Vercel; CORS-bridged

See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```
   Outputs to `dist/`

### Set Up Vercel API (One-time)

1. Create a Vercel account and import this repo
2. Add environment variable: `OPENAI_API_KEY` (your OpenAI API key)
3. Vercel deploys automatically on push
4. Copy the Vercel URL

### GitHub Pages Deployment

GitHub Actions automatically:
- Builds Vite on every push to `main`
- Deploys to `gh-pages` branch
- Site appears at `https://lokioatmeal.github.io/very-dramatic-screenplays/`

No manual steps needed—push and it's live.

## Key Files

- `src/main.ts` — Frontend entry point
- `src/api.ts` — API client (calls Vercel)
- `api/generate.ts` — Vercel serverless function
- `.github/workflows/deploy.yml` — GitHub Actions workflow
- `vite.config.ts` — Build config (sets GH Pages base path)

## Environment Variables

### Vercel (Production API)

- `OPENAI_API_KEY` — Your OpenAI API key (required)

### Frontend (Optional)

- `VITE_API_BASE` — Override API endpoint (default: Vercel domain in production, localhost:3001 in dev)

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting and detailed setup steps.

## Learning Resources

- See [ASSISTANT_CONTEXT.md](docs/ASSISTANT_CONTEXT.md) for project philosophy and collaboration guidelines
