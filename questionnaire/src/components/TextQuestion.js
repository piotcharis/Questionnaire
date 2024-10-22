import React from "react";
import Container from "@mui/material/Container";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";

const TextQuestion = ({ question }) => {
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
        <label htmlFor="answer" style={{ marginBottom: 50, fontSize: 25 }}>
          {question.question_text}
        </label>
        <TextField
          id="answer"
          variant="outlined"
          label="Your answer"
          multiline
          maxRows={4}
        />
      </Stack>
    </Container>
  );
};

export default TextQuestion;