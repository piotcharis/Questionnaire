<?php
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'];

if ($password === $env['ADMIN_PASSWORD']) {
    echo json_encode(["message" => "Password correct"]);
} else {
    echo json_encode(["error" => "Incorrect password"]);
}
?>