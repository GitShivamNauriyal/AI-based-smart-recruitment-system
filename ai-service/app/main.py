from fastapi import FastAPI, UploadFile, Form, File
import os
import shutil
from .nlp_parser import parse_resume
from .scorer import calculate_score, calculate_weighted_score
import json

app = FastAPI()

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/process-resume")
async def process_resume(
    resume: UploadFile = File(...), 
    jobDescription: str = Form(...),
    requiredSkills: str = Form("[]")
):
    try:
        # 1. Save file temporarily
        file_extension = os.path.splitext(resume.filename)[1]
        temp_file_path = os.path.join(UPLOAD_DIR, resume.filename)
        
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
        
        # 2. Parse resume
        parsed_data = parse_resume(temp_file_path, file_extension)
        
        # 3. Calculate match score
        base_score = calculate_score(parsed_data["text"], jobDescription)
        
        # Parse required skills if provided
        req_skills_list = json.loads(requiredSkills)
            
        final_score = calculate_weighted_score(base_score, parsed_data["skills"], req_skills_list)
        
        # 4. Cleanup
        os.remove(temp_file_path)
        
        return {
            "score": final_score,
            "extracted_skills": parsed_data["skills"],
            "experience": parsed_data["experience"]
        }
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
