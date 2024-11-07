import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

import EditDialog from "./EditDialog";

const { VITE_API_LINK } = import.meta.env;

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            padding="checkbox"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell}
            padding={"normal"}
            align={"left"}
            sortDirection={orderBy === headCell ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell}
              direction={orderBy === headCell ? order : "asc"}
              onClick={createSortHandler(headCell)}
            >
              {headCell}
              {orderBy === headCell ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, handleDelete, handleEdit } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <></>
      )}
      {numSelected === 1 ? (
        <div style={{ display: "flex" }}>
          <Tooltip title="Edit">
            <IconButton onClick={handleEdit}>
              <ModeEditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : numSelected > 1 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const QuestionsTable = ({ questions, columns }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [rows, setRows] = useState(questions);
  const [visibleRows, setVisibleRows] = useState([]);

  const [deleteAlertSuccess, setDeleteAlertSuccess] = useState(false);
  const [deleteAlertError, setDeleteAlertError] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const [editDialog, setEditDialog] = useState(false);

  useEffect(() => {
    setVisibleRows(
      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [rows, page, rowsPerPage]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // FEtch the questions again
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(VITE_API_LINK + "/questions");

      // Turn the options json to a string
      response.data.forEach((question) => {
        if (question.options) {
          question.options = JSON.stringify(question.options);
        }
      });

      setRows(response.data);
      setSelected([]);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(VITE_API_LINK + "/delete", {
        selected,
      });
      setRows(rows.filter((row) => !selected.includes(row.id)));
      setSelected([]);
      setDeleteAlertSuccess(true);
      setDeleteMessage("Question(s) deleted successfully");
    } catch (error) {
      console.error("Error deleting the question:", error);
      setDeleteAlertError(true);
      setDeleteMessage("Failed to delete question(s)");
    }
  };

  const handleEdit = () => {
    setEditDialog(true);
  };

  const handleEditClose = (editedQuestion) => {
    if (editedQuestion) {
      fetchQuestions();
    }
  };

  const handleClose = () => {
    setDeleteAlertSuccess(false);
    setDeleteAlertError(false);
    setDeleteMessage("");
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      {deleteAlertSuccess && (
        <Snackbar
          open={deleteAlertSuccess}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
            onClose={handleClose}
          >
            {deleteMessage}
          </Alert>
        </Snackbar>
      )}
      {deleteAlertError && !deleteAlertSuccess && (
        <Snackbar
          open={deleteAlertError}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
            onClose={handleClose}
          >
            {deleteMessage}
          </Alert>
        </Snackbar>
      )}

      <Paper sx={{ width: "100%", mb: 2 }}>
        <EditDialog
          open={editDialog}
          setOpen={setEditDialog}
          question={rows.find((row) => row.id === selected[0])}
          onClose={handleEditClose}
        />
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={columns}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      align="left"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.question_text}</TableCell>
                    <TableCell align="left">{row.question_type}</TableCell>
                    <TableCell align="left">{row.next_question_yes}</TableCell>
                    <TableCell align="left">{row.next_question_no}</TableCell>
                    <TableCell align="left">{row.media_title}</TableCell>
                    <TableCell align="left">{row.url}</TableCell>
                    <TableCell align="left">{row.options}</TableCell>
                    <TableCell align="left">{row.other}</TableCell>
                    <TableCell align="left">{row.reason}</TableCell>
                    <TableCell align="left">{row.label}</TableCell>
                    <TableCell align="left">{row.section_title}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default QuestionsTable;
