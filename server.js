require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'WJ28@krhps',
  database: process.env.DB_NAME || 'project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to execute queries
async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// 1. Contact Form Endpoint (matches your contact_form table)
app.post('/api/contact_form', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    await query(
      'INSERT INTO contact_form (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );
    res.status(201).json({ message: 'Thank you for your message!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Work Request Endpoint (matches your user_submissions table)
app.post('/api/user_submissions', async (req, res) => {
  try {
    const { fullname, email, role, year, company, github, linkedin, message } = req.body;
    await query(
      `INSERT INTO user_submissions 
      (fullname, email, role, year, company, github, linkedin, message) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullname, email, role, year, company, github, linkedin, message]
    );
    res.status(201).json({ message: 'Thank you for your submission!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Projects Endpoints (matches your projects table)
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { project_name, project_type, technologies, description, github_link } = req.body;
    await query(
      `INSERT INTO projects 
      (project_name, project_type, technologies, description, github_link) 
      VALUES (?, ?, ?, ?, ?)`,
      [project_name, project_type, technologies, description, github_link]
    );
    res.status(201).json({ message: 'Project added successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});