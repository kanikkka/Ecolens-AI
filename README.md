# 🌱 EcoLens AI — Scan. Understand. Act. Earn. Impact.

An AI-powered Environmental Intelligence & Action Verification Platform built for **Smart India Hackathon (SIH)** and national sustainability competitions.

## ✨ Core Features Implemented (Full-Stack MVP)
1. **AI Product & Waste Scanner**: Upload an image or test live demo items (1L PET Bottle, Li-Ion Battery Pack, Multi-Layer Chips Packet, Expired Biscuits) with CV/OCR extraction & confidence scores.
2. **"What You Overlooked?" Engine**: Ranks the top 3–4 critical risks/alerts (expiry, allergens, e-waste fire hazard, resin code rules).
3. **Material & Resin Intelligence**: Explains plastic codes (#1–#7) with local recyclability realities (anti-greenwashing).
4. **10-Second Waste Recipe**: Reuse → Repair → Recycle → Recover → Safe Disposal hierarchy with safety guardrails.
5. **Local Destination Finder**: Verified recyclers, CPCB e-waste hubs, local Kabadiwalas, and municipal MRFs.
6. **QR Verification & Disposal Passport**: Step-by-step item lifecycle (`Identified` → `Verified`) with instant QR check-in to earn **Green Credits**.
7. **My Impact & Government Missions**: Tracks CO₂ saved, plastic diverted, Family Green Score, and live Swachh Bharat / Mission LiFE campaigns.
8. **Government & City Intelligence Dashboard**: Aggregated city-level analytics and unmet collection infrastructure alerts.

---

## 🚀 How to Run Locally (Windows PowerShell)

### Step 1: Start the Backend (FastAPI)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API & Swagger Docs will run at: `http://localhost:8000/docs`

### Step 2: Start the Frontend (React + Vite)
Open a **second PowerShell terminal**:
```powershell
cd frontend
npm install
npm run dev
```
Frontend App will run at: `http://localhost:5173`
