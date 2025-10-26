# AOVTANMOD Shop (deploy-ready)

This is a simple e-commerce demo (Express backend + static frontend) prepared for deployment.
Backend saves orders to `data/orders.json`.

### Local run (recommended for testing)
1. Install Node.js (v16+ recommended).
2. In project root:
   ```
   npm install
   npm start
   ```
3. Open http://localhost:3000

### Deploy options

#### Option A — Render.com (recommended for Node server)
1. Push this repository to GitHub.
2. Create a Render account and connect your GitHub.
3. Create a new "Web Service", link the repo, and set the build command:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Render will give you a public URL (e.g. https://aovtanmod.onrender.com).

#### Option B — Railway / Fly / Heroku
Similar: push to GitHub, create service, set start command `npm start`.

#### Option C — Vercel (if you insist on Vercel)
Vercel is primarily for serverless / static apps. To run this Express server on Vercel you can:
- Use Docker on Vercel (paid features), or
- Convert Express endpoints to Vercel Serverless Functions under `/api` (extra work).
=> For simplicity, use Render or Railway for a full Node server.

### Notes
- Bank/payment instruction is set to **MBBank - 0845118872** as requested.
- Orders are stored in `data/orders.json`. You can open/export this file to view orders.
- If you want an admin page (list + delete orders) or Telegram automatic delivery of keys, tell me and I'll add it.

