import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import axios from "axios";

const { REACT_APP_API_LINK } = process.env;

const ScaleQuestion = ({ question }) => {
  const [value, setValue] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  const [label, setLabel] = React.useState("");

  useEffect(() => {
    // Get the keyword for the labels from the api
    const fetchKeyword = async () => {
      try {
        const response = await axios.get(
          REACT_APP_API_LINK + `/labels/${question.id}`
        );
        setLabel(response.data);
      } catch (error) {
        console.error("Error fetching the labels:", error);
      }
    };
    fetchKeyword();
  }, [question]);

  const labels = {
    1: "Not " + label,
    2: "Slightly " + label,
    3: label,
    4: "Very " + label,
    5: "Extremely " + label,
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
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
        <Rating
          name="hover-feedback"
          value={value}
          precision={1}
          getLabelText={getLabelText}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        {value !== null && (
          <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
        )}
      </Stack>
      <input type="hidden" id="answer" value={value} />
    </Container>
  );
};

export default ScaleQuestion;
