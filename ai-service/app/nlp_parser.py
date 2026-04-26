import fitz  # PyMuPDF
from docx import Document
import spacy
import re

# Load spacy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # If not found, we'll have to rely on regex or basic tokenization
    # In a real environment, you'd run: python -m spacy download en_core_web_sm
    nlp = None

SKILLS_DB = [
    "python", "java", "javascript", "react", "node.js", "express", "mongodb",
    "mysql", "postgresql", "sql", "aws", "docker", "kubernetes", "machine learning",
    "deep learning", "nlp", "flask", "fastapi", "django", "html", "css", "typescript",
    "angular", "vue", "c++", "c#", "php", "ruby", "go", "rust", "swift", "kotlin"
]

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_skills(text):
    text = text.lower()
    extracted = []
    for skill in SKILLS_DB:
        # Use regex to find skill as a whole word
        if re.search(r'\b' + re.escape(skill) + r'\b', text):
            extracted.append(skill)
    return extracted

def extract_experience(text):
    # Very basic experience extraction logic
    # Looking for patterns like "X years of experience"
    match = re.search(r'(\d+)\s*(?:years?|yrs?)\s+(?:of\s+)?experience', text, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return 0

def parse_resume(file_path, extension):
    if extension.lower() == ".pdf":
        text = extract_text_from_pdf(file_path)
    elif extension.lower() in [".docx", ".doc"]:
        text = extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format")

    skills = extract_skills(text)
    experience = extract_experience(text)
    
    return {
        "text": text,
        "skills": skills,
        "experience": experience
    }
