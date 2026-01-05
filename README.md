## CreativeGen Studio

AI-powered ad creative builder — a platform that automates ad generation, letting marketers create professional designs in minutes instead of hours.

## HomePage
![Image](https://github.com/user-attachments/assets/378cbbf4-5519-4d28-9cab-76bc5d3843f0)

## Background Removal and Add Text
![Image](https://github.com/user-attachments/assets/8c98dcc7-639a-4dfe-af36-b87aaca8eb82)
![Image](https://github.com/user-attachments/assets/b2146cc5-f03e-4742-87ce-7279d157028e)
![Image](https://github.com/user-attachments/assets/868afe84-767b-45c4-bff4-c025f5f0278a)

## AI Layout Generator
![Image](https://github.com/user-attachments/assets/1a3b0aa5-d941-441b-885d-655ec1ab7f1d)
![Image](https://github.com/user-attachments/assets/7e4d4868-d655-42a5-8b97-aa1e18e3df42)

## Sample Output
![Image](https://github.com/user-attachments/assets/b16921ea-5fac-4b43-991e-d975f34bf24c)
![Image](https://github.com/user-attachments/assets/fcdc633f-3a77-4a9f-ac38-bb8f3f4ffa76)


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
