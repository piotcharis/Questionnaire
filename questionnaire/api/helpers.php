<?php
function uploadFile($file, $destinationPath, $allowedTypes) {
    $fileType = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    // Check file type
    if (!in_array($fileType, $allowedTypes)) {
        return ["error" => "Invalid file type."];
    }

    $filePath = $destinationPath . '/' . basename($file['name']);
    
    // Move the file to the specified directory
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        return ["message" => "File uploaded successfully.", "path" => $filePath];
    } else {
        return ["error" => "Error uploading file."];
    }
}
?>