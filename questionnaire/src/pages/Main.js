import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import TextQuestion from "../components/TextQuestion";
import VideoQuestion from "../components/VideoQuestion";
import MultipleChoiceQuestion from "../components/MultipleChoiceQuestion";
import Thanks from "../components/Thanks";
import Navbar from "../components/Navbar";

function Main() {
  const { questionId } = useParams(); // Get the question id from the URL
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const [answerError, setAnswerError] = useState(false);

  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/questions/${questionId}`
        );
        setCurrentQuestion(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the question:", error);
      }
    };
    fetchQuestion();
  }, [questionId]); // Fetch new question every time the questionId changes

  // If the back button of the browser is clicked, pop the last question from the question_order array
  window.onpopstate = function () {
    let question_order = [];
    if (localStorage.getItem("question_order") !== null) {
      question_order = JSON.parse(localStorage.getItem("question_order"));
    }

    if (question_order.length > 0) {
      question_order.pop();
      localStorage.setItem("question_order", JSON.stringify(question_order));
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 50,
          height: "90vh",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (finished) {
    return <Thanks />;
  }

  function questionType() {
    if (currentQuestion.question_type === "text") {
      return <TextQuestion question={currentQuestion} />;
    } else if (currentQuestion.question_type === "video") {
      return <VideoQuestion question={currentQuestion} />;
    } else if (currentQuestion.question_type === "multiple_choice") {
      return <MultipleChoiceQuestion question={currentQuestion} />;
    }
  }

  const handleNext = async () => {
    // Get the answer from the input field
    const answer = document.getElementById("answer");

    console.log(answer.value);

    if (answer === null || answer.value === "") {
      setAnswerError(true);
      return;
    }

    // Send the answer to the server
    await axios.post("http://localhost:3000/api/answers", {
      question_id: currentQuestion.id,
      answer: answer.value,
      session_id: localStorage.getItem("session_id"),
    });

    if (currentQuestion.next_question_yes === null) {
      setFinished(true);
      return;
    }

    // Save the current question id in local storage in the question_order array
    let question_order = [];
    if (localStorage.getItem("question_order") !== null) {
      question_order = JSON.parse(localStorage.getItem("question_order"));
    }

    question_order.push(currentQuestion.id);

    localStorage.setItem("question_order", JSON.stringify(question_order));

    navigate(`/questions/${parseInt(currentQuestion.next_question_yes)}`);
  };

  const handlePrevious = async () => {
    let question_order = [];
    if (localStorage.getItem("question_order") !== null) {
      question_order = JSON.parse(localStorage.getItem("question_order"));
    }

    if (question_order.length > 0) {
      const previousQuestionId = question_order.pop();
      localStorage.setItem("question_order", JSON.stringify(question_order));

      navigate(`/questions/${parseInt(previousQuestionId)}`);
    }
  };

  const handleClose = () => {
    setAnswerError(false);
  };

  return (
    <div
      className="App"
      style={{ fontFamily: "Roboto, sans-serif", fontWeight: "400" }}
    >
      <Navbar />
      <Snackbar
        autoHideDuration={2000}
        open={answerError}
        onClose={handleClose}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
          onClose={handleClose}
        >
          Please enter an answer
        </Alert>
      </Snackbar>
      {questionType()}
      <br />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item size={6}>
          <Button variant="contained" onClick={handlePrevious}>
            Previous
          </Button>
        </Grid>
        <Grid item size={6}>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Main;