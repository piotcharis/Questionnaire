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
  const [otherText, setOtherText] = React.useState("");

  React.useEffect(() => {
    // Load options from the question prop
    const optionsArray = question.options.options;
    setOptions(optionsArray);
  }, [question]);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    let updatedSelectedValues = [...selectedValues];

    if (updatedSelectedValues.includes(value)) {
      updatedSelectedValues = updatedSelectedValues.filter(
        (item) => item !== value
      );
    } else {
      updatedSelectedValues.push(value);
    }

    setSelectedValues(updatedSelectedValues);
  };

  const handleOtherTextChange = (event) => {
    setOtherText(event.target.value);
  };

  // Update answer field including "other" text if applicable
  const getAnswer = () => {
    let finalAnswer = selectedValues.filter((value) => value !== "other");
    if (selectedValues.includes("other") && otherText.trim() !== "") {
      finalAnswer.push(otherText.trim());
    }
    return finalAnswer.join(",");
  };

  function renderOptions() {
    return options.map((option) => (
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
    ));
  }

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
          {renderOptions()}
          {question.other && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedValues.includes("other")}
                  onChange={handleCheckboxChange}
                  value="other"
                />
              }
              label="Other"
            />
          )}
          {selectedValues.includes("other") && (
            <TextField
              id="other"
              variant="outlined"
              label="Please specify"
              style={{ marginTop: "8vh" }}
              value={otherText}
              onChange={handleOtherTextChange}
            />
          )}
        </FormControl>
      </Stack>
      <input type="hidden" id="answer" value={getAnswer()} />
    </Container>
  );
};

export default MultipleSelect;
