import React from "react";
import Container from "@mui/material/Container";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";

const TextQuestion = ({ question }) => {
  return (
    <Container className="outer-container">
      <Stack spacing={2} style={{ alignItems: "center" }}>
        <label
          htmlFor="answer"
          style={{ marginBottom: 50, fontSize: 25, marginTop: 50 }}
        >
          {question.question_text}
        </label>
        <TextField
          id="answer"
          variant="outlined"
          label="Your answer"
          multiline
          maxRows={6}
          className="text-field"
        />
      </Stack>
    </Container>
  );
};

export default TextQuestion;
