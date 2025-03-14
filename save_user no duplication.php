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

// Read input data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "Invalid JSON input", "alertType" => "error"]);
    exit();
}

// Extract user data
$libraryIdNo   = $data['libraryIdNo'] ?? '';
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
date_default_timezone_set('Asia/Manila');
$newTimestamp = date('Y-m-d H:i:s');

$name = trim("$lastName, $firstName" . (!empty($middleInitial) ? " $middleInitial" : "")) . (!empty($middleInitial) ? "." : "");

// ✅ Check if user already exists (increment `timesEntered` if true)
$checkSql = "SELECT timesEntered, timestamps FROM std_details WHERE libraryIdNo = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $libraryIdNo);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    $checkStmt->bind_result($existingTimesEntered, $existingTimestamps);
    $checkStmt->fetch();
    $checkStmt->close();

    $newTimesEntered = $existingTimesEntered + 1;

    $timestampsArray = !empty($existingTimestamps) ? json_decode($existingTimestamps, true) : [];
    if (!is_array($timestampsArray)) {
        $timestampsArray = [];
    }
    $timestampsArray[] = $newTimestamp;
    $updatedTimestamps = json_encode($timestampsArray);

    $updateSql = "UPDATE std_details SET timesEntered = ?, timestamps = ? WHERE libraryIdNo = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("iss", $newTimesEntered, $updatedTimestamps, $libraryIdNo);

    if ($updateStmt->execute()) {
        echo json_encode([
            "exists" => true,
            "timesEntered" => $newTimesEntered,
            "message" => "Good day, $firstName $lastName! Your entry has been recorded.",
            "alertType" => "success"
        ]);
    } else {
        echo json_encode([
            "error" => "Failed to update user: " . $updateStmt->error,
            "alertType" => "error"
        ]);
    }

    $updateStmt->close();
    $conn->close();
    exit();
}
$checkStmt->close();

// ✅ Check for duplicate entries (only for new users)
$duplicateCheckSql = "SELECT libraryIdNo FROM std_details WHERE name = ? AND department = ? AND course = ? AND schoolYear = ? AND semester = ?";
$duplicateCheckStmt = $conn->prepare($duplicateCheckSql);
$duplicateCheckStmt->bind_param("sssss", $name, $department, $course, $schoolYear, $semester);
$duplicateCheckStmt->execute();
$duplicateCheckStmt->store_result();

if ($duplicateCheckStmt->num_rows > 0) {
    echo json_encode([
        "error" => "Duplicate entry detected. This data already exists in the system.",
        "alertType" => "error"
    ]);
    $duplicateCheckStmt->close();
    exit();
}
$duplicateCheckStmt->close();

// ✅ Insert new user (first-time entry)
$timesEntered = 1;
$timestamps = json_encode([$newTimestamp]);

$insertSql = "INSERT INTO std_details (libraryIdNo, patron, lastName, firstName, middleInitial, gender, department, course, major, grade, strand, schoolYear, semester, timesEntered, token, qrCodeURL, qrCodeImage, timestamps, name)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($insertSql);
$stmt->bind_param(
    "ssssssssssssssissss",
    $libraryIdNo,
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
    $timestamps,
    $name
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => "Your data has been saved successfully!",
        "exists" => false,
        "timesEntered" => 1,
        "alertType" => "success"
    ]);
} else {
    echo json_encode([
        "error" => "Failed to save user",
        "alertType" => "error"
    ]);
}

$stmt->close();
$conn->close();
