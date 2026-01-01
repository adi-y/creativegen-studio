# CreativeGen Studio

Monorepo for AI-powered ad creative builder.

## Structure

- `frontend/` — Next.js + Fabric.js UI
- `backend/` — FastAPI microservices (upload, background removal, layout, compliance)

## How to Run

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt

# Run AI Layout API
uvicorn ai_layout_api:app --reload --port 8000

# Run Background Removal API (in another terminal)
uvicorn background_removal_api:app --reload --port 8001
```

## Setup

### Groq API Configuration

1. Go to [Groq Console](https://console.groq.com/home)
2. Create account → **API Keys** → **Create Key**
3. Create `backend/.env` file:
```bash
   GROQ_API_KEY=your_api_key_here
```



## Tech Stack

- **Frontend:** Next.js, React, Fabric.js, TailwindCSS
- **Backend:** FastAPI, Python, Groq API (OpenAI gpt-oss-120b), Background Removal AI: rembg (U²-Net ONNX)
- **APIs:** AI Layout Generation, Background Removal, Compliance Scanning
