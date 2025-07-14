
# Leads Creator App

A web application to scrape and download leads using the Apollo API via RapidAPI.

---

## 📦 Project Structure

```
/client   # React frontend using Vite
/server   # Node.js/Express backend API exposing /leads endpoint
```

---

## 🚀 Function Overview

1. **Frontend (React/Vite):**
   - UI for entering search parameters like keywords, location, industry, etc.
   - Displays retrieved leads in a table with sorting, expandable rows, and download options (CSV, Excel).
   - Hosted on Netlify or similar.

2. **Backend (Express API):**
   - Exposes `/leads` endpoint.
   - Integrates with Apollo API via RapidAPI using a secured API key.
   - Must be deployed separately (e.g., Render, Railway).

---

## 🔧 Configuration

### Environment Variables

For the **frontend (`client/.env.production`)**:
```
VITE_API_BASE_URL=https://your-backend-api-url.com
```

For the **backend (`server/.env`)**:
```
APOLLO_API_KEY=your-rapidapi-key
PORT=5000
```

### Netlify Specific
- **Build Command:** `npm run build`
- **Publish Directory:** `client/dist`
- Add a `_redirects` file in `client/public/`:
```
/*    /index.html   200
```

---

## 🚀 Deployment Guide

### Backend API Deployment
Deploy the **Express server** from `/server` to:
- [Render](https://render.com/)
- [Railway](https://railway.app/)

Make sure to:
- Set the environment variables (e.g., `APOLLO_API_KEY`).
- Expose the API publicly to be consumed by the frontend.

### Frontend Deployment
Deploy the **React frontend** to:
- [Netlify](https://netlify.com/)
- [Vercel](https://vercel.com/)

Ensure the frontend `.env.production` points to the deployed backend API.

---

## ✅ Requirements

- Node.js >= 16.x
- npm >= 8.x

---

## 🧩 Next Steps

1. Clone repo.
2. Configure `.env` and `.env.production` as needed.
3. Deploy backend API.
4. Deploy frontend, ensure API endpoint is reachable.

---

## 🛡️ License

[MIT](LICENSE.md)
