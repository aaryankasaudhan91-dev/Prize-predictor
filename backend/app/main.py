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

@app.post("/predict", response_model=PredictionResponse)
async def predict_price(request: PredictionRequest):
    try:
        price = prediction_service.predict(request)
        return PredictionResponse(predicted_price=price)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/locations", response_model=LocationList)
async def get_locations():
    return LocationList(locations=prediction_service.get_locations())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
