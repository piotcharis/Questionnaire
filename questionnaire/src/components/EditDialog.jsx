import * as React from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { MenuItem } from "@mui/material";

const { VITE_API_LINK } = import.meta.env;

export default function FormDialog({ open, setOpen, question, onClose }) {
  const handleClose = () => {
    setOpen(false);
  };

  const [question_type, setQuestion_type] = React.useState("");
  const [mediaType, setMediaType] = React.useState("");

  const handleChange = (event) => {
    setQuestion_type(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Make the options into a json string if it is not empty and is not already a json string
    if (event.currentTarget.options.value !== "") {
      var new_options = event.currentTarget.options.value;
      const options = event.currentTarget.options.value;
      if (new_options !== "" && new_options[0] !== "{") {
        // Get the options as an array
        const optionsArray = options
          .split(",")
          .map((new_options) => new_options.trim());
        new_options = '{"options": ' + JSON.stringify(optionsArray) + "}";
        event.currentTarget.options.value = new_options;
      }
    } else {
      new_options = null;
    }

    // Send the form data to the server with a put request
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    axios
      .put(VITE_API_LINK + `/update_question.php?id=${question.id}`, formJson)
      .then((response) => {
        onClose(response.data);
        setOpen(false);
      });
  };

  const questionText = question ? question.question_text : "";
  const questionType = question ? question.question_type : "";
  const options = question ? question.options : "";
  const nextQuestionYes = question ? question.next_question_yes : "";
  const nextQuestionNo = question ? question.next_question_no : "";
  const url = question ? question.url : "";
  const mediaTitle = question ? question.media_title : "";
  const label = question ? question.label : "";
  const other = question ? question.other : "";
  const reason = question ? question.reason : "";
  const sectionTitle = question ? question.section_title : "";
  const media = question ? question.media : "";

  const types = [
    {
      value: "text",
      label: "Text",
    },
    {
      value: "multiple_choice",
      label: "Multiple Choice",
    },
    {
      value: "multiple_select",
      label: "Multiple Select",
    },
    {
      value: "scale",
      label: "Scale",
    },
  ];

  const handleMediaChange = (event) => {
    setMediaType(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Edit Question</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To edit a question, change the fields below and click Submit.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="question_text"
          name="question_text"
          label="Question Text"
          type="text"
          defaultValue={questionText}
          fullWidth
        />
        <TextField
          margin="dense"
          id="question_type"
          label="Question Type"
          name="question_type"
          defaultValue={questionType ? questionType : ""}
          select
          fullWidth
          onChange={handleChange}
        >
          {types.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          id="media"
          label="Media Type"
          name="media"
          defaultValue={media ? media : ""}
          select
          fullWidth
          onChange={handleMediaChange}
        >
          <MenuItem key="none" value="none">
            None
          </MenuItem>
          <MenuItem key="video" value="video">
            Video
          </MenuItem>
          <MenuItem key="image" value="image">
            Image
          </MenuItem>
        </TextField>
        <TextField
          margin="dense"
          id="options"
          name="options"
          label="Options"
          type="text"
          defaultValue={options}
          fullWidth
        />
        <TextField
          margin="dense"
          id="next_question_yes"
          name="next_question_yes"
          label="Next Question Yes"
          type="text"
          defaultValue={nextQuestionYes}
          fullWidth
        />
        <TextField
          margin="dense"
          id="next_question_no"
          name="next_question_no"
          label="Next Question No"
          type="text"
          defaultValue={nextQuestionNo}
          fullWidth
        />
        <TextField
          margin="dense"
          id="url"
          name="url"
          label="URL"
          type="text"
          defaultValue={url}
          fullWidth
        />
        <TextField
          margin="dense"
          id="media_title"
          name="media_title"
          label="Media Title"
          type="text"
          defaultValue={mediaTitle}
          fullWidth
        />
        <TextField
          margin="dense"
          id="label"
          name="label"
          label="Label"
          type="text"
          defaultValue={label}
          fullWidth
        />
        <TextField
          margin="dense"
          id="other"
          name="other"
          label="Other"
          type="text"
          defaultValue={other}
          fullWidth
        />
        <TextField
          margin="dense"
          id="reason"
          name="reason"
          label="Reason"
          type="text"
          defaultValue={reason}
          fullWidth
        />
        <TextField
          margin="dense"
          id="section_title"
          name="section_title"
          label="Section Title"
          type="text"
          defaultValue={sectionTitle}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
