from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_score(resume_text, job_description):
    if not resume_text or not job_description:
        return 0.0

    documents = [resume_text, job_description]
    
    # Using TF-IDF to vectorize the text
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    # Calculate Cosine Similarity
    similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    
    return float(similarity_matrix[0][0])

def calculate_weighted_score(base_score, extracted_skills, required_skills):
    if not required_skills:
        return base_score

    # Convert extracted_skills to a set for efficient lookup
    extracted_skills_set = set(s.lower() for s in extracted_skills)

    total_weight = 0
    matched_weight = 0

    for req_skill_obj in required_skills:
        skill_name = req_skill_obj.get("skillName", "").lower()
        weight = req_skill_obj.get("weight", 1) # Default weight of 1 if not specified
        total_weight += weight
        if skill_name in extracted_skills_set:
            matched_weight += weight
    
    skill_score = matched_weight / total_weight if total_weight > 0 else 0

    # Combined score: 70% semantic similarity + 30% exact skill match
    final_score = (base_score * 0.7) + (skill_score * 0.3)
    
    return round(final_score, 2)
