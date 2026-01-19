# Deployment Guide

This project uses a **split deployment model**:
- **Frontend**: GitHub Pages (static)
- **Backend API**: Vercel (serverless)

## Architecture Overview

```
User Browser (GitHub Pages)
    ↓
Frontend (HTML/CSS/JS)
    ↓ (CORS-enabled fetch)
Vercel API Function
    ↓
OpenAI API
    ↓
Screenplay returned
```

---

## Frontend Deployment: GitHub Pages

### Setup (One-time)

1. **Ensure GitHub repo exists** with this code
2. Go to repo **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` / `/ (root)`
4. Click **Save**

### How It Works

- Workflow file: `.github/workflows/deploy.yml`
- Triggers on every push to `main`
- Runs `npm run build` → creates `dist/`
- Pushes to `gh-pages` branch
- GitHub Pages serves from `gh-pages`

### Site URL

```
https://lokioatmeal.github.io/very-dramatic-screenplays/
```

### Troubleshooting Frontend Deployment

**Action fails to build:**
- Check terminal output: `npm run build` locally
- Ensure `tsconfig.json` is correct
- Verify all dependencies are in `package.json`

**Pages not updating:**
- Check **Actions** tab for failed workflows
- Verify repo is public (or private with Pages enabled)
- Wait 1-2 min after push for deployment

---

## Backend Deployment: Vercel

### Setup (One-time)

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Select this GitHub repo
4. Click **"Import"**

### Add Environment Variables

1. After import, click **"Settings"** → **"Environment Variables"**
2. Add:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI key (starts with `sk-proj-`)
   - **Environments:** Production
3. Click **"Save"**

**Vercel auto-redeploys** when env vars are added.

### API Endpoint

Your function is available at:
```
https://very-dramatic-screenplays.vercel.app/api/generate
```

(Domain varies; check Vercel dashboard for your URL)

### Troubleshooting Vercel Deployment

**"Cannot find module 'openai'" or "@vercel/node"**
- Ensure `package.json` and `package-lock.json` are committed
- Re-run build locally: `npm run build`
- Trigger redeploy in Vercel → Deployments → Redeploy

**"Invalid API key" from OpenAI**
- Verify the key in Vercel Environment Variables
- Check it starts with `sk-proj-`
- No extra spaces or quotes

**CORS errors from frontend**
- API function must have CORS headers (it does in `api/generate.ts`)
- If errors persist, check Vercel function logs:
  - Deployments → Click latest → Functions → api/generate → Logs

**API returns 500 error**
- Check Vercel function logs for error stack
- Ensure OpenAI key is valid and has quota
- Verify request body matches expected schema

### Manual Redeploy

If automatic deployment doesn't work:

1. Go to https://vercel.com/dashboard
2. Click your project
3. **Deployments** tab
4. Find a previous deployment
5. Click **"..."** → **"Redeploy"**

---

## Testing Locally

### Start Dev Server

```bash
npm run dev
```

Runs on `http://localhost:5173`. Frontend calls:
- In production: `https://very-dramatic-screenplays.vercel.app/api/generate`
- In dev: Falls back to localhost (requires local API or error)

### Disable API Calls Temporarily

To test UI without Vercel:

In `src/api.ts`, temporarily replace the API URL:

```typescript
const apiBase = 'http://localhost:3001'; // Vercel API
```

### Full Local Setup (Optional)

If you want to run both frontend and API locally before deploying:

1. Keep dev server running: `npm run dev`
2. Install Vercel CLI: `npm install -g vercel`
3. Run: `vercel dev`
4. This starts API at `http://localhost:3001`
5. Frontend will auto-call localhost API

---

## Monitoring & Maintenance

### Check Deployment Status

**GitHub Pages:**
- Repo → **Actions** tab → see latest workflow

**Vercel:**
- https://vercel.com/dashboard
- **Deployments** tab shows history and status

### View Logs

**GitHub Actions:**
- Click workflow → see full build output

**Vercel Functions:**
- Deployments → Click deployment → Functions → Click function → Logs

---

## Updating Code

1. **Make changes locally**
2. **Test locally:**
   ```bash
   npm run dev
   npm run build
   ```
3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Description"
   git push origin main
   ```
4. **Automatic deployments trigger:**
   - GitHub Actions → builds and deploys frontend to gh-pages
   - Vercel → auto-deploys API (no action needed)

---

## Domain Setup (Optional)

To use a custom domain (e.g., screenplay.example.com):

**GitHub Pages:**
- Repo Settings → Pages → Custom domain → Enter domain
- Update DNS CNAME to point to GitHub Pages

**Vercel:**
- Vercel project → Settings → Domains → Add domain
- Update DNS records as instructed

---

## Common Gotchas

- **API key exposed in frontend code** ✗ Never. Only Vercel has the key.
- **Building locally requires `npm install`** ✓ Always run after cloning.
- **CORS issues** → Check `api/generate.ts` has `res.setHeader('Access-Control-Allow-Origin', '*')`
- **GitHub Actions can't push to gh-pages** → Verify workflow has `permissions: contents: write`
- **Frontend can't call API** → Check `src/api.ts` for correct Vercel URL

