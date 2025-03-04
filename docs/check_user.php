<?php
// Code to check if user exists
$libraryIdNo = $_GET['libraryIdNo'];
$token = $_GET['token'];

// Database connection and query to check user existence
$query = "SELECT * FROM std_details WHERE libraryIdNo = ? AND token = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $libraryIdNo, $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $userData = $result->fetch_assoc();
    echo json_encode(["exists" => true, "timesEntered" => $userData['timesEntered'], "token" => $userData['token']]);
} else {
    echo json_encode(["exists" => false]);
}
