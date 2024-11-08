<?php
require 'config.php';
require 'helpers.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['videoFile'])) {
    $result = uploadFile($_FILES['videoFile'], $env['MEDIA_SAVE_PATH'], ["mp4", "mkv", "avi", "mov", "webm"]);
    echo json_encode($result);
} else {
    echo json_encode(["error" => "No file uploaded"]);
}
?>