<?php
header("Content-Type: application/json");

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['qrCodeData'])) {
    $qrCodeData = $data['qrCodeData'];

    // Process the QR code data (e.g., save to database, validate, etc.)
    // Example: Check if the QR code data is valid
    if ($qrCodeData === "VALID_QR_CODE") {
        echo json_encode(["success" => true, "message" => "QR code processed successfully."]);
    } else {
        echo json_encode(["success" => false, "error" => "Invalid QR code."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "No QR code data provided."]);
}
