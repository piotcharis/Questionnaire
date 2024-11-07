import React from "react";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";

const MultipleSelect = ({ question }) => {
  const [options, setOptions] = React.useState([]);
  const [selectedValues, setSelectedValues] = React.useState([]);

  React.useEffect(() => {
    // Load options from the question prop
    const optionsArray = question.options.options;
    setOptions(optionsArray);
  }, [question]);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedValues(
      (prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((item) => item !== value) // Remove if already selected
          : [...prevSelected, value] // Add if not selected
    );
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
      <Stack spacing={2}>
        <label
          htmlFor="answer"
          style={{ marginBottom: 50, fontSize: 25, marginTop: 50 }}
        >
          {question.question_text}
        </label>
        <FormControl>{renderOptions()}</FormControl>
      </Stack>
      <input type="hidden" id="answer" value={selectedValues.join(",")} />
    </Container>
  );
};

export default MultipleSelect;
