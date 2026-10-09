from pydantic import BaseModel, Field, model_validator
from typing import List

class PredictionRequest(BaseModel):
    location: str = Field(..., min_length=1, description="Locality in Navi Mumbai")
    area_sqft: float = Field(..., gt=0, allow_inf_nan=False, description="Area in square feet")
    bhk: int = Field(..., gt=0, description="Number of bedrooms")
    bathrooms: int = Field(..., gt=0, description="Number of bathrooms")
    floor: int = Field(..., ge=0, description="Floor number")
    total_floors: int = Field(..., gt=0, description="Total floors in building")
    age_of_property: float = Field(..., ge=0, allow_inf_nan=False, description="Age of the property in years")
    parking: int = Field(..., ge=0, le=1, description="Parking availability (0 or 1)")
    lift: int = Field(..., ge=0, le=1, description="Lift availability (0 or 1)")

    @model_validator(mode="after")
    def validate_building(self):
        if self.floor > self.total_floors:
            raise ValueError("Floor cannot exceed total floors")
        return self

class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., gt=0, allow_inf_nan=False, description="Predicted house price in INR")
    currency: str = "INR"

class LocationList(BaseModel):
    locations: List[str]
