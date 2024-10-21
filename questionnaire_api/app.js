const express = require("express");
const mysql = require("mysql2/promise"); // For Promises support

const cors = require("cors"); // Import the cors package

const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "15052000",
  database: "questionnaire_db",
});

app.use(cors());

// Fetch the first question
app.get("/api/questions/:id", async (req, res) => {
  // Get the id from the URL
  try {
    const [rows] = await db.query("SELECT * FROM questions WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions" });
  }
});

// Add a new question to the database
app.post("/api/questions", async (req, res) => {
  const {
    question_text,
    question_type,
    options,
    next_question_yes,
    next_question_no,
    video_url,
    video_title,
  } = req.body;

  try {
    await db.query(
      "INSERT INTO questions (question_text, question_type, options, next_question_yes, next_question_no, video_url, video_title) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        question_text,
        question_type,
        options,
        next_question_yes,
        next_question_no,
        video_url,
        video_title,
      ]
    );
    res.json({ message: "Question added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding question" });
    console.log(error);
  }
});

// Fetch the next question based on the user’s answer
app.post("/api/next-question", async (req, res) => {
  const { currentQuestionId, currentAnswer } = req.body;
  try {
    // Fetch the next question based on the current question ID
    const [rows] = await db.query("SELECT * FROM questions WHERE id = ?", [
      currentQuestionId + 1,
    ]); // Simple next question logic
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching the next question" });
  }
});

// Fetch the next question based on the user’s answer
app.post("/api/previous-question", async (req, res) => {
  const { previousQuestionId, currentAnswer } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM questions WHERE id = ?", [
      previousQuestionId,
    ]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching the next question" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
