from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os
import uvicorn

app = FastAPI(title="Passion to Paycheck API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and feature names
model = None
feature_names = None

def load_resources():
    global model, feature_names
    try:
        model = joblib.load("model.joblib")
        feature_names = joblib.load("feature_names.joblib")
        print("Model and features loaded successfully.")
    except Exception as e:
        print(f"Warning: Could not load model. Error: {e}")

@app.on_event("startup")
async def startup_event():
    load_resources()

@app.get("/")
async def root():
    return {"message": "Passion to Paycheck API is running. Visit /docs for the interactive API documentation."}

class PredictionRequest(BaseModel):
    # Core features collected from the frontend Wizard
    Age: int
    Formal_Academic_Score_Normalized: float
    Months_Formal_Experience: int
    Months_Gig_Or_Freelance_Experience: int
    Logical_Reasoning_Score: int
    Communication_Fluency_Score: int
    Basic_Software_Proficiency: int
    Advanced_Software_Proficiency: int
    Generative_AI_Familiarity: int

@app.post("/predict")
async def predict(request: PredictionRequest):
    if model is None or feature_names is None:
        raise HTTPException(status_code=503, detail="Model is not loaded. Please train the model first.")

    # Create a dictionary with default values for ALL features the model expects
    # (In a production scenario, you would determine realistic medians from the dataset)
    input_dict = {
        'Age': request.Age,
        'Home_City_Tier': 2,
        'Willingness_To_Relocate': 1,
        'Preferred_Work_Model': 1,
        'Bilingual_Proficiency': 1,
        'Highest_Education_Level': 2,
        'Institution_Tier': 2,
        'Formal_Academic_Score_Normalized': request.Formal_Academic_Score_Normalized,
        'Self_Taught_Indicator': 0,
        'Active_Certifications_Count': 1,
        'Competitive_Event_Experience': 0,
        'Months_Formal_Experience': request.Months_Formal_Experience,
        'Months_Gig_Or_Freelance_Experience': request.Months_Gig_Or_Freelance_Experience,
        'Number_Of_Completed_Projects': 3,
        'Has_Public_Portfolio': 1,
        'Leadership_Role_Experience': 0,
        'Client_Facing_Experience': 0,
        'Communication_Fluency_Score': request.Communication_Fluency_Score,
        'Logical_Reasoning_Score': request.Logical_Reasoning_Score,
        'Adaptability_To_New_Tech': 7,
        'Crisis_Management_Score': 6,
        'Team_Collaboration_Score': 7,
        'Negotiation_Skill_Level': 2,
        'Basic_Software_Proficiency': request.Basic_Software_Proficiency,
        'Advanced_Software_Proficiency': request.Advanced_Software_Proficiency,
        'Generative_AI_Familiarity': request.Generative_AI_Familiarity,
        'Social_Media_Leverage_Score': 5,
        'Available_Hours_Per_Week': 40,
        'Risk_Tolerance_Profile': 1,
        'Physical_Stamina_Requirement': 0,
        'Mapped_Target_Industry': 'Tech & AI', # Default categorical
        'Equivalent_Job_Role': 'Data Analyst', # Default categorical
        'Employability_Tier': 1 # Required feature that was missing
    }

    # Construct the final DataFrame ensuring columns match exactly what the model expects
    try:
        # Only take features that were actually in the training set
        df_input = pd.DataFrame([input_dict])
        df_input = df_input[feature_names] 
        
        prediction = model.predict(df_input)
        
        # Ensure it doesn't return negative salaries
        lpa = max(0.5, float(prediction[0]))
        return {"predicted_lpa": round(lpa, 2)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
