# Øditr Waitlist

**Øditr** — pronounced **Auditor** — is a web intelligence and website audit platform being built for developers, founders, freelancers, and agencies.

Øditr helps teams understand what is slowing down, breaking, or weakening a website — and turns those technical problems into clear, prioritized, business-focused recommendations.

> Website intelligence for modern teams.
> Find what is broken. Fix what matters. Protect revenue.

---

## What is Øditr?

Most website audit tools show scores.

Øditr is being built to go further.

Instead of only telling users that a page has a low performance score, missing SEO tags, accessibility issues, broken links, or poor Core Web Vitals, Øditr explains:

* what the issue is
* why it matters
* how serious it is
* what should be fixed first
* how it may affect conversions, trust, leads, and revenue

The goal is to make website audits easier to understand for founders and agencies, while still being useful and actionable for developers.

---

## Why Øditr Exists

Websites silently lose users every day because of issues most teams do not notice quickly enough.

A slow page, broken link, missing mobile optimization, poor accessibility, weak SEO structure, or insecure configuration can directly affect user trust and business performance.

Existing tools often provide technical reports, but they rarely explain the business impact clearly.

Øditr is being designed to connect technical website health with business outcomes.

---

## Current Project Status

This repository currently contains the **Øditr pre-launch waitlist system**.

The waitlist site is live/prepared for early users while the full Øditr web intelligence platform is being built.

Current repo focus:

* landing page
* waitlist signup
* email storage
* referral-based priority
* live waitlist counter
* backend API
* MongoDB storage
* future launch invitation readiness

---

## Current Features

### Landing Page

* Premium minimal black/white design
* Animated hero section
* Smooth page transitions
* Floating navigation
* Product positioning sections
* Future capability cards
* FAQ section
* Social links
* Contact link to `hello.oditr@gmail.com`

### Waitlist System

* User email signup
* Email validation
* Duplicate signup handling
* MongoDB-based storage
* Unique referral code generation
* Referral tracking
* Waitlist position calculation
* Live users-waiting counter
* Launch invitation fields stored for future use

### Referral Priority

Waitlist priority is calculated using:

1. Higher referral count first
2. Earlier signup time for users with the same referral count
3. Display baseline added to the visible count and position

This allows early users and users who refer others to receive higher launch access priority.

### Email Behavior

For now, the system only stores user emails.

No confirmation email is sent immediately after signup.

This is intentional.

Stored users can be prioritized later for launch invitation emails.

---

## Planned Øditr Platform Features

The full Øditr platform is planned to include:

### Website Audits

* Performance audit
* Core Web Vitals analysis
* SEO checks
* Accessibility checks
* Mobile responsiveness checks
* HTTPS and security checks
* Broken link detection
* Image optimization checks
* CSS and JavaScript efficiency checks
* Metadata and heading structure checks

### Revenue Impact Engine

Øditr’s key planned feature is the **Revenue Impact Engine**.

It will help explain how website issues may affect:

* conversions
* user trust
* bounce rate
* leads
* sales friction
* customer experience
* business performance

The goal is not to make exaggerated revenue claims, but to help teams understand which technical problems may have the highest business impact.

### Intelligent Prioritization Engine

Øditr will rank issues based on:

* severity
* user impact
* fix effort
* business value
* technical urgency

This helps users understand what to fix first instead of getting overwhelmed by long audit reports.

### AI Audit Copilot

The planned AI Audit Copilot will help users ask questions such as:

* Why does this issue matter?
* What caused this problem?
* How do I fix it?
* Which issue should I fix first?
* How does this affect users or revenue?

### Agency and Client Features

Future agency-focused features may include:

* client-ready audit reports
* exportable reports
* protected advanced reports
* audit history
* scheduled scans
* regression detection
* agency workspaces
* team access
* framework-aware recommendations

---

## Tech Stack

### Frontend

* React
* Create React App
* CRACO
* Tailwind CSS
* Framer Motion
* React Router
* Axios
* Lucide React
* Lenis smooth scrolling

### Backend

* FastAPI
* Python
* Motor async MongoDB driver
* MongoDB Atlas or compatible MongoDB database
* Pydantic validation
* CORS middleware

---

## Repository Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── pages/
│   │   │   └── Landing.jsx
│   │   └── components/
│   ├── package.json
│   └── package-lock.json
│
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── __init__.py
│
└── README.md
```

---

## Environment Variables

### Frontend

Create `frontend/.env` for local development:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

For production on Vercel, add this environment variable in the Vercel dashboard:

```env
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
```

The frontend uses this value to communicate with the backend API.

---

### Backend

Create `backend/.env`:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=oditr_waitlist
WAITLIST_BASELINE=13
CORS_ORIGINS=http://localhost:3000,https://your-vercel-domain.vercel.app
```

Environment details:

* `MONGO_URL` — MongoDB connection string
* `DB_NAME` — database name
* `WAITLIST_BASELINE` — optional visible counter baseline
* `CORS_ORIGINS` — allowed frontend origins

---

## Running Locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at:

```text
http://localhost:8000/api
```

---

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

---

## Build Frontend

```bash
cd frontend
npm install
npm run build
```

---

## Deployment

Recommended deployment setup:

```text
Frontend  → Vercel
Backend   → Render or Railway
Database  → MongoDB Atlas
```

### Vercel Frontend Settings

```text
Root Directory: frontend
Install Command: npm install
Build Command: npm run build
Output Directory: build
```

Also keep this disabled if available:

```text
Include source files outside of the Root Directory in the Build Step = OFF
```

The FastAPI backend should not be deployed on Vercel in this setup.

---

### Backend Deployment

Deploy the backend separately on Render or Railway.

Typical backend start command:

```bash
uvicorn server:app --host 0.0.0.0 --port $PORT
```

After backend deployment, copy the backend URL and add it to Vercel:

```env
REACT_APP_BACKEND_URL=https://your-backend-url
```

Then redeploy the frontend.

---

## API Endpoints

All backend routes are prefixed with `/api`.

### Health Check

```http
GET /api/
```

Returns API status.

---

### Join Waitlist

```http
POST /api/waitlist
```

Request body:

```json
{
  "email": "user@example.com",
  "ref": "optional_referral_code"
}
```

Returns waitlist status, referral code, position, and total count.

---

### Waitlist Count

```http
GET /api/waitlist/count
```

Example response:

```json
{
  "count": 14
}
```

---

### Check Waitlist by Referral Code

```http
GET /api/waitlist/code/{code}
```

Returns waitlist details for a referral code.

---

## Data Stored for Each Waitlist User

The backend stores data such as:

* email
* unique user ID
* referral code
* referral count
* referred by
* joined timestamp
* launch invitation status
* confirmation email skipped status

No confirmation email is currently sent at signup.

---

## Important Notes

* Vercel Analytics was removed because it caused runtime/deployment conflicts in this setup.
* Do not re-add `@vercel/analytics` until the frontend and deployment are stable.
* The frontend should use an external backend URL through `REACT_APP_BACKEND_URL`.
* The live waitlist counter depends on the backend being deployed and reachable.
* The full website audit platform is planned; this repo currently powers the waitlist and product landing experience.

---

## Troubleshooting

### Waitlist counter stays at 0

Check:

* backend is deployed and running
* MongoDB is connected
* `REACT_APP_BACKEND_URL` is set correctly in Vercel
* frontend was redeployed after adding the environment variable
* backend CORS allows the Vercel domain
* `/api/waitlist/count` returns a valid response

### Vercel detects the backend

Check:

* Vercel Root Directory is set to `frontend`
* source files outside the root are not included in build
* root `pyproject.toml` is not present unless intentionally deploying backend on Vercel
* root `.python-version` is not present unless intentionally deploying backend on Vercel

### Analytics runtime error

Make sure these are not present:

```text
@vercel/analytics
<Analytics />
inject()
```

---

## Git Workflow

Recommended workflow:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-change

git add .
git commit -m "feat: describe change"
git push origin feature/your-change
```

Then open a pull request into `main`.

---

## Contact

For project or early access queries:

```text
hello.oditr@gmail.com
```

---

## Status

Øditr is currently in pre-launch.

The waitlist is open while the full web intelligence and website audit platform is being built.
