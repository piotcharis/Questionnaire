<?php
require 'config.php';

$id = $_GET['id'];
$sql = "SELECT * FROM questions WHERE id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

header("Content-Type: application/json"); // Set the response type to JSON

$data = $result->fetch_assoc();
$data['options'] = json_decode($data['options']);

echo json_encode($data);
?>