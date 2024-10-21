import React from "react";
import Container from "@mui/material/Container";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";

const MultipleChoiceQuestion = ({ question }) => {
  const [options, setOptions] = React.useState([]);

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

  return (
    <Container
      style={{
        width: "100vw",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack spacing={2}>
        <label htmlFor="text-answer" style={{ marginBottom: 50, fontSize: 25 }}>
          {question.question_text}
        </label>
        <FormControl>
          <RadioGroup
            aria-labelledby="text-answer"
            defaultValue="female"
            name="radio-buttons-group"
          >
            {renderOptions()}
          </RadioGroup>
        </FormControl>
      </Stack>
    </Container>
  );
};

export default MultipleChoiceQuestion;
