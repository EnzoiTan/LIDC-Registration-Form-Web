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

// Check if connection is successful
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get raw POST data
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if JSON parsing failed
    if ($data === null) {
        echo json_encode(["error" => "Invalid JSON input"]);
        exit;
    }

    // Log the parsed data for debugging
    file_put_contents($file, print_r($data, true));

    // Extract data with default values for optional fields
    $firstName     = $data['firstName'] ?? '';
    $lastName      = $data['lastName'] ?? '';
    $name          = trim($firstName . ' ' . $lastName);
    $department    = $data['department'] ?? '';
    $libraryIdNo   = $data['libraryIdNo'] ?? '';
    $validUntil    = $data['validUntil'] ?? '';
    $patron        = $data['patron'] ?? '';
    $middleInitial = $data['middleInitial'] ?? '';
    $gender        = $data['gender'] ?? '';
    $course        = $data['course'] ?? '';
    $major         = $data['major'] ?? '';
    $grade         = $data['grade'] ?? '';
    $strand        = $data['strand'] ?? '';
    $schoolYear    = $data['schoolYear'] ?? '';
    $semester      = $data['semester'] ?? '';
    $timesEntered  = $data['timesEntered'] ?? 0;
    $token         = $data['token'] ?? '';

    // For non-student patron types, these fields might be required:
    if ($patron === 'student') {
        // For students, we require name and department (you can add more if needed)
        if (empty($name) || empty($department)) {
            echo json_encode(["error" => "Name and Department are required for students"]);
            exit;
        }
        // Clear fields not applicable to students
        $collegeSelect = '';
        $schoolSelect  = '';
        $specifySchool = '';
        $campusDept    = '';
    } elseif ($patron === 'faculty') {
        // For faculty, require name and collegeSelect
        $collegeSelect = $data['collegeSelect'] ?? '';
        if (empty($name) || empty($collegeSelect)) {
            echo json_encode(["error" => "Name and College/Department are required for faculty"]);
            exit;
        }
        // Set other optional fields to default
        $schoolSelect  = '';
        $specifySchool = '';
        $campusDept    = '';
    } elseif ($patron === 'admin') {
        // For admin, require name and campusDept
        $campusDept = $data['campusDept'] ?? '';
        if (empty($name) || empty($campusDept)) {
            echo json_encode(["error" => "Name and Office are required for admin"]);
            exit;
        }
        // Set other optional fields to default
        $collegeSelect = '';
        $schoolSelect  = '';
        $specifySchool = '';
    } elseif ($patron === 'visitor') {
        // For visitors, require name and schoolSelect
        $schoolSelect = $data['schoolSelect'] ?? '';
        if (empty($name) || empty($schoolSelect)) {
            echo json_encode(["error" => "Name and School are required for visitors"]);
            exit;
        }
        // If schoolSelect is 'other', use specifySchool; otherwise, set empty.
        $specifySchool = ($schoolSelect === 'other') ? ($data['specifySchool'] ?? '') : '';
        // Set other optional fields to default
        $collegeSelect = '';
        $campusDept    = '';
    } else {
        echo json_encode(["error" => "Invalid patron type"]);
        exit;
    }

    // QR Code fields (optional)
    $qrCodeURL   = $data['qrCodeURL'] ?? '';
    $qrCodeImage = $data['qrCodeImage'] ?? '';
    $timestamp   = $data['timestamp'] ?? date('Y-m-d H:i:s');

    // Debug: Log the final values being inserted
    $insertData = [
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
        $collegeSelect,
        $schoolSelect,
        $specifySchool,
        $campusDept,
        $qrCodeURL,
        $qrCodeImage,
        $timestamp,
        $name
    ];
    file_put_contents($file, print_r($insertData, true), FILE_APPEND);

    // Prepare and execute the query (24 columns)
    $stmt = $conn->prepare("INSERT INTO std_details (libraryIdNo, validUntil, patron, lastName, firstName, middleInitial, gender, department, course, major, grade, strand, schoolYear, semester, timesEntered, token, collegeSelect, schoolSelect, specifySchool, campusDept, qrCodeURL, qrCodeImage, timestamp, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    // Format string: 14 s, 1 i, then 9 s => "ssssssssssssssisssssssss"
    $stmt->bind_param(
        "ssssssssssssssisssssssss",
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
        $collegeSelect,
        $schoolSelect,
        $specifySchool,
        $campusDept,
        $qrCodeURL,
        $qrCodeImage,
        $timestamp,
        $name
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => "User saved successfully"]);
    } else {
        echo json_encode(["error" => "Failed to save user: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
