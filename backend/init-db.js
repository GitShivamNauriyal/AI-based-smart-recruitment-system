const pool = require("./src/config/db")

const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) CHECK (role IN ('candidate', 'recruiter')) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS job_postings (
                job_id SERIAL PRIMARY KEY,
                recruiter_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                required_skills JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS applications (
                app_id SERIAL PRIMARY KEY,
                job_id INTEGER REFERENCES job_postings(job_id) ON DELETE CASCADE,
                candidate_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
                resume_path VARCHAR(255) NOT NULL,
                match_score FLOAT,
                extracted_skills JSONB,
                experience INTEGER,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)
        console.log("Database tables initialized successfully")
        process.exit(0)
    } catch (err) {
        console.error("Error initializing database:", err)
        process.exit(1)
    }
}

initDb()
