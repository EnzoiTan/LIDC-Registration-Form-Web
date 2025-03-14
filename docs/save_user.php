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

// Define required fields for each patron type
$requiredFields = [
    'student' => ['libraryIdNo', 'firstName', 'lastName', 'gender', 'department', 'schoolYear', 'semester'],
    'faculty' => ['libraryIdNo', 'firstName', 'lastName', 'gender', 'collegeSelect', 'schoolYear', 'semester'],
    'admin' => ['libraryIdNo', 'firstName', 'lastName', 'gender', 'campusDept', 'schoolYear', 'semester'],
    'visitor' => ['libraryIdNo', 'firstName', 'lastName', 'gender', 'schoolYear', 'semester'],
];

// Ensure SHS students require 'grade' and 'strand', while college students require 'course' and 'major'
$department = strtolower($data['department'] ?? '');
if ($department === "shs") {
    $requiredFields['student'][] = 'grade';
    $requiredFields['student'][] = 'strand';
} else {
    $requiredFields['student'][] = 'course';
    $requiredFields['student'][] = 'major';
}

// Validate patron type
if (!isset($requiredFields[$data['patron']])) {
    echo json_encode([
        'message' => "Please fill out all required fields!",
        "alertType" => 'confirmation'
    ]);
    exit();
}

// Validate required fields for the selected patron type
foreach ($requiredFields[$data['patron']] as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        echo json_encode([
            'message' => "Please fill out all required fields!",
            "alertType" => 'confirmation'
        ]);
        exit();
    }
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

date_default_timezone_set('Asia/Manila'); // Set timezone to Philippine Time
$currentMonth = date('F_Y'); // Example: "March_2025"
$newTimestamp = date('Y-m-d H:i:s'); // Get current timestamp

$collegeSelect = $data['collegeSelect'] ?? '';
$schoolSelect  = $data['schoolSelect'] ?? '';
$specifySchool = ($schoolSelect === 'other') ? $data['specifySchool'] ?? '' : '';
$campusDept    = $data['campusDept'] ?? '';

$name = trim("$lastName, $firstName" . (!empty($middleInitial) ? " $middleInitial" : "")) . (!empty($middleInitial) ? "." : "");

// Define dynamic monthly columns
$timestampsColumn = "timestamps_$currentMonth";
$timesEnteredColumn = "timesEntered_$currentMonth";

// ✅ Add dynamic monthly columns if they don't exist
$addColumnsSQL = "ALTER TABLE std_details 
                   ADD COLUMN IF NOT EXISTS $timestampsColumn TEXT, 
                   ADD COLUMN IF NOT EXISTS $timesEnteredColumn INT DEFAULT 0";
$conn->query($addColumnsSQL);

// ✅ Check if user already exists
$checkSql = "SELECT $timesEnteredColumn, $timestampsColumn FROM std_details WHERE libraryIdNo = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $libraryIdNo);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    // User exists, update `timesEntered`
    $checkStmt->bind_result($existingTimesEntered, $existingTimestamps);
    $checkStmt->fetch();
    $checkStmt->close();

    $newTimesEntered = $existingTimesEntered + 1;

    // Decode timestamps, append new timestamp
    $timestampsArray = !empty($existingTimestamps) ? json_decode($existingTimestamps, true) : [];
    if (!is_array($timestampsArray)) {
        $timestampsArray = [];
    }
    $timestampsArray[] = $newTimestamp;
    $updatedTimestamps = json_encode($timestampsArray);

    // ✅ Update `timesEntered` and `timestamps`
    $updateSql = "UPDATE std_details SET $timesEnteredColumn = ?, $timestampsColumn = ? WHERE libraryIdNo = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("iss", $newTimesEntered, $updatedTimestamps, $libraryIdNo);

    if ($updateStmt->execute()) {
        echo json_encode([
            "exists" => true,
            "timesEntered" => $newTimesEntered,
            "message" => "Good day, $firstName $lastName! Your entry has been recorded.",
            "alertType" => 'success'
        ]);
    } else {
        echo json_encode([
            "message" => "Failed to update user: " . $updateStmt->error,
            "alertType" => 'error'
        ]);
    }

    $updateStmt->close();
    $conn->close();
    exit();
}
$checkStmt->close();

// Check for duplicate entries based on relevant fields
$duplicateCheckSql = "SELECT libraryIdNo FROM std_details WHERE firstName = ? AND lastName = ? AND gender = ? AND department = ? AND course = ? AND major = ? AND grade = ? AND strand = ? AND schoolYear = ? AND semester = ?";
$duplicateCheckStmt = $conn->prepare($duplicateCheckSql);
$duplicateCheckStmt->bind_param("ssssssssss", $firstName, $lastName, $gender, $department, $course, $major, $grade, $strand, $schoolYear, $semester);
$duplicateCheckStmt->execute();
$duplicateCheckStmt->store_result();

if ($duplicateCheckStmt->num_rows > 0) {
    echo json_encode([
        "error" => "Duplicate entry detected. A user with the same details already exists.",
        "alertType" => "error"
    ]);
    $duplicateCheckStmt->close();
    $conn->close();
    exit();
}
$duplicateCheckStmt->close();

// ✅ Insert new user (first-time entry)
$timesEntered = 1;
$timestamps = json_encode([$newTimestamp]);

$insertSql = "INSERT INTO std_details (
    libraryIdNo, validUntil, patron, lastName, firstName, middleInitial, gender, department, course, major, 
    grade, strand, schoolYear, semester, token, collegeSelect, schoolSelect, specifySchool, campusDept, 
    qrCodeURL, qrCodeImage, $timestampsColumn, $timesEnteredColumn, name
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($insertSql);
$stmt->bind_param(
    "ssssssssssssssssssssssis",  // Correct order and types
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
    $token,            // Token should be "s" for string
    $collegeSelect,
    $schoolSelect,
    $specifySchool,
    $campusDept,
    $qrCodeURL,
    $qrCodeImage,
    $timestamps,       // Timestamps should be "s"
    $timesEntered,     // TimesEntered should be "i"
    $name
);


if ($stmt->execute()) {
    echo json_encode([
        "success" => "Your data has been saved successfully!<br><span class='small-note'><b>Note:</b> Your ID card with QR code has been downloaded. Scan your QR code every time you enter the library to record your attendance.</span>",
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
