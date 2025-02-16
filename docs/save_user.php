<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins (or specify your frontend: http://localhost:3000)
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle CORS preflight request
    http_response_code(200);
    exit();
}

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$file = 'debug_log.txt';  // Debug file
file_put_contents($file, file_get_contents("php://input")); // Log request body

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get raw POST data
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if JSON parsing failed
    if ($data === null) {
        echo json_encode(["error" => "Invalid JSON input"]);
        exit;
    }

    $name = $data['firstName'] . ' ' . $data['lastName'];
    $department = $data['department'];
    $libraryIdNo = $data['libraryIdNo'];

    if (empty($name) || empty($department)) {
        echo json_encode(["error" => "All fields are required"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO students (name, department, libraryIdNo) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $department, $libraryIdNo);

    if ($stmt->execute()) {
        echo json_encode(["success" => "User saved successfully"]);
    } else {
        echo json_encode(["error" => "Failed to save user"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
