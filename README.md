# Chitkara Full Stack Engineering Challenge - Submission

A complete, production-ready solution to parse relationship graphs, validate format rules, filter duplicate/multi-parent edges, partition trees, detect cycles, and render results on an elegant glassmorphism web interface.

## Tech Stack
- **Backend:** Node.js + Express
- **Frontend:** React + Vite
- **Language:** JavaScript
- **Styling:** Vanilla Modern CSS
- **APIs & Protocols:** Native Fetch API & CORS enabled

---

## Directory Structure
```
/
 ├── backend/
 │     ├── routes/            # Express route mapping
 │     ├── controllers/       # Route request handlers
 │     ├── utils/             # Graph helper logic (parsing, cycle detection, trees)
 │     ├── config.js          # Load student identity from .env
 │     ├── server.js          # Server entry point
 │     └── package.json
 │
 ├── frontend/
 │     ├── src/
 │     │    ├── css/
 │     │    │    └── App.css   # Modern dashboard & tree visualizer styles
 │     │    ├── App.jsx        # Main component & tree rendering
 │     │    └── main.jsx
 │     ├── index.html
 │     └── package.json
 │
 ├── test.js                  # Automated test runner with 16 test cases
 ├── .env                     # Configuration file for identity fields
 └── README.md                # Root instructions (this file)
```

---

## Setup & Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Configuration
Open `.env` in the root folder. It contains student identity keys that the backend loads:
```env
USER_ID=tushar_2310991231
EMAIL_ID=tushar1231.be23@chitkara.edu.in
COLLEGE_ROLL_NUMBER=2310991231
PORT=3000
```

### 2. Run Backend Server
From the project root, open a terminal:
```bash
cd backend
npm install
npm start
```
The server will boot up and listen on port `3000`.

### 3. Run Frontend App
Open a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to view the application.

---

## Automated Verification
To run the automated tests against your local backend, make sure the backend server is running (`npm start` inside `/backend`), and run:
```bash
node test.js
```
This runs 16 test cases covering duplicate edges, multiple trees, pure cycles, cycle with root, invalid formats, self loops, whitespace trimming, tie-breaking root logic, and mixed valid/invalid inputs.

---

## Deployment Instructions

### Backend Deployment (e.g., Render)
1. Sign in to [Render](https://render.com/).
2. Create a new **Web Service** and link your GitHub repository.
3. Configure the following settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. In the **Environment Variables** tab, add:
   - `USER_ID`
   - `EMAIL_ID`
   - `COLLEGE_ROLL_NUMBER`
   - `PORT=10000` (or leave empty for Render default)
5. Deploy the service.

### Frontend Deployment (e.g., Vercel)
1. Sign in to [Vercel](https://vercel.com/).
2. Click **New Project** and import your repository.
3. Configure the project settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In the **Environment Variables** section, add:
   - `VITE_API_URL` (set to your Render backend web service URL, e.g., `https://your-app.onrender.com`)
5. Click **Deploy**.
