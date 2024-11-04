const express = require("express");
const mysql = require("mysql2/promise"); // For Promises support
const multer = require("multer"); // Import the multer package
const path = require("path"); // Import the path package

const cors = require("cors"); // Import the cors package

require("dotenv").config();

const env = process.env;

const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: env.DB_PORT,
});

app.use(cors());

// Set the storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.MEDIA_SAVE_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Filter the video file
const videoFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    ext === ".mp4" ||
    ext === ".mkv" ||
    ext === ".avi" ||
    ext === ".mov" ||
    ext === ".webm"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only video files are allowed."), false);
  }
};

// Filter the image file
const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  }
};

const video_upload = multer({ storage: storage, videoFilter: videoFilter });

const image_upload = multer({ storage: storage, imageFilter: imageFilter });

// Fetch the first question
app.get("/api/questions/:id", async (req, res) => {
  // Get the id from the URL
  try {
    const [rows] = await db.query("SELECT * FROM questions WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions" + error });
  }
});

// Add a new question to the database
app.post("/api/questions", async (req, res) => {
  var {
    question_text,
    question_type,
    options,
    next_question_yes,
    next_question_no,
    url,
    media_title,
  } = req.body;

  if (options === "") {
    options = null;
  }

  if (next_question_yes === "") {
    next_question_yes = null;
  }

  if (next_question_no === "") {
    next_question_no = null;
  }

  try {
    await db.query(
      "INSERT INTO questions (question_text, question_type, options, next_question_yes, next_question_no, url, media_title) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        question_text,
        question_type,
        options,
        next_question_yes,
        next_question_no,
        url,
        media_title,
      ]
    );
    res.json({ message: "Question added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding question" });
    console.log(error);
  }
});

// Get all questions
app.get("/api/questions", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM questions");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions " + error });
  }
});

// Delete received questions
app.post("/api/delete", async (req, res) => {
  const { selected } = req.body;
  try {
    await db.query("DELETE FROM questions WHERE id IN (?)", [selected]);
    res.json({ message: "Questions deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting questions" });
  }
});

// Save the video file
app.post("/api/video_upload", video_upload.single("videoFile"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error uploading video" });
  }
});

// Fetch the video file
app.get("/api/videos/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, env.MEDIA_SAVE_PATH + `/${filename}`));
});

// Save the image file
app.post("/api/image_upload", image_upload.single("imageFile"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error uploading image" });
  }
});

// Fetch the image file
app.get("/api/images/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, env.MEDIA_SAVE_PATH + `/${filename}`));
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

// Add the user’s answer to the database
app.post("/api/answers", async (req, res) => {
  const { question_id, answer, session_id } = req.body;

  // Check if there is already an answer for the question with the same session ID
  const [rows] = await db.query(
    "SELECT * FROM responses WHERE question_id = ? AND session_id = ?",
    [question_id, session_id]
  );

  if (rows.length > 0) {
    // Update the answer
    try {
      await db.query(
        "UPDATE responses SET answer = ? WHERE question_id = ? AND session_id = ?",
        [answer, question_id, session_id]
      );
      res.json({ message: "Answer updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error updating answer" });
    }
  } else {
    try {
      await db.query(
        "INSERT INTO responses (question_id, answer, session_id) VALUES (?, ?, ?)",
        [question_id, answer, session_id]
      );
      res.json({ message: "Answer added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error adding answer" });
    }
  }
});

// Fetch all answers
app.get("/api/answers", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM responses");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching answers" });
  }
});

// Check the password
app.post("/api/password", async (req, res) => {
  const { password } = req.body;
  if (password === env.ADMIN_PASSWORD) {
    res.json({ message: "Password correct" });
  } else {
    res.status(401).json({ error: "Incorrect password" });
  }
});

// Update question
app.put("/api/questions/:id", async (req, res) => {
  var {
    question_text,
    question_type,
    options,
    next_question_yes,
    next_question_no,
    url,
    media_title,
  } = req.body;

  if (options === "") {
    options = null;
  }

  if (next_question_yes === "") {
    next_question_yes = null;
  }

  if (next_question_no === "") {
    next_question_no = null;
  }

  if (url === "") {
    url = null;
  }

  if (media_title === "") {
    media_title = null;
  }

  try {
    await db.query(
      "UPDATE questions SET question_text = ?, question_type = ?, options = ?, next_question_yes = ?, next_question_no = ?, url = ?, media_title = ? WHERE id = ?",
      [
        question_text,
        question_type,
        options,
        next_question_yes,
        next_question_no,
        url,
        media_title,
        req.params.id,
      ]
    );
    res.json({ message: "Question updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating question" + error });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
