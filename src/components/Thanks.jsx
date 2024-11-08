import React from "react";
import { Container, Typography } from "@mui/material";

const Thanks = () => {
  return (
    <Container className="thanks-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Thank You!
      </Typography>
      <Typography variant="body1">
        Thank you for participating in this questionnaire. Your feedback is
        greatly appreciated.
      </Typography>
      <Typography variant="body1">You can close this window now.</Typography>
    </Container>
  );
};

export default Thanks;
