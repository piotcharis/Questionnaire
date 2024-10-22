import React, { useEffect, useState } from "react";
import { Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import axios from "axios";

import Navbar from "../components/Navbar";

const chartSetting = {
  yAxis: [
    {
      label: "number of answers",
      tickMinStep: 1,
    },
  ],
  width: 550,
  height: 350,
  sx: {
    [`.${axisClasses.left}`]: {
      // Increase the space for the y-axis labels
      paddingLeft: "50px", // Adjust this value as needed
    },
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      // Adjust the transform so the label is not shifted out of view
      transform: "translate(-10px, 0)", // Reduce the translation
    },
  },
};

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching the questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/answers");
        setAnswers(response.data);
      } catch (error) {
        console.error("Error fetching the answers:", error);
      }
    };
    fetchAnswers();
  }, []);

  const multiple_choice_questions = questions.filter(
    (question) =>
      question.question_type === "multiple_choice" ||
      (question.question_type === "video" && question.options !== null)
  );

  const text_questions = questions.filter(
    (question) =>
      question.question_type === "text" ||
      (question.question_type === "video" && question.options === null)
  );

  const getAnswersCount = (question_id, option) => {
    const filtered_answers = answers.filter(
      (answer) => answer.question_id === question_id && answer.answer === option
    );

    return filtered_answers.length;
  };

  const prepareData = (question) => {
    var data = {};

    const options = question.options.options;

    data.name = question.question_text;

    for (let j = 0; j < options.length; j++) {
      const number_of_answers = getAnswersCount(question.id, options[j]);

      data[options[j]] = number_of_answers;
    }
    return [data];
  };

  const getOptions = (question) => {
    if (question.options !== null) {
      var options = [];
      for (let i = 0; i < question.options.options.length; i++) {
        options.push({
          dataKey: question.options.options[i],
          label: question.options.options[i],
        });
      }
      return options;
    } else {
      return null;
    }
  };

  const make_charts = () => {
    return multiple_choice_questions.map((question) => {
      const dataset = prepareData(question);
      const options = getOptions(question);

      console.log(dataset);

      return (
        <Grid size={6}>
          <BarChart
            dataset={dataset}
            xAxis={[{ scaleType: "band", dataKey: "name" }]}
            series={options}
            {...chartSetting}
          />
        </Grid>
      );
    });
  };

  return (
    <div
      className="App"
      style={{
        fontFamily: "Roboto, sans-serif",
        fontWeight: "400",
      }}
    >
      <Navbar />
      <Typography variant="h4" gutterBottom style={{ padding: 20 }}>
        Dashboard
      </Typography>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h6" gutterBottom>
          Multiple Choice Questions
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {make_charts()}
        </Grid>
      </Paper>
    </div>
  );
};

export default Dashboard;
