<?php
require 'config.php';  // Include your configuration to connect to the database

// Get the question ID from the URL
$questionId = $_GET['id'];

// Check if the question ID is provided and valid
if (!isset($questionId) || !is_numeric($questionId)) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(["error" => "Invalid question ID"]);
    exit;
}

// Prepare the SQL query to fetch the label for the given question ID
$sql = "SELECT label FROM questions WHERE id = ?";

// Prepare the statement
$stmt = $mysqli->prepare($sql);

// Bind the parameter
$stmt->bind_param("i", $questionId);

// Execute the query
$stmt->execute();

// Get the result
$result = $stmt->get_result();

// Check if the question exists
if ($result->num_rows > 0) {
    // Fetch the label
    $row = $result->fetch_assoc();
    echo json_encode(["label" => $row['label']]);
} else {
    // If no question was found for the given ID
    header("HTTP/1.1 404 Not Found");
    echo json_encode(["error" => "Question not found"]);
}
?>
