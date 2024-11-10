import React from "react";
import { CSVLink } from "react-csv";
import { Button } from "@mui/material";

const ExportButton = ({ answers }) => {
  const headers = Object.keys(answers[0]).map((key) => ({ label: key, key }));

  return (
    <CSVLink data={answers} headers={headers} filename="answers.csv">
      <Button variant="contained">Download Data</Button>
    </CSVLink>
  );
};

export default ExportButton;
