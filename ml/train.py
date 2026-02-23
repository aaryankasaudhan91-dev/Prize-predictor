import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import os

def train_model():
    # Load dataset
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_path, 'navi_mumbai_real_estate_cleaned_2500_cleaned.csv')
    df = pd.read_csv(data_path)
    
    # 1. Cleaning
    # Remove rows with negative values in area or price
    df = df[(df['area_sqft'] > 0) & (df['actual_price'] > 0)]
    
    # BHK can have weird floats in the uncleaned version, but this is the 'cleaned' one.
    # Looking at the data preview, some BHKs are floats like 2.458591. We should round them.
    df['bhk'] = df['bhk'].apply(lambda x: round(x))
    df['bathrooms'] = df['bathrooms'].apply(lambda x: round(x))
    
    # Handle floors similarly
    df['floor'] = df['floor'].apply(lambda x: round(x))
    df['total_floors'] = df['total_floors'].apply(lambda x: round(x))
    
    # Define features and target
    X = df.drop(columns=['actual_price'])
    y = df['actual_price']
    
    # Separate categorical and numerical columns
    categorical_cols = ['location']
    numerical_cols = ['area_sqft', 'bhk', 'bathrooms', 'floor', 'total_floors', 'age_of_property', 'parking', 'lift']
    
    # 2. Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
        ])
    
    # 3. Model Pipeline
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', XGBRegressor(n_estimators=1000, learning_rate=0.05, max_depth=6, random_state=42))
    ])
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train
    print("Training model...")
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Mean Absolute Error: {mae:,.2f}")
    print(f"R2 Score: {r2:.4f}")
    
    # Save model and artifacts
    model_dir = os.path.join(base_path, 'backend', 'app', 'models', 'files')
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, os.path.join(model_dir, 'house_price_model.joblib'))
    
    # Save a list of available locations for the frontend/api validation
    locations = sorted(df['location'].unique().tolist())
    joblib.dump(locations, os.path.join(model_dir, 'locations.joblib'))
    
    print("Model and artifacts saved successfully.")

if __name__ == "__main__":
    train_model()
