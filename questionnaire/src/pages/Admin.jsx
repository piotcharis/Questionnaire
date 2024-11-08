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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axios from "axios";

import QuestionsTable from "../components/QuestionsTable";
import Navbar from "../components/Navbar";
import PasswordSplashScreen from "../components/Password";

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
  const [imageFile, setImageFile] = useState(null);
  const [imageTitle, setImageTitle] = useState("");
  const [label, setLabel] = useState("");
  const [other, setOther] = useState(false);
  const [reason, setReason] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [media, setMedia] = useState("none");

  const [errorText, setErrorText] = useState("");
  const [errorOptions, setErrorOptions] = useState("");
  const [errorVideoTitle, setErrorVideoTitle] = useState("");
  const [errorVideoFile, setErrorVideoFile] = useState("");
  const [errorImageTitle, setErrorImageTitle] = useState("");
  const [errorImageFile, setErrorImageFile] = useState("");
  const [errorLabel, setErrorLabel] = useState("");
  const [errorSectionTitle, setErrorSectionTitle] = useState("");

  const [alertError, setAlertError] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [questionColumns, setQuestionColumns] = useState([]);
  const [hasQuestions, setHasQuestions] = useState(false);

  const [passwordEntered, setPasswordEntered] = useState(false);

  useEffect(() => {
    getQuestions();
  }, []);

  const onPasswordSubmit = (password) => {
    // Send the password to the server to check if it is correct
    axios
      .post("http://localhost:3000/api/password", {
        password: password,
      })
      .then((response) => {
        setPasswordEntered(true);
        setPasswordError(false);
      })
      .catch((error) => {
        console.error("Error checking password:", error);
        setAlertError(true);
        setAlertMessage("Incorrect password");
        setPasswordError(true);
      });
  };

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

    var new_options = options;

    if (questionExists) {
      setAlertError(true);
      setAlertMessage("Question already exists");
      return;
    }

    if (!questionText) {
      setErrorText("Question text cannot be empty");
      return;
    }

    if (
      (questionType === "multiple_choice" ||
        questionType === "multiple_select") &&
      !options
    ) {
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

    if (questionType === "image" && !imageTitle) {
      setErrorImageTitle("Image Title cannot be empty for image questions");
      return;
    }

    if (questionType === "image" && !imageFile) {
      setErrorImageFile("Image file cannot be empty for image questions");
      return;
    }

    if (questionType === "scale" && !label) {
      setErrorLabel("Label cannot be empty for scale questions");
      return;
    }

    if (!sectionTitle) {
      setErrorSectionTitle("Section Title cannot be empty");
      return;
    }

    if (new_options !== "" && new_options[0] !== "{") {
      // Get the options as an array
      const optionsArray = options
        .split(",")
        .map((new_options) => new_options.trim());
      new_options = '{"options": ' + JSON.stringify(optionsArray) + "}";
    } else {
      new_options = null;
    }

    if (videoTitle === "") {
      setVideoTitle(null);
    }

    if (videoFile === "") {
      setVideoFile(null);
    }

    if (imageTitle === "") {
      setImageTitle(null);
    }

    if (imageFile === "") {
      setImageFile(null);
    }

    if (nextQuestionYes === "") {
      setNextQuestionYes(null);
    }

    if (nextQuestionNo === "") {
      setNextQuestionNo(null);
    }

    if (label === "") {
      setLabel(null);
    }

    const formData = new FormData();
    if (videoFile) {
      formData.append("videoFile", videoFile);
    }

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    if (media === "none") {
      setMedia("");
    }

    if (videoFile) {
      // Send the video file separately
      try {
        const response = await axios.post(
          "http://localhost:3000/api/video_upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to upload video file");
        }
      } catch (err) {
        console.error("Error uploading video file:", err);
        setAlertError(true);
        setAlertMessage("Failed to upload video file");
        return;
      }
    }

    if (imageFile) {
      // Send the image file separately
      try {
        const response = await axios.post(
          "http://localhost:3000/api/image_upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to upload image file");
        }
      } catch (err) {
        console.error("Error uploading image file:", err);
        setAlertError(true);
        setAlertMessage("Failed to upload image file");
        return;
      }
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
          options: new_options,
          next_question_yes: nextQuestionYes,
          next_question_no: nextQuestionNo,
          url: videoFile ? videoFile.name : imageFile ? imageFile.name : null,
          media_title: videoTitle ? videoTitle : imageTitle ? imageTitle : null,
          other: other,
          reason: reason,
          label: label ? label : null,
          section_title: sectionTitle,
          media: media ? media : null,
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
      setImageFile(null);
      setImageTitle("");
      setLabel("");
      setSectionTitle("");
      setMedia("");
      setOther(false);
      setReason(false);
      setErrorText("");
      setErrorOptions("");
      setErrorVideoTitle("");
      setErrorVideoFile("");
      setErrorImageTitle("");
      setErrorImageFile("");
      setErrorLabel("");
      setErrorSectionTitle("");

      setAlertSuccess(true);
      setAlertMessage("Question added successfully");
    } catch (err) {
      console.error("Error adding question:", err);
      setAlertError(true);
      setAlertMessage("Failed to add question");
    }

    getQuestions(); // Fetch the questions again to update the list
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
    <Box className="question-table">
      <CircularProgress />
    </Box>
  );

  const handleOtherChange = (event) => {
    setOther(event.target.checked);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.checked);
  };

  return !passwordEntered ? (
    <>
      <PasswordSplashScreen onPasswordSubmit={onPasswordSubmit} />
      <Snackbar
        autoHideDuration={2000}
        open={passwordError}
        onClose={handleClose}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
          onClose={handleClose}
        >
          Incorrect password
        </Alert>
      </Snackbar>
    </>
  ) : (
    <div className="App">
      <Navbar page={"admin"} />
      <Container maxWidth="sm" className="outer-container">
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
            align="left"
          >
            <MenuItem key="text" value="text">
              Text
            </MenuItem>
            <MenuItem key="multiple_choice" value="multiple_choice">
              Multiple Choice
            </MenuItem>
            <MenuItem key="multiple_select" value="multiple_select">
              Multiple Select
            </MenuItem>
            <MenuItem key="scale" value="scale">
              Scale
            </MenuItem>
          </TextField>
          <TextField
            label="Media Type"
            variant="outlined"
            fullWidth
            select
            value={media}
            onChange={(e) => setMedia(e.target.value)}
            margin="normal"
            align="left"
          >
            <MenuItem key="none" value="none">
              None
            </MenuItem>
            <MenuItem key="none" value="video">
              Video
            </MenuItem>
            <MenuItem key="none" value="image">
              Image
            </MenuItem>
          </TextField>
          <TextField
            label="Section Title"
            variant="outlined"
            fullWidth
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            error={!!errorSectionTitle}
            helperText={errorSectionTitle}
            margin="normal"
            required
          />
          {(questionType === "multiple_choice" ||
            questionType === "multiple_select") && (
            <>
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
              <FormControlLabel
                control={
                  <Switch
                    checked={other}
                    onChange={handleOtherChange}
                    name="other"
                  />
                }
                label="Other (please specify)"
                fullWidth
                margin="normal"
                align="left"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={reason}
                    onChange={handleReasonChange}
                    name="reason"
                  />
                }
                label="If no, please specify the reason"
                fullWidth
                margin="normal"
                align="left"
              />
            </>
          )}
          {questionType === "scale" && (
            <TextField
              label="Label"
              variant="outlined"
              fullWidth
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              margin="normal"
              error={!!errorLabel}
              helperText={errorLabel}
              required
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
          {media === "video" && (
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
          {media === "image" && (
            <>
              <TextField
                label="Image Title"
                variant="outlined"
                fullWidth
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                margin="normal"
                required
                error={!!errorImageTitle}
                helperText={errorImageTitle}
              />
              <TextField
                label="Image File"
                variant="outlined"
                fullWidth
                value={imageFile ? imageFile.name : ""}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      color="primary"
                      component="label"
                      htmlFor="image-file"
                    >
                      <FileUploadIcon />
                      <VisuallyHiddenInput
                        id="image-file"
                        type="file"
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                    </IconButton>
                  ),
                }}
                margin="normal"
                required
                error={!!errorImageFile}
                helperText={errorImageFile}
                disabled
              />
            </>
          )}
          <Box
            mt={2}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 50,
            }}
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
    </div>
  );
};

export default Admin;
