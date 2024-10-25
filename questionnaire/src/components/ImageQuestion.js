import React, { useState, useEffect } from "react";
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
import axios from "axios";

const { REACT_APP_API_LINK } = process.env;

const ImageQuestion = ({ question }) => {
  const [imageFile, setImageFile] = useState(null);
  const [value, setValue] = React.useState("");

  // get the video file
  useEffect(() => {
    axios
      .get(REACT_APP_API_LINK + `/images/${question.url}`, {
        responseType: "blob",
      })
      .then((response) => {
        const imageBlob = URL.createObjectURL(response.data);
        setImageFile(imageBlob);
      });
  }, [question.url]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

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
          id="answer"
          variant="outlined"
          label="Your answer"
          style={{ marginTop: 50 }}
          multiline
          maxRows={6}
        />
      );
    } else {
      return (
        <FormControl style={{ marginTop: 50 }}>
          <RadioGroup
            aria-labelledby="answer"
            name="radio-buttons-group"
            onChange={handleChange}
          >
            {renderOptions()}
          </RadioGroup>
          <input type="hidden" id="answer" value={value} />
        </FormControl>
      );
    }
  }

  if (!imageFile) {
    return <div>Loading image...</div>;
  }

  return (
    <Container className="outer-container">
      <Stack spacing={2}>
        <label htmlFor="text-answer" style={{ marginBottom: 50, fontSize: 25 }}>
          {question.question_text}
        </label>
        <Card sx={{ width: "auto" }}>
          <CardMedia
            sx={{ maxHeight: 600 }}
            component="img"
            src={imageFile}
            title={question.media_title}
          />
          <CardContent>
            <Typography gutterBottom variant="h7" component="div">
              {question.media_title}
            </Typography>
          </CardContent>
        </Card>
        {renderAnswers()}
      </Stack>
    </Container>
  );
};

export default ImageQuestion;