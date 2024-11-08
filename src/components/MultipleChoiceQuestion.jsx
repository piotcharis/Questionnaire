import React from "react";
import Container from "@mui/material/Container";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import { TextField } from "@mui/material";

const MultipleChoiceQuestion = ({ question }) => {
  const [options, setOptions] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [answer, setAnswer] = React.useState("");

  React.useEffect(() => {
    // Options are stored as a JSON string in the database
    const optionsArray = question.options.options;
    setOptions(optionsArray);
    setValue("");
    setAnswer("");
  }, [question]);

  function renderOptions() {
    var html = [];

    for (let i = 0; i < options.length; i++) {
      html.push(
        <FormControlLabel
          value={options[i]}
          control={<Radio />}
          label={options[i]}
        />
      );
    }

    if (question.other) {
      html.push(
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      );
    }

    return html;
  }

  const handleChange = (event) => {
    setValue(event.target.value);
    setAnswer(event.target.value);
  };

  const handleOther = (event) => {
    setAnswer(event.target.value);
  };

  return (
    <Container className="outer-container">
      <Stack spacing={2} style={{ alignItems: "center" }}>
        <label
          htmlFor="answer"
          style={{ marginBottom: 50, fontSize: 25, marginTop: 50 }}
        >
          {question.question_text}
        </label>
        <FormControl style={{ width: "40vw" }}>
          <RadioGroup
            aria-labelledby="answer"
            name="radio-buttons-group"
            onChange={handleChange}
          >
            {renderOptions()}
          </RadioGroup>

          {value === "other" ? (
            <TextField
              id="other"
              variant="outlined"
              label="Please specify"
              style={{ marginTop: "8vh" }}
              onChange={handleOther}
            />
          ) : null}

          {/* If no is selected show a text field */}
          {value === "No" && question.reason ? (
            <TextField
              id="reason"
              variant="outlined"
              label="Please specify"
              style={{ marginTop: "8vh" }}
              onChange={handleOther}
            />
          ) : null}
        </FormControl>
      </Stack>
      <input type="hidden" id="answer" value={answer} />
    </Container>
  );
};

export default MultipleChoiceQuestion;
