<?php
require 'config.php';

$sql = "SELECT * FROM questions";
$result = $mysqli->query($sql);

$questions = [];
while ($row = $result->fetch_assoc()) {
    $questions[] = $row;
}

header('Content-Type: application/json');
echo json_encode($questions);
?>