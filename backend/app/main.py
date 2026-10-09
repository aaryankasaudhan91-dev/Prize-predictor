import logging
import math

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models.schemas import PredictionRequest, PredictionResponse, LocationList
from .services.prediction import prediction_service

app = FastAPI(
    title="Navi Mumbai House Price Predictor",
    description="API for predicting house prices in Navi Mumbai based on property features.",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific originsgit 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Navi Mumbai House Price Prediction API"}

@app.get("/health")
def health():
    return {"status": "ready"}

@app.post("/predict", response_model=PredictionResponse)
def predict_price(request: PredictionRequest):
    if request.location not in prediction_service.get_locations():
        raise HTTPException(status_code=422, detail="Unsupported location")
    try:
        price = prediction_service.predict(request)
        if not math.isfinite(price) or price <= 0:
            raise ValueError("Invalid model estimate")
        return PredictionResponse(predicted_price=price)
    except Exception:
        logging.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="Unable to generate estimate")

@app.get("/locations", response_model=LocationList)
async def get_locations():
    return LocationList(locations=prediction_service.get_locations())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
