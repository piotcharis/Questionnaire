import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardMedia from "@mui/material/CardMedia";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const { VITE_API_LINK } = import.meta.env;

import { openDB } from "idb";

// Open or create a database
const dbPromise = openDB("media-db", 1, {
  upgrade(db) {
    db.createObjectStore("media");
  },
});

// Retrieve a blob from IndexedDB
async function getBlob(key) {
  const db = await dbPromise;
  return await db.get("media", key);
}

const Video = ({ question }) => {
  const [videoFile, setVideoFile] = useState(null);

  async function loadMedia() {
    const mediaBlob = await getBlob(`media`);
    if (mediaBlob) {
      const mediaUrl = URL.createObjectURL(mediaBlob);
      setVideoFile(mediaUrl);
    }
  }

  // get the video file
  useEffect(() => {
    // Check if the video is already loaded in indexedDB
    if (getBlob(`media`)) {
      loadMedia();
    }

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
    <Container>
      <Card sx={{ width: "auto" }}>
        <CardMedia
          component="video"
          sx={{ height: "auto" }}
          src={videoFile}
          title={question.media_title}
          controls
        />
      </Card>
    </Container>
  );
};

export default Video;
