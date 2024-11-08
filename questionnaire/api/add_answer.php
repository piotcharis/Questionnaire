<?php
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$question_id = $data['question_id'];
$answer = $data['answer'];
$session_id = $data['session_id'];
$datetime = date("Y-m-d H:i:s");  // Get current date-time

// Check if an answer exists for this session
$sql = "SELECT * FROM responses WHERE question_id = ? AND session_id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("ii", $question_id, $session_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Update existing answer
    $sql = "UPDATE responses SET answer = ?, timestamp = ? WHERE question_id = ? AND session_id = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ssii", $answer, $datetime, $question_id, $session_id);
    $stmt->execute();
    echo json_encode(["message" => "Answer updated successfully"]);
} else {
    // Insert new answer
    $sql = "INSERT INTO responses (question_id, answer, timestamp, session_id) VALUES (?, ?, ?, ?)";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("isss", $question_id, $answer, $datetime, $session_id);
    $stmt->execute();
    echo json_encode(["message" => "Answer added successfully"]);
}
?>