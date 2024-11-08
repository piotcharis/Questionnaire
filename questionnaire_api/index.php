<?php
// Load required libraries
require 'vendor/autoload.php'; // Ensure you use Composer to manage dependencies, e.g., for dotenv

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Database connection setup using PDO
$db = new PDO(
    "mysql:host=" . $_ENV['DB_HOST'] . ";dbname=" . $_ENV['DB_NAME'] . ";port=" . $_ENV['DB_PORT'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASSWORD'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// File upload directories
$mediaSavePath = $_ENV['MEDIA_SAVE_PATH'];

// Helper function for JSON responses
function jsonResponse($data, $status = 200) {
    header("Content-Type: application/json");
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Helper function to get JSON input
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

// Get question by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/api\/questions\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
    try {
        $stmt = $db->prepare("SELECT * FROM questions WHERE id = ?");
        $stmt->execute([$id]);
        $question = $stmt->fetch(PDO::FETCH_ASSOC);

        // Turn the options string into a JSON array
        if ($question && $question['options']) {
            $question['options'] = json_decode($question['options']);
        }

        jsonResponse($question ?: ["error" => "Question not found"], $question ? 200 : 404);
    } catch (Exception $e) {
        jsonResponse(["error" => "Error fetching question: " . $e->getMessage()], 500);
    }
}

// Add new question
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/questions') {
    $data = getJsonInput();
    $stmt = $db->prepare("INSERT INTO questions (question_text, question_type, options, next_question_yes, next_question_no, url, media_title, other, reason, label, section_title, media) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $data['question_text'], $data['question_type'], $data['options'] ?? null, 
            $data['next_question_yes'] ?? null, $data['next_question_no'] ?? null, 
            $data['url'] ?? null, $data['media_title'] ?? null, 
            $data['other'] ?? 0, $data['reason'] ?? 0, 
            $data['label'] ?? null, $data['section_title'] ?? null, 
            $data['media'] ?? null
        ]);
        jsonResponse(["message" => "Question added successfully"], 201);
    } catch (Exception $e) {
        jsonResponse(["error" => "Error adding question: " . $e->getMessage()], 500);
    }
}

// Get all questions
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/api/questions') {
    try {
        $stmt = $db->query("SELECT * FROM questions");
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse($questions);
    } catch (Exception $e) {
        jsonResponse(["error" => "Error fetching questions: " . $e->getMessage()], 500);
    }
}

// Delete selected questions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/delete') {
    $data = getJsonInput();
    $selected = implode(",", array_map('intval', $data['selected'] ?? []));
    if ($selected) {
        try {
            $db->exec("DELETE FROM questions WHERE id IN ($selected)");
            jsonResponse(["message" => "Questions deleted successfully"]);
        } catch (Exception $e) {
            jsonResponse(["error" => "Error deleting questions: " . $e->getMessage()], 500);
        }
    } else {
        jsonResponse(["error" => "No questions selected"], 400);
    }
}

// Handle video and image uploads
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_SERVER['REQUEST_URI'] === '/api/video_upload' || $_SERVER['REQUEST_URI'] === '/api/image_upload')) {
    $fileType = ($_SERVER['REQUEST_URI'] === '/api/video_upload') ? 'video' : 'image';
    $allowedExtensions = ($fileType === 'video') ? ['mp4', 'mkv', 'avi', 'mov', 'webm'] : ['jpg', 'jpeg', 'png'];
    if (!isset($_FILES[$fileType . 'File'])) {
        jsonResponse(["error" => "No file uploaded"], 400);
    }

    $file = $_FILES[$fileType . 'File'];
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (in_array($extension, $allowedExtensions)) {
        $destination = "$mediaSavePath/" . basename($file['name']);
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            jsonResponse(["message" => ucfirst($fileType) . " uploaded successfully"]);
        } else {
            jsonResponse(["error" => "Error saving the file"], 500);
        }
    } else {
        jsonResponse(["error" => "Invalid file type. Only " . implode(", ", $allowedExtensions) . " files are allowed."], 400);
    }
}

// Next question based on current ID
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/next-question') {
    $data = getJsonInput();
    $currentQuestionId = intval($data['currentQuestionId']);
    
    try {
        $stmt = $db->prepare("SELECT * FROM questions WHERE id = ?");
        $stmt->execute([$currentQuestionId + 1]);
        $question = $stmt->fetch(PDO::FETCH_ASSOC);
        jsonResponse($question ?: ["error" => "Next question not found"], $question ? 200 : 404);
    } catch (Exception $e) {
        jsonResponse(["error" => "Error fetching the next question: " . $e->getMessage()], 500);
    }
}

// Previous question
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/previous-question') {
    $data = getJsonInput();
    $previousQuestionId = intval($data['previousQuestionId']);
    
    try {
        $stmt = $db->prepare("SELECT * FROM questions WHERE id = ?");
        $stmt->execute([$previousQuestionId]);
        $question = $stmt->fetch(PDO::FETCH_ASSOC);
        jsonResponse($question ?: ["error" => "Previous question not found"], $question ? 200 : 404);
    } catch (Exception $e) {
        jsonResponse(["error" => "Error fetching the previous question: " . $e->getMessage()], 500);
    }
}

// Add or update an answer
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/answers') {
    $data = getJsonInput();
    $questionId = intval($data['question_id']);
    $answer = $data['answer'];
    $sessionId = $data['session_id'];
    $timestamp = date('Y-m-d H:i:s');

    try {
        // Check if answer exists for the question and session
        $stmt = $db->prepare("SELECT * FROM responses WHERE question_id = ? AND session_id = ?");
        $stmt->execute([$questionId, $sessionId]);
        $existingAnswer = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existingAnswer) {
            // Update existing answer
            $stmt = $db->prepare("UPDATE responses SET answer = ?, timestamp = ? WHERE question_id = ? AND session_id = ?");
            $stmt->execute([$answer, $timestamp, $questionId, $sessionId]);
            jsonResponse(["message" => "Answer updated successfully"]);
        } else {
            // Insert new answer
            $stmt = $db->prepare("INSERT INTO responses (question_id, answer, timestamp, session_id) VALUES (?, ?, ?, ?)");
            $stmt->execute([$questionId, $answer, $timestamp, $sessionId]);
            jsonResponse(["message" => "Answer added successfully"]);
        }
    } catch (Exception $e) {
        jsonResponse(["error" => "Error processing answer: " . $e->getMessage()], 500);
    }
}

// Fetch all answers
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/api/answers') {
    try {
        $stmt = $db->query("SELECT * FROM responses");
        $answers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse($answers);
    } catch (Exception $e) {
        jsonResponse(["error" => "Error fetching answers: " . $e->getMessage()], 500);
    }
}

// Validate password
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/password') {
    $data = getJsonInput();
    $password = $data['password'];

    if ($password === $_ENV['ADMIN_PASSWORD']) {
        jsonResponse(["message" => "Password correct"]);
    } else {
        jsonResponse(["error" => "Incorrect password"], 401);
    }
}

// Update question by ID
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/^\/api\/questions\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
    $data = getJsonInput();

    $fields = [
        'question_text' => $data['question_text'] ?? null,
        'question_type' => $data['question_type'] ?? null,
        'options' => $data['options'] ?? null,
        'next_question_yes' => $data['next_question_yes'] ?? null,
        'next_question_no' => $data['next_question_no'] ?? null,
        'url' => $data['url'] ?? null,
        'media_title' => $data['media_title'] ?? null,
        'other' => $data['other'] ?? 0,
        'reason' => $data['reason'] ?? 0,
        'label' => $data['label'] ?? null,
        'section_title' => $data['section_title'] ?? null,
        'media' => $data['media'] ?? null
    ];

    try {
        $stmt = $db->prepare("UPDATE questions SET question_text = ?, question_type = ?, options = ?, next_question_yes = ?, next_question_no = ?, url = ?, media_title = ?, other = ?, reason = ?, label = ?, section_title = ?, media = ? WHERE id = ?");
        $stmt->execute([...array_values($fields), $id]);

        // Fetch updated question to return
        $stmt = $db->prepare("SELECT * FROM questions WHERE id = ?");
        $stmt->execute([$id]);
        $question = $stmt->fetch(PDO::FETCH_ASSOC);
        jsonResponse($question);
    } catch (Exception $e) {
        jsonResponse(["error" => "Error updating question: " . $e->getMessage()], 500);
    }
}

// Fetch label for scale question
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/api\/labels\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
    
    try {
        $stmt = $db->prepare("SELECT label FROM questions WHERE id = ?");
        $stmt->execute([$id]);
        $label = $stmt->fetch(PDO::FETCH_ASSOC)['label'];

        jsonResponse($label ? $label : ["error" => "Label not found"], $label ? 200 : 404);
    } catch (Exception $e) {
        jsonResponse(["error" => "Error fetching label: " . $e->getMessage()], 500);
    }
}

// Serve media files (videos and images)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/api\/(videos|images)\/(.+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $type = $matches[1];
    $filename = basename($matches[2]); // Prevent directory traversal

    $filePath = "$mediaSavePath/$filename";

    if (file_exists($filePath)) {
        header("Content-Type: " . ($type === 'videos' ? 'video/mp4' : 'image/jpeg'));
        readfile($filePath);
    } else {
        jsonResponse(["error" => "File not found"], 404);
    }
}
?>
