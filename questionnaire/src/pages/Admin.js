import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Admin = () => {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("text");
  const [options, setOptions] = useState("");
  const [nextQuestionYes, setNextQuestionYes] = useState("");
  const [nextQuestionNo, setNextQuestionNo] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [errorOptions, setErrorOptions] = useState("");
  const [errorVideoTitle, setErrorVideoTitle] = useState("");
  const [errorVideoFile, setErrorVideoFile] = useState("");

  const handleAddQuestion = async () => {
    if (!questionText) {
      setErrorText("Question text cannot be empty");
      return;
    }

    if (questionType === "multiple_choice" && !options) {
      setErrorOptions("Options cannot be empty for multiple choice questions");
      return;
    }

    if (questionType === "video" && !videoTitle) {
      setErrorVideoTitle("Video Title cannot be empty for video questions");
      return;
    }

    if (questionType === "video" && !videoFile) {
      setErrorVideoFile("Video file cannot be empty for video questions");
      return;
    }

    if (options !== "" && options[0] !== "{") {
      // Get the options as an array
      const optionsArray = options.split(",").map((option) => option.trim());
      setOptions('{"options": ' + JSON.stringify(optionsArray) + "}");
    } else {
      setOptions(null);
    }

    if (videoTitle === "") {
      setVideoTitle(null);
    }

    if (videoFile === "") {
      setVideoFile(null);
    }

    if (nextQuestionYes === "") {
      setNextQuestionYes(null);
    }

    if (nextQuestionNo === "") {
      setNextQuestionNo(null);
    }

    // Video file needs to be sent as FormData
    // TODO: Fix video file upload
    const formData = new FormData();
    if (videoFile) {
      formData.append("videoFile", videoFile);
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
          video_url: videoFile ? videoFile.name : null,
          video_title: videoTitle,
          videoFile: formData,
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
      setVideoTitle("");
      setVideoFile(null);
      setErrorText("");
      setErrorOptions("");
      setErrorVideoTitle("");
      setErrorVideoFile("");
      alert("Question added successfully");
    } catch (err) {
      console.error("Error adding question:", err);
      alert("Failed to add question");
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
          error={!!errorText}
          helperText={errorText}
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
            error={!!errorOptions}
            helperText={errorOptions}
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
              label="Video Title"
              variant="outlined"
              fullWidth
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              margin="normal"
              required
              error={!!errorVideoTitle}
              helperText={errorVideoTitle}
            />
            <TextField
              label="Video File"
              variant="outlined"
              fullWidth
              value={videoFile ? videoFile.name : ""}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    component="label"
                    htmlFor="video-file"
                  >
                    <FileUploadIcon />
                    <VisuallyHiddenInput
                      id="video-file"
                      type="file"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                    />
                  </IconButton>
                ),
              }}
              margin="normal"
              required
              error={!!errorVideoFile}
              helperText={errorVideoFile}
              disabled
            />
          </>
        )}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddQuestion}
            style={{ backgroundColor: "#4CAF50" }}
          >
            Add Question
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Admin;
