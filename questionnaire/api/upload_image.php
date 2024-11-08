<?php
require 'config.php';
require 'helpers.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['imageFile'])) {
    $result = uploadFile($_FILES['imageFile'], $env['MEDIA_SAVE_PATH'], ["jpg", "jpeg", "png"]);
    echo json_encode($result);
} else {
    echo json_encode(["error" => "No file uploaded"]);
}
?>
