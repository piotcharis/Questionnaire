import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { openDB } from "idb";

const { VITE_API_LINK } = import.meta.env;

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

const Image = ({ question }) => {
  const [imageFile, setImageFile] = useState(null);

  async function loadMedia() {
    const mediaBlob = await getBlob(`media`);
    if (mediaBlob) {
      const mediaUrl = URL.createObjectURL(mediaBlob);
      setImageFile(mediaUrl);
    }
  }

  // get the image file
  useEffect(() => {
    // Check if the image is already loaded in indexedDB
    if (getBlob(`media`)) {
      loadMedia();
    }

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
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
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
