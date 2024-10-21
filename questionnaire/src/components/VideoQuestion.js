import React from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";

const VideoQuestion = ({ question }) => {
  function renderOptions() {
    // Fetch the options from the question object
    const optionsArray = question.options.options;

    var html = [];

    for (let i = 0; i < optionsArray.length; i++) {
      html.push(
        <FormControlLabel
          value={optionsArray[i]}
          control={<Radio />}
          label={optionsArray[i]}
        />
      );
    }

    return html;
  }

  function renderAnswers() {
    if (question.options === null) {
      return (
        <TextField
          id="text-answer"
          variant="outlined"
          label="Your answer"
          style={{ marginTop: 50 }}
          multiline
          maxRows={4}
        />
      );
    } else {
      return (
        <FormControl style={{ marginTop: 50 }}>
          <RadioGroup
            aria-labelledby="text-answer"
            defaultValue="female"
            name="radio-buttons-group"
          >
            {renderOptions()}
          </RadioGroup>
        </FormControl>
      );
    }
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
        <Card sx={{ width: "auto" }}>
          <CardMedia
            component="video"
            sx={{ height: "fit-content" }}
            src={"/resources/" + question.video_url}
            title={question.video_title}
            controls
          />
          <CardContent>
            <Typography gutterBottom variant="h7" component="div">
              {question.video_title}
            </Typography>
          </CardContent>
        </Card>
        {renderAnswers()}
      </Stack>
    </Container>
  );
};

export default VideoQuestion;
