import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

function Navbar(props) {
  const padding =
    props.page === "dashboard"
      ? "169.01px"
      : props.page === "admin"
      ? "108.26px"
      : "0px";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ marginBottom: 50 }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, paddingLeft: padding }}
          >
            iOCT Research Project
          </Typography>
          {props.page === "dashboard" && (
            <Button color="inherit" href="/admin">
              Add/View Question
            </Button>
          )}
          {props.page === "admin" && (
            <Button color="inherit" href="/dashboard">
              Dashboard
            </Button>
          )}
          {(props.page === "admin" || props.page === "dashboard") && (
            <Button color="inherit" href="/">
              Start Survey
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
