import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import TextQuestion from "../components/TextQuestion";
import MultipleChoiceQuestion from "../components/MultipleChoiceQuestion";
import MultipleSelectQuestion from "../components/MultipleSelectQuestion";
import ScaleQuestion from "../components/ScaleQuestion";
import Thanks from "../components/Thanks";
import Navbar from "../components/Navbar";
import Video from "../components/Video";
import Image from "../components/Image";

import { openDB } from "idb";

// Open or create a database
const dbPromise = openDB("media-db", 1, {
  upgrade(db) {
    db.createObjectStore("media");
  },
});

// Store a blob in IndexedDB
async function storeBlob(key, blob) {
  const db = await dbPromise;
  await db.put("media", blob, key);
}

// Retrieve a blob from IndexedDB
async function getBlob(key) {
  const db = await dbPromise;
  return await db.get("media", key);
}

function Main() {
  const { questionId } = useParams(); // Get the question id from the URL
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const [answerError, setAnswerError] = useState(false);

  const navigate = useNavigate(); // For programmatic navigation

  const { VITE_API_LINK } = import.meta.env;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          VITE_API_LINK + `/get_question.php?id=${questionId}`
        );
        setCurrentQuestion(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the question:", error);
      }
    };
    fetchQuestion();
  }, [questionId, VITE_API_LINK]); // Fetch new question every time the questionId changes

  const next_question = async (question) => {
    try {
      const response = await axios.get(
        VITE_API_LINK + `/get_question.php?id=${question.next_question_yes}`
      );

      if (response.data.media === "video" || response.data.media === "image") {
        const mediaResponse = await axios.get(
          VITE_API_LINK + `/get_media.php?filename=${response.data.url}`,
          { responseType: "blob" }
        );

        const mediaBlob = mediaResponse.data;
        await storeBlob(`media`, mediaBlob);
      }
    } catch (error) {
      console.error("Error preloading media:", error);
    }
  };

  useEffect(() => {
    if (currentQuestion !== null) {
      next_question(currentQuestion);
    }
  }, [currentQuestion, VITE_API_LINK]);

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
      <div className="loading-container">
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
    } else if (currentQuestion.question_type === "multiple_choice") {
      return <MultipleChoiceQuestion question={currentQuestion} />;
    } else if (currentQuestion.question_type === "multiple_select") {
      return <MultipleSelectQuestion question={currentQuestion} />;
    } else if (currentQuestion.question_type === "scale") {
      return <ScaleQuestion question={currentQuestion} />;
    }
  }

  const handleNext = async () => {
    // Get the answer from the input field
    const answer = document.getElementById("answer");

    if (answer === null || answer.value === "") {
      setAnswerError(true);
      return;
    }

    // Send the answer to the server
    await axios.post(VITE_API_LINK + "/add_answer.php", {
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
    <div className="App">
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
      <h2>{"Section: " + currentQuestion.section_title}</h2>
      {currentQuestion.media === "image" ? (
        <Image question={currentQuestion} />
      ) : null}
      {currentQuestion.media === "video" ? (
        <Video question={currentQuestion} />
      ) : null}
      {questionType()}
      <br />
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        style={{ marginBottom: 50 }}
      >
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
