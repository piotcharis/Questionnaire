<?php
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$previousQuestionId = $data['previousQuestionId'];

$sql = "SELECT * FROM questions WHERE id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $previousQuestionId);  // Fetch previous question
$stmt->execute();
$result = $stmt->get_result();

header('Content-Type: application/json');
echo json_encode($result->fetch_assoc());
?>