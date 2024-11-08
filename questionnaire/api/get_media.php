<?php
require 'config.php';

$filename = $_GET['filename'];  // Get the filename from the URL

// Define the file path
$filePath = $env['MEDIA_SAVE_PATH'] . '/' . $filename;

// Check if the file exists
if (file_exists($filePath)) {
    // Get the file's mime type based on the file extension
    $fileInfo = pathinfo($filePath);
    $fileExtension = strtolower($fileInfo['extension']);

    $mimeTypes = [
        "mp4" => "video/mp4",
        "mkv" => "video/x-matroska",
        "avi" => "video/x-msvideo",
        "mov" => "video/quicktime",
        "webm" => "video/webm",
        "jpg" => "image/jpeg",
        "jpeg" => "image/jpeg",
        "png" => "image/png",
    ];

    // Set the correct Content-Type header based on the file extension
    if (isset($mimeTypes[$fileExtension])) {
        header("Content-Type: " . $mimeTypes[$fileExtension]);
    } else {
        // If the file type is not supported, send an error
        header("HTTP/1.1 415 Unsupported Media Type");
        echo json_encode(["error" => "Unsupported file type"]);
        exit;
    }

    // Send the file to the client
    readfile($filePath);
} else {
    // If the file doesn't exist, return an error
    header("HTTP/1.1 404 Not Found");
    echo json_encode(["error" => "File not found"]);
}
?>
