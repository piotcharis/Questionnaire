import React from "react";
import Container from "@mui/material/Container";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";

const MultipleChoiceQuestion = ({ question }) => {
  const [options, setOptions] = React.useState([]);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    // Options are stored as a JSON string in the database
    const optionsArray = question.options.options;
    setOptions(optionsArray);
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

    return html;
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Container className="outer-container">
      <Stack spacing={2}>
        <label
          htmlFor="answer"
          style={{ marginBottom: 50, fontSize: 25, marginTop: 50 }}
        >
          {question.question_text}
        </label>
        <FormControl>
          <RadioGroup
            aria-labelledby="answer"
            name="radio-buttons-group"
            onChange={handleChange}
          >
            {renderOptions()}
          </RadioGroup>
        </FormControl>
      </Stack>
      <input type="hidden" id="answer" value={value} />
    </Container>
  );
};

export default MultipleChoiceQuestion;
