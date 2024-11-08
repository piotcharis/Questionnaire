<?php
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$ids = implode(',', array_map('intval', $data['selected']));

$sql = "DELETE FROM questions WHERE id IN ($ids)";
if ($mysqli->query($sql) === TRUE) {
    echo json_encode(["message" => "Questions deleted successfully"]);
} else {
    echo json_encode(["error" => "Error deleting questions"]);
}
?>