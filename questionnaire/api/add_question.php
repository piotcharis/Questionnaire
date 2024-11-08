<?php
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$sql = "INSERT INTO questions (question_text, question_type, options, next_question_yes, next_question_no, url, media_title, other, reason, label, section_title, media) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("ssssssssssss", 
    $data['question_text'], 
    $data['question_type'], 
    $data['options'], 
    $data['next_question_yes'], 
    $data['next_question_no'], 
    $data['url'], 
    $data['media_title'], 
    $data['other'], 
    $data['reason'], 
    $data['label'], 
    $data['section_title'], 
    $data['media']
);

if ($stmt->execute()) {
    echo json_encode(["message" => "Question added successfully"]);
} else {
    echo json_encode(["error" => "Error adding question"]);
}
?>