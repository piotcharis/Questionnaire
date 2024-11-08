import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const { VITE_API_LINK } = import.meta.env;

const Video = ({ question }) => {
  const [videoFile, setVideoFile] = useState(null);

  // get the video file
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          VITE_API_LINK + `/get_media.php?filename=${question.url}`,
          {
            responseType: "blob",
          }
        );

        const videoBlob = URL.createObjectURL(response.data);
        setVideoFile(videoBlob);
      } catch (error) {
        console.error("Error fetching the video:", error);
      }
    };
    fetchVideo();
    return () => {
      if (videoFile) {
        URL.revokeObjectURL(videoFile);
      }
    };
  }, [question.url]);

  if (!videoFile) {
    return (
      <div className="loading-container">
        {" "}
        <CircularProgress />{" "}
      </div>
    );
  }

  return (
    <Container className="outer-container">
      <Card sx={{ width: "auto" }}>
        <CardMedia
          component="video"
          sx={{ height: "fit-content" }}
          src={videoFile}
          title={question.media_title}
          controls
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

export default Video;
