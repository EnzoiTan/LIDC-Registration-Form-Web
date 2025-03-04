<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$username = "root";
$password = "";
$database = "student_datas";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Ensure response is always JSON
header("Content-Type: application/json");

$sql = "SELECT libraryIdNo FROM std_details ORDER BY CAST(libraryIdNo AS UNSIGNED) DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $lastId = strval($row["libraryIdNo"]);
    $numericPart = intval($lastId);
    $newId = str_pad($numericPart + 1, 5, "0", STR_PAD_LEFT);
} else {
    $newId = "00001";
}

// Check if the new ID already exists
$checkSql = "SELECT COUNT(*) as count FROM std_details WHERE libraryIdNo = ?";
$stmt = $conn->prepare($checkSql);
$stmt->bind_param("s", $newId);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

if ($count > 0) {
    $numericPart++;
    $newId = str_pad($numericPart, 5, "0", STR_PAD_LEFT);
}

echo json_encode(["newLibraryId" => strval($newId)]);

$conn->close();
