# CreativeGen Studio

Monorepo for AI-powered ad creative builder.

## Structure
- `frontend/` — Next.js + Fabric.js UI
- `backend/` — FastAPI microservices (upload, background removal, layout, compliance)

## How to Run

### Frontend
cd frontend  
npm install  
npm run dev  

### Backend
cd backend  
pip install -r requirements.txt  
uvicorn ai_layout_api:app --reload

### Steps to setup Groq API

1) Go to https://console.groq.com/home
2) Create account → API Keys → Create Key
3) Paste key into backend/.env

