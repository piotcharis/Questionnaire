<?php
// Load environment variables from .env or .ini file
$env = parse_ini_file('.env');

// Database connection
$mysqli = new mysqli($env['DB_HOST'], $env['DB_USER'], $env['DB_PASSWORD'], $env['DB_NAME'], $env['DB_PORT']);

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

header("Access-Control-Allow-Origin: *"); // Replace '*' with the URL of your React app, e.g., 'http://localhost:3000'
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>