# Navi Mumbai House Price Prediction System

A full-stack machine learning application to predict house prices in Navi Mumbai based on historical market data (2500+ transactions).

## Tech Stack
- **ML Engine**: Python, XGBoost, Scikit-Learn
- **Backend API**: FastAPI, Pydantic, Joblib
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion, Axios
- **Deployment**: Render (Backend), Vercel (Frontend)

## Project Structure
```
├── backend/            # FastAPI Backend
│   ├── app/            # Application Logic
│   │   ├── main.py     # API Entry count
│   │   ├── models/     # Pydantic Schemas
│   │   │   └── files/  # Trained Model Artifacts
│   │   └── services/   # Prediction Services
│   ├── Dockerfile      # Backend Containerization
│   └── render.yaml     # Render Deployment Config
├── frontend/           # Next.js Frontend
│   ├── app/            # App Router Pages
│   ├── components/     # UI Components
│   └── lib/            # Utility Functions
├── ml/                 # Machine Learning Workflows
│   └── train.py        # Model Training Script
├── requirements.txt    # Base Python Dependencies
└── navi_mumbai_real_estate_cleaned_2500_cleaned.csv # Dataset
```

## Setup Instructions

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- npm

### 2. Installation

**Backend Setup:**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run model training (optional if artifacts exist)
python ml/train.py
```

**Frontend Setup:**
```bash
cd frontend
npm install
cd ..
```

### 3. Running the Application

You can start both the frontend and backend servers simultaneously from the project root directory using the unified start command:
```bash
npm start
```

Alternatively, you can start them individually from the root directory:
```bash
# Start backend server only
npm run start:backend

# Start frontend server only
npm run start:frontend
```

The application will be available at `http://localhost:3000` and the API at `http://localhost:8000`.

## Model Performance
- **Algorithm**: XGBoost Regressor
- **R2 Score**: 0.8664
- **Features handled**: Location, BHK, Area, Bathrooms, Floor, Age, Parking, Lift.

## Deployment
- **Backend**: Can be deployed on Render using the provided `render.yaml` or `Dockerfile`.
- **Frontend**: Optimized for Vercel. Set `NEXT_PUBLIC_API_URL` environment variable to point to your backend.