from fastapi import FastAPI, UploadFile, Form
import random

app = FastAPI()

@app.post("/process-resume")
async def process_resume(resume: UploadFile, jobDescription: str = Form(...)):
    # MOCK AI: In the future, SpaCy and Scikit-learn logic goes here!
    
    # Generate a random match score between 0.40 and 0.99
    mock_score = round(random.uniform(0.40, 0.99), 2)
    
    # Mock extracted skills
    mock_skills = ["React", "Python", "SQL", "Communication"]
    
    return {
        "score": mock_score,
        "extracted_skills": mock_skills
    }