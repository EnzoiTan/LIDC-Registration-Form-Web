<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$username = "root"; // XAMPP default
$password = "";
$database = "student_datas"; // Change this

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Ensure response is always JSON
header("Content-Type: application/json");

// Fetch the latest Library ID
$sql = "SELECT libraryIdNo FROM std_details ORDER BY libraryIdNo DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $lastId = intval($row["libraryIdNo"]);
    $numericPart = intval($lastId); // Convert to int (removes leading zeros)
    $newId = str_pad($numericPart + 1, 5, "0", STR_PAD_LEFT);
} else {
    $newId = "00001"; // Default first ID
}

echo json_encode(["newLibraryId" => $newId]);

$conn->close();
