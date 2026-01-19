# Architecture Overview

## High-Level Design

This project separates **frontend** (static UI) from **backend** (AI API) for security, scalability, and clarity.

```
┌─────────────────────────────────────────┐
│  User's Browser                         │
│  (loads from GitHub Pages)              │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Vite App (HTML/CSS/JS)          │  │
│  │  - Form inputs                   │  │
│  │  - Display screenplay            │  │
│  │  - Fetch API calls (CORS)        │  │
│  └──────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │
               │ HTTPS POST
               │ JSON request
               │ (CORS preflight)
               ↓
┌──────────────────────────────────────────────┐
│  Vercel Serverless Function                  │
│  (api/generate.ts)                           │
│                                              │
│  - Receives form data                        │
│  - Validates input                           │
│  - Calls OpenAI API (with secret key)        │
│  - Returns screenplay                        │
│  - Handles errors                            │
└──────────────┬───────────────────────────────┘
               │
               │ HTTPS (secret key in header)
               │
               ↓
        ┌──────────────┐
        │  OpenAI API  │
        │  (Claude)    │
        └──────────────┘
```

---

## Components

### Frontend (Static)

**Location:** `src/`, built to `dist/`  
**Deployed:** GitHub Pages  
**Tech:** TypeScript, Vite, Bootstrap

**Key Files:**
- `src/main.ts` — Entry point; wires form to API client
- `src/api.ts` — Fetches Vercel API; handles errors
- `src/style.css` — Stylesheet
- `index.html` — Form and output container

**Build Output:**
```
dist/
├── index.html        (served at root)
├── assets/
│   ├── index-HASH.js     (bundled frontend code)
│   └── index-HASH.css    (bundled styles)
└── vite.svg
```

**Base Path:** `/very-dramatic-screenplays/` (configured in `vite.config.ts` for GitHub Pages)

---

### Backend API (Serverless)

**Location:** `api/generate.ts`  
**Deployed:** Vercel  
**Tech:** TypeScript, OpenAI SDK, Node.js

**Endpoint:**
```
POST https://very-dramatic-screenplays.vercel.app/api/generate
```

**Request Body:**
```json
{
  "protagonistName": "Emma",
  "setting": "Maplewood",
  "season": "Christmas",
  "romanticInterest": "Jack",
  "adultThemed": false
}
```

**Response:**
```json
{
  "title": "CHRISTMAS IN MAPLEWOOD",
  "content": "FADE IN:\n\nEXT. MAPLEWOOD TOWN SQUARE - DAY\n\n..."
}
```

**Error Response:**
```json
{
  "error": "Missing required fields"
}
```

**Key Features:**
- CORS headers for cross-origin requests
- OPTIONS preflight handling
- OpenAI API key stored securely (never exposed to browser)
- Error handling with JSON responses

---

## Data Flow

1. **User fills form** on GitHub Pages frontend
2. **Form submit** → `src/main.ts` handler
3. **API call** → `src/api.ts` fetches Vercel endpoint
4. **CORS preflight** → Browser sends OPTIONS request (handled by function)
5. **POST request** → Browser sends form data to Vercel
6. **Vercel function processes:**
   - Validates input
   - Reads `OPENAI_API_KEY` from environment
   - Calls OpenAI with system + user prompts
   - Parses response
   - Returns JSON
7. **Frontend receives** screenplay JSON
8. **Screenplay displays** in UI

---

## Security Model

### ✅ Secure (Your Setup)

- **OpenAI API key** lives on Vercel server (environment variable)
- **Only Vercel** knows the key
- **Browser never sees** the key
- **Frontend sends** form data to trusted Vercel endpoint

### ✗ Insecure (Anti-Pattern)

```typescript
// NEVER do this:
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${MY_SECRET_KEY}` }
});
```

Browser dev tools would expose `MY_SECRET_KEY` to anyone visiting your site.

---

## Deployment Flow

### Frontend (GitHub Pages)

```
Push to main
    ↓
GitHub Actions triggers (.github/workflows/deploy.yml)
    ↓
npm run build (TypeScript → JavaScript, Vite bundles)
    ↓
Outputs dist/
    ↓
Actions pushes dist/ to gh-pages branch
    ↓
GitHub Pages serves gh-pages branch
    ↓
Live at https://lokioatmeal.github.io/very-dramatic-screenplays/
```

### Backend (Vercel)

```
Push to main (same commit)
    ↓
Vercel webhook triggered
    ↓
Vercel clones repo
    ↓
npm install (installs dependencies)
    ↓
TypeScript compiled
    ↓
api/generate.ts → Serverless function
    ↓
Deployed to Vercel edge network
    ↓
Live at https://very-dramatic-screenplays.vercel.app/api/generate
```

Both deploy simultaneously on push. No manual steps needed.

---

## CORS (Cross-Origin Resource Sharing)

### The Problem

GitHub Pages lives at:
```
https://lokioatmeal.github.io
```

Vercel API lives at:
```
https://very-dramatic-screenplays.vercel.app
```

**Different origin** → Browser blocks fetch() by default.

### The Solution

Vercel function returns CORS headers:

```typescript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') return res.status(200).end();
```

This tells the browser: "Yes, GitHub Pages is allowed to call this API."

---

## Environment Variables

### Vercel (Required for API)

| Variable | Value | Example |
|----------|-------|---------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |

Set in: Vercel Dashboard → Project Settings → Environment Variables

### Frontend (Optional)

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_BASE` | Override API endpoint | Auto-detected (Vercel in prod, localhost in dev) |

Set in: `.env.local` for local dev

---

## Technology Stack

| Layer | Tech | Why |
|-------|------|-----|
| **Frontend** | TypeScript, Vite, Bootstrap | Type safety, fast builds, responsive UI |
| **Backend** | Node.js, OpenAI SDK | Serverless, native TypeScript, official SDK |
| **Hosting** | GitHub Pages + Vercel | Free tier, seamless GitHub integration |
| **AI** | OpenAI (Claude 3.5 Sonnet) | State-of-the-art reasoning for creative writing |

---

## File Structure

```
.
├── src/
│   ├── main.ts          # Frontend entry point
│   ├── api.ts           # API client
│   ├── style.css        # Styles
│   └── counter.ts       # (unused)
├── api/
│   └── generate.ts      # Vercel serverless function
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions (GH Pages)
├── index.html           # HTML template
├── vite.config.ts       # Vite config (sets base path)
├── tsconfig.json        # TypeScript config
├── package.json         # Dependencies
├── DEPLOYMENT.md        # Deploy instructions
├── README.md            # Project overview
└── ARCHITECTURE.md      # This file
```

---

## Future Scaling

### If traffic grows:

- **Frontend:** GitHub Pages scales automatically (CDN-backed)
- **API:** Vercel auto-scales; pay per execution

### If you want to add features:

- **Database:** Add a persistent layer (Vercel Postgres, Firebase)
- **Auth:** Implement user logins (NextAuth, Supabase)
- **Caching:** Store generated screenplays (Redis)
- **Rate limiting:** Protect against abuse (Vercel middleware)

Current architecture supports all of these without major refactoring.

---

## Design Principles

1. **Security first** — API key never exposed to browser
2. **Separation of concerns** — Static site ≠ API
3. **Minimal dependencies** — Only essential packages
4. **Type safety** — TypeScript throughout
5. **Scalability** — Serverless, no servers to manage
6. **Developer experience** — Clear, commented code
