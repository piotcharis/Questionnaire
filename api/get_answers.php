<?php
require 'config.php';

$sql = "SELECT * FROM responses";
$result = $mysqli->query($sql);

$answers = [];
while ($row = $result->fetch_assoc()) {
    $answers[] = $row;
}

header('Content-Type: application/json');
echo json_encode($answers);
?>