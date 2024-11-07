import React from "react";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const MultipleSelect = ({ question }) => {
  const [options, setOptions] = React.useState([]);
  const [selectedValues, setSelectedValues] = React.useState([]);
  const [answer, setAnswer] = React.useState("");

  React.useEffect(() => {
    // Load options from the question prop
    const optionsArray = question.options.options;
    setOptions(optionsArray);
  }, [question]);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const tempSelectedValues = selectedValues;

    if (value === "other") {
      setAnswer(tempSelectedValues.join(","));
      tempSelectedValues.push("other");
      setSelectedValues(tempSelectedValues);
      return;
    }

    if (tempSelectedValues.includes(value)) {
      tempSelectedValues.splice(tempSelectedValues.indexOf(value), 1);
    } else {
      tempSelectedValues.push(value);
    }

    setAnswer(tempSelectedValues.join(","));
    setSelectedValues(tempSelectedValues);
  };

  const handleCheckboxChangeOther = (event) => {
    const tempSelectedValues = selectedValues.filter(
      (item) => item !== "other"
    );

    if (tempSelectedValues.length > 0) {
      setAnswer(tempSelectedValues.join(",") + "," + event.target.value);
    } else {
      setAnswer(event.target.value);
    }
  };

  function renderOptions() {
    var html = [];

    html.push(
      options.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              value={option}
              checked={selectedValues.includes(option)}
              onChange={handleCheckboxChange}
            />
          }
          label={option}
        />
      ))
    );

    if (question.other) {
      html.push(
        <FormControlLabel
          value="other"
          control={
            <Checkbox
              checked={selectedValues.includes("other")}
              onChange={handleCheckboxChange}
              value={"other"}
            />
          }
          label="Other"
        />
      );
    }

    return html;
  }

  return (
    <Container className="outer-container">
      <Stack spacing={2}>
        <label
          htmlFor="answer"
          style={{ marginBottom: 50, fontSize: 25, marginTop: 50 }}
        >
          {question.question_text}
        </label>
        <FormControl style={{ width: "40vw" }}>
          {renderOptions()}
          {selectedValues.includes("other") && (
            <TextField
              id="other"
              variant="outlined"
              label="Please specify"
              style={{ marginTop: "8vh" }}
              onChange={handleCheckboxChangeOther}
            />
          )}
        </FormControl>
      </Stack>
      <input type="hidden" id="answer" value={answer} />
    </Container>
  );
};

export default MultipleSelect;
