import joblib
import pandas as pd
import os
from ..models.schemas import PredictionRequest

class PredictionService:
    def __init__(self):
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_path, 'models', 'files', 'house_price_model.joblib')
        locations_path = os.path.join(base_path, 'models', 'files', 'locations.joblib')
        
        self.model = joblib.load(model_path)
        self.locations = joblib.load(locations_path)

    def predict(self, data: PredictionRequest) -> float:
        # Convert Pydantic model to DataFrame for the pipeline
        input_df = pd.DataFrame([data.dict()])
        
        # The pipeline handles scaling and one-hot encoding
        prediction = self.model.predict(input_df)
        return float(prediction[0])

    def get_locations(self):
        return self.locations

# Singleton instance
prediction_service = PredictionService()
