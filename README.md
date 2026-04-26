# 🚀 SmartRecruit AI (Smart Recruitment System)

SmartRecruit AI is a next-generation applicant tracking and AI-scoring platform built for 2027. It streamlines the hiring process by allowing recruiters to deploy job postings with weighted skill requirements, while an advanced Python-based NLP engine automatically parses candidate resumes (PDFs) and scores them against the job description using Cosine Similarity and skill matching.

---

## ✨ Key Features

### 🏢 For Recruiters (Command Center)

- **Smart Job Deployment:** Post job descriptions and assign custom AI weightage (1-10) to required skills.
- **Automated AI Shortlisting:** Instantly view candidates ranked dynamically based on semantic resume matching.
- **Secure Dossier Management:** Download candidate resumes safely forced as `.pdf` attachments.
- **Pipeline Control:** Delete job postings and cascade-delete all associated applications seamlessly.

### 🧑‍💻 For Candidates (Job Portal)

- **Seamless Application:** Browse active deployments and apply with a single PDF upload.
- **Real-Time Pipeline Tracking:** View application history with dynamic, color-coded AI match scores.
- **Instant Synchronization:** Auto-routing and session management for a frictionless experience.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 (Vite), Tailwind CSS v4, React Router, Context API (JWT Auth). Features a custom Neumorphic/Glassmorphism design.
- **Backend API:** Node.js, Express.js, `express-validator`, `multer` (File handling).
- **Database:** PostgreSQL (Relational mapping + `JSONB` for unstructured extracted skills).
- **AI Microservice:** Python, FastAPI, SpaCy (NLP), Scikit-Learn (TF-IDF/Cosine Similarity), PyMuPDF (PDF Text Extraction).

---

## ⚙️ Prerequisites

Before running the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Python](https://www.python.org/downloads/) (v3.10+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (Running locally on port `5432`)

---

## 🚀 How to Run the Project Locally

The system requires three separate terminal instances to run simultaneously.

### 1. Database Setup

1. Open pgAdmin or `psql` and create a database named `smart_recruitment`.
2. Navigate to the backend folder and run the initialization script to create your tables:

```bash
cd backend
node init-db.js
```

### 2. Configure Environment Variables

Inside the `backend/` directory, create a `.env` file with the following credentials:

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_recruitment
JWT_SECRET=super_secret_key_change_in_production
```

### 3. Start the Node.js Backend (Terminal 1)

This server handles database connections, JWT authentication, and routing.

```bash
cd backend
npm install
npm run dev
```

_(The backend API will start on `http://localhost:5000`)_

### 4. Start the Python AI Engine (Terminal 2)

This microservice handles resume parsing and NLP scoring.

```bash
cd ai-service

# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# OR source venv/bin/activate # Mac/Linux

# Install dependencies (only needed once)
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Start the server
uvicorn app.main:app --reload --port 8000
```

_(The AI Microservice will start on `http://localhost:8000`)_

### 5. Start the React Frontend (Terminal 3)

```bash
cd frontend
npm install
npm run dev
```

_(The Frontend UI will start on `http://localhost:5173`)_

---

## 🛡️ Security & Sessions

- **JWT Expiration:** Sessions are cryptographically signed and set to expire strictly after 1 hour.
- **Auto-Interceptor:** The frontend actively monitors tokens. If a session expires, the user is instantly logged out without requiring a page reload.
- **File Validation:** The application strictly accepts and serves only `.pdf` files to prevent malicious payload execution.

---

## 📞 Developer

**Developed by:** Shivam Nauriyal  
**Contact:** [shivamnauriyal1224@gmail.com](mailto:shivamnauriyal1224@gmail.com)
