import unittest
from unittest.mock import patch
from fastapi import HTTPException
from pydantic import ValidationError
from backend.app.models.schemas import PredictionRequest
from backend.app.main import health, predict_price, prediction_service

class ValidationTests(unittest.TestCase):
    def request(self, **changes):
        data = dict(location=prediction_service.get_locations()[0], area_sqft=1000, bhk=2, bathrooms=2, floor=5, total_floors=10, age_of_property=5, parking=1, lift=1)
        return PredictionRequest(**(data | changes))
    def test_invalid_inputs(self):
        for data in [dict(floor=11), dict(floor=-1), dict(area_sqft=0), dict(area_sqft=float('nan')), dict(age_of_property=float('inf')), dict(parking=2), dict(location='')]:
            with self.subTest(data=data), self.assertRaises(ValidationError): self.request(**data)
    def test_unknown_location(self):
        with self.assertRaises(HTTPException) as caught: predict_price(self.request(location='unsupported'))
        self.assertEqual(caught.exception.status_code, 422)
    def test_real_prediction(self):
        self.assertGreater(predict_price(self.request()).predicted_price, 0)
        self.assertEqual(health(), {'status': 'ready'})
    def test_nonfinite_prediction(self):
        with patch.object(prediction_service, 'predict', return_value=float('nan')):
            with self.assertRaises(HTTPException) as caught: predict_price(self.request())
            self.assertEqual(caught.exception.status_code, 500)
            self.assertEqual(caught.exception.detail, 'Unable to generate estimate')

if __name__ == '__main__': unittest.main()
