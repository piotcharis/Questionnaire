import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
  Snackbar,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axios from "axios";

import QuestionsTable from "../components/QuestionsTable";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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

  const [alertError, setAlertError] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [questionColumns, setQuestionColumns] = useState([]);
  const [hasQuestions, setHasQuestions] = useState(false);

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/questions");

      // Turn the options json to a string
      response.data.forEach((question) => {
        if (question.options) {
          question.options = JSON.stringify(question.options);
        }
      });

      setQuestions(response.data);

      // Get the columns of the questions table from the questions json
      if (response.data.length > 0) {
        setQuestionColumns(Object.keys(response.data[0]));
        setHasQuestions(true);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setAlertError(true);
      setAlertMessage("Failed to fetch questions");
    }
  };

  const handleAddQuestion = async () => {
    // Check if the question exists already
    const questionExists = questions.find(
      (question) => question.question_text === questionText
    );

    if (questionExists) {
      setAlertError(true);
      setAlertMessage("Question already exists");
      return;
    }

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

      setAlertSuccess(true);
      setAlertMessage("Question added successfully");
    } catch (err) {
      console.error("Error adding question:", err);
      setAlertError(true);
      setAlertMessage("Failed to add question");
    }

    getQuestions(); // Fetch the questions again to update the list

    if (!videoFile) {
      return;
    }

    // Send the video file separately
    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload video file");
      }
    } catch (err) {
      console.error("Error uploading video file:", err);
      setAlertError(true);
      setAlertMessage("Failed to upload video file");
    }
  };

  const handleClose = () => {
    setAlertError(false);
    setAlertSuccess(false);
    setAlertMessage("");
  };

  const handleOpenDialog = async () => {
    await getQuestions();

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const renderTable = hasQuestions ? (
    <QuestionsTable questions={questions} columns={questionColumns} />
  ) : (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="sm">
      {alertError && (
        <Snackbar
          autoHideDuration={2000}
          open={alertError}
          onClose={handleClose}
        >
          <Alert
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
            onClose={handleClose}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      )}

      {alertSuccess && !alertError && (
        <Snackbar
          autoHideDuration={2000}
          open={alertSuccess}
          onClose={handleClose}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
            onClose={handleClose}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      )}

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
        <Box
          mt={2}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddQuestion}
            style={{ backgroundColor: "#4CAF50" }}
          >
            Add Question
          </Button>

          {/* Button to show all questions */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            style={{ marginLeft: 50 }}
          >
            Show Questions
          </Button>
          <Dialog
            fullScreen
            open={openDialog}
            onClose={handleCloseDialog}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseDialog}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  Questions
                </Typography>
              </Toolbar>
            </AppBar>
            {renderTable}
          </Dialog>
        </Box>
      </Box>
    </Container>
  );
};

export default Admin;
