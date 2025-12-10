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
uvicorn app.main:app --reload
