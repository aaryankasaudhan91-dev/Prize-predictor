from pydantic import BaseModel, Field
from typing import List

class PredictionRequest(BaseModel):
    location: str = Field(..., description="Locality in Navi Mumbai")
    area_sqft: float = Field(..., gt=0, description="Area in square feet")
    bhk: int = Field(..., gt=0, description="Number of bedrooms")
    bathrooms: int = Field(..., gt=0, description="Number of bathrooms")
    floor: int = Field(..., ge=0, description="Floor number")
    total_floors: int = Field(..., gt=0, description="Total floors in building")
    age_of_property: float = Field(..., ge=0, description="Age of the property in years")
    parking: int = Field(..., ge=0, le=1, description="Parking availability (0 or 1)")
    lift: int = Field(..., ge=0, le=1, description="Lift availability (0 or 1)")

class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted house price in INR")
    currency: str = "INR"

class LocationList(BaseModel):
    locations: List[str]
