<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

require 'db.php';

$file = 'debug_log.txt'; // Debug log file

// Check if connection is successful
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Read input data
$data = json_decode(file_get_contents("php://input"), true);

// Log incoming request
file_put_contents($file, print_r($data, true), FILE_APPEND);

if (!$data) {
    echo json_encode(["error" => "Invalid JSON input"]);
    exit();
}

// Extract user data
$libraryIdNo   = $data['libraryIdNo'] ?? '';
$validUntil    = $data['validUntil'] ?? '';
$patron        = $data['patron'] ?? '';
$firstName     = $data['firstName'] ?? '';
$lastName      = $data['lastName'] ?? '';
$middleInitial = $data['middleInitial'] ?? '';
$gender        = $data['gender'] ?? '';
$department    = $data['department'] ?? '';
$course        = $data['course'] ?? '';
$major         = $data['major'] ?? '';
$grade         = $data['grade'] ?? '';
$strand        = $data['strand'] ?? '';
$schoolYear    = $data['schoolYear'] ?? '';
$semester      = $data['semester'] ?? '';
$token         = $data['token'] ?? '';
$qrCodeURL     = $data['qrCodeURL'] ?? '';
$qrCodeImage   = $data['qrCodeImage'] ?? '';
$newTimestamp  = date('Y-m-d H:i:s'); // Current timestamp

// Check if user already exists
$checkSql = "SELECT timesEntered, timestamps FROM std_details WHERE libraryIdNo = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $libraryIdNo);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    // User exists, fetch existing timestamps and increment timesEntered
    $checkStmt->bind_result($existingTimesEntered, $existingTimestamps);
    $checkStmt->fetch();
    $checkStmt->close();

    $newTimesEntered = $existingTimesEntered + 1;

    // Decode timestamps if they exist, otherwise create a new array
    $timestampsArray = !empty($existingTimestamps) ? json_decode($existingTimestamps, true) : [];
    if (!is_array($timestampsArray)) {
        $timestampsArray = []; // Ensure it's an array if decoding fails
    }

    // Append new timestamp
    $timestampsArray[] = $newTimestamp;
    $updatedTimestamps = json_encode($timestampsArray); // Convert array back to JSON string

    // Update database with new timestamp and increment timesEntered
    $updateSql = "UPDATE std_details SET timesEntered = ?, timestamps = ? WHERE libraryIdNo = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("iss", $newTimesEntered, $updatedTimestamps, $libraryIdNo);

    if ($updateStmt->execute()) {
        echo json_encode(["exists" => true, "message" => "Welcome back! Entry recorded.", "timesEntered" => $newTimesEntered]);
    } else {
        echo json_encode(["error" => "Failed to update user: " . $updateStmt->error]);
    }

    $updateStmt->close();
    $conn->close();
    exit();
}
$checkStmt->close();

// Insert new user
$timesEntered = 1; // First entry
$timestamps = json_encode([$newTimestamp]); // Store timestamp as JSON array in TEXT column

$insertSql = "INSERT INTO std_details (libraryIdNo, validUntil, patron, lastName, firstName, middleInitial, gender, department, course, major, grade, strand, schoolYear, semester, timesEntered, token, qrCodeURL, qrCodeImage, timestamps)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($insertSql);
$stmt->bind_param(
    "ssssssssssssssissss",
    $libraryIdNo,
    $validUntil,
    $patron,
    $lastName,
    $firstName,
    $middleInitial,
    $gender,
    $department,
    $course,
    $major,
    $grade,
    $strand,
    $schoolYear,
    $semester,
    $timesEntered,
    $token,
    $qrCodeURL,
    $qrCodeImage,
    $timestamps
);

if ($stmt->execute()) {
    echo json_encode(["success" => "User saved successfully!", "exists" => false, "timesEntered" => 1]);
} else {
    echo json_encode(["error" => "Failed to save user: " . $stmt->error]);
}

$stmt->close();
$conn->close();
