import React, { useEffect, useState } from "react";
import { CircularProgress, Paper, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableVirtuoso } from "react-virtuoso";
import axios from "axios";

import Navbar from "../components/Navbar";

const { REACT_APP_API_LINK } = process.env;

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

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: React.forwardRef((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [n_responses, setN_responses] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(REACT_APP_API_LINK + "/questions");
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
        const response = await axios.get(REACT_APP_API_LINK + "/answers");
        setAnswers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the answers:", error);
      }
    };
    fetchAnswers();
  }, []);

  useEffect(() => {
    const unique_sessions = new Set(answers.map((answer) => answer.session_id));
    setN_responses(unique_sessions.size);
  }, [answers]);

  const multiple_choice_questions = questions.filter(
    (question) =>
      question.question_type === "multiple_choice" ||
      (question.question_type === "video" && question.options !== null) ||
      question.question_type === "multiple_select"
  );

  const text_questions = questions.filter(
    (question) =>
      question.question_type === "text" ||
      (question.question_type === "video" && question.options === null)
  );

  const scale_questions = questions.filter(
    (question) => question.question_type === "scale"
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

  const prepareDataScale = (question) => {
    var data = {};

    data.name = question.question_text;

    for (let j = 1; j <= 5; j++) {
      const number_of_answers = getAnswersCount(question.id, j.toString());

      data[j] = number_of_answers;
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

  const make_charts_multiple_questions = () => {
    return multiple_choice_questions.map((question) => {
      const dataset = prepareData(question);
      const options = getOptions(question);

      return (
        <Grid
          size={4}
          item
          key={question.id}
          style={{ display: "flex", justifyContent: "center" }}
        >
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

  const make_charts_scale_questions = () => {
    return scale_questions.map((question) => {
      const dataset = prepareDataScale(question);
      const labels = [
        { dataKey: "1", label: "1" },
        { dataKey: "2", label: "2" },
        { dataKey: "3", label: "3" },
        { dataKey: "4", label: "4" },
        { dataKey: "5", label: "5" },
      ];

      return (
        <Grid
          size={4}
          item
          key={question.id}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <BarChart
            dataset={dataset}
            xAxis={[{ scaleType: "band", dataKey: "name" }]}
            series={labels}
            {...chartSetting}
          />
        </Grid>
      );
    });
  };

  const make_charts_text_questions = () => {
    return text_questions.map((question) => {
      const rows = answers
        .filter((answer) => answer.question_id === question.id)
        .map((answer) => {
          return { question_id: answer.answer };
        });

      const label = question.question_text;

      const columns = [{ dataKey: "question_id", label: label, width: 200 }];

      function fixedHeaderContent() {
        return (
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.dataKey}
                variant="head"
                align={column.numeric || false ? "right" : "left"}
                style={{ width: column.width }}
                sx={{ backgroundColor: "#1976d2", color: "white" }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        );
      }

      function rowContent(_index, row) {
        return (
          <React.Fragment>
            {columns.map((column) => (
              <TableCell
                key={column.dataKey}
                align={column.numeric || false ? "right" : "left"}
              >
                {row[column.dataKey]}
              </TableCell>
            ))}
          </React.Fragment>
        );
      }

      return (
        <Paper
          style={{ height: 300, width: "100%", marginTop: 30 }}
          key={question.id}
        >
          <TableVirtuoso
            data={rows}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
          />
        </Paper>
      );
    });
  };

  if (loading) {
    return (
      <Box className="question-table">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div
      className="App"
      style={{
        fontFamily: "Roboto, sans-serif",
        fontWeight: "400",
      }}
    >
      <Navbar page={"dashboard"} />
      <Typography variant="h4" gutterBottom style={{ padding: 20 }}>
        Dashboard
      </Typography>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h6" gutterBottom>
          Number of responses: {n_responses}
        </Typography>
      </Paper>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h6" gutterBottom>
          Multiple Choice Questions
        </Typography>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {make_charts_multiple_questions()}
        </Grid>
      </Paper>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h6" gutterBottom>
          Text Questions
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {make_charts_text_questions()}
        </Grid>
      </Paper>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h6" gutterBottom>
          Scale Questions
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {make_charts_scale_questions()}
        </Grid>
      </Paper>
    </div>
  );
};

export default Dashboard;
