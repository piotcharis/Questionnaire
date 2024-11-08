<?php
require 'config.php';

$id = $_GET['id'];
$sql = "SELECT * FROM questions WHERE id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

header("Content-Type: application/json"); // Set the response type to JSON

echo json_encode($result->fetch_assoc());
?>