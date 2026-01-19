# Deployment Guide: Screenplay Generator on Vercel

## Overview

This project uses a **Vercel serverless function** to safely handle OpenAI API calls. The frontend (Vite) is separate from the backend (API function).

## Prerequisites

- ✅ Vercel account (you have this)
- ✅ GitHub repository with this code pushed
- ✅ OpenAI API key

## Setup Steps

### 1. Connect Your GitHub Repo to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository (`screenplay`)
4. Click **"Import"**

### 2. Add Environment Variable

After importing, Vercel will show the **Project Settings**:

1. Go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** (paste your OpenAI API key starting with `sk-proj-...`)
3. Click **"Save"**

### 3. Deploy

Vercel will auto-deploy. Once complete, you'll get a URL like:
```
https://your-project-name.vercel.app
```

### 4. Verify the API Works

Test the API endpoint directly (it will show an error if successful, which is expected since we're not sending data):

```
https://your-project-name.vercel.app/api/generate
```

Should return: `405 - Method not allowed` (because we only accept POST)

## Update Your Frontend

Once deployed, your frontend needs to call the Vercel API. The code already handles this:

- **In production:** Uses `https://your-project-name.vercel.app/api/generate`
- **In development:** Uses `http://localhost:3001/api/generate` (requires local API server)

### For Local Testing

If you want to test with a local API server instead of Vercel's:

1. Install `@vercel/node`:
   ```bash
   npm install -D @vercel/node
   ```

2. Run the Vercel dev server:
   ```bash
   npx vercel dev
   ```
   This starts the API at `http://localhost:3001`

3. Run the Vite frontend in another terminal:
   ```bash
   npm run dev
   ```

## Troubleshooting

### "Invalid API key" or "Unauthorized"

- Check that your OpenAI API key is correct
- Verify it's set in Vercel **Environment Variables**
- Restart the deployment after adding the variable

### "Cannot find module 'openai'"

- Ensure `npm install openai` was run
- Commit `package-lock.json` to GitHub
- Trigger a new Vercel deployment

### Frontend gets "Failed to generate screenplay"

- Check browser console for error details
- Verify the Vercel API endpoint is correct
- Check Vercel's function logs for backend errors

## GitHub Pages Deployment (Frontend Only)

The Vite frontend can be deployed separately to GitHub Pages:

```bash
npm run build
# Then push to gh-pages branch or configure in GitHub Settings
```

---

**Summary:** Your architecture is now:
- **Frontend** → GitHub Pages (or anywhere static works)
- **API** → Vercel (handles OpenAI securely)
- **Domain** → Your existing DreamHost domain (via DNS)
