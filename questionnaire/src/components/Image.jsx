import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import axios from "axios";

const { VITE_API_LINK } = import.meta.env;

const Image = ({ question }) => {
  const [imageFile, setImageFile] = useState(null);

  // get the image file
  useEffect(() => {
    axios
      .get(VITE_API_LINK + `/get_media.php?filename=${question.url}`, {
        responseType: "blob",
      })
      .then((response) => {
        const imageBlob = URL.createObjectURL(response.data);
        setImageFile(imageBlob);
      });
  }, [question.url]);

  if (!imageFile) {
    return <div>Loading image...</div>;
  }

  return (
    <Container className="outer-container">
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
    </Container>
  );
};

export default Image;
