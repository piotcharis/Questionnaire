import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";

const Admin = () => {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("text");
  const [options, setOptions] = useState("");
  const [nextQuestionYes, setNextQuestionYes] = useState("");
  const [nextQuestionNo, setNextQuestionNo] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [error, setError] = useState("");

  const handleAddQuestion = async () => {
    if (!questionText) {
      setError("Question text cannot be empty");
      return;
    }

    if (questionType === "multiple_choice" && !options) {
      setError("Options cannot be empty for multiple choice questions");
      return;
    }

    if (questionType === "video" && (!videoUrl || !videoTitle)) {
      setError("Video URL and Video Title cannot be empty for video questions");
      return;
    }

    if (options !== "" && options[0] !== "{") {
      // Get the options as an array
      const optionsArray = options.split(",").map((option) => option.trim());
      setOptions('{"options": ' + JSON.stringify(optionsArray) + "}");
    } else {
      setOptions(null);
    }

    if (videoUrl === "") {
      setVideoUrl(null);
    }

    if (videoTitle === "") {
      setVideoTitle(null);
    }

    if (nextQuestionYes === "") {
      setNextQuestionYes(null);
    }

    if (nextQuestionNo === "") {
      setNextQuestionNo(null);
    }

    try {
      const response = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_text: questionText,
          question_type: questionType,
          options: options,
          next_question_yes: nextQuestionYes,
          next_question_no: nextQuestionNo,
          video_url: videoUrl,
          video_title: videoTitle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add question");
      }

      setQuestionText("");
      setQuestionType("text");
      setOptions("");
      setNextQuestionYes("");
      setNextQuestionNo("");
      setVideoUrl("");
      setVideoTitle("");
      setError("");
      alert("Question added successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Admin Page
        </Typography>
        <TextField
          label="Question Text"
          variant="outlined"
          fullWidth
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          error={!!error}
          helperText={error}
          required
        />
        <TextField
          label="Question Type"
          variant="outlined"
          fullWidth
          select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          margin="normal"
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="video">Video</MenuItem>
          <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
        </TextField>
        {questionType === "multiple_choice" && (
          <TextField
            label="Options (separated by commas)"
            variant="outlined"
            fullWidth
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            margin="normal"
            required
          />
        )}
        {questionType === "video" && (
          <TextField
            label="Options (separated by commas)"
            variant="outlined"
            fullWidth
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            margin="normal"
          />
        )}
        <TextField
          label="Next Question for Yes"
          variant="outlined"
          fullWidth
          value={nextQuestionYes}
          onChange={(e) => setNextQuestionYes(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Next Question for No"
          variant="outlined"
          fullWidth
          value={nextQuestionNo}
          onChange={(e) => setNextQuestionNo(e.target.value)}
          margin="normal"
        />
        {questionType === "video" && (
          <>
            <TextField
              label="Video Name"
              variant="outlined"
              fullWidth
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              label="Video Title"
              variant="outlined"
              fullWidth
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              margin="normal"
              required
            />
          </>
        )}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Admin;
