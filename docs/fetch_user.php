<?php
$host = "localhost";
$username = "root"; // Default XAMPP user
$password = ""; // Default XAMPP password is empty
$database = "student_datas";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$libraryIdNo = $_GET["libraryIdNo"] ?? "";

if ($libraryIdNo) {
    $stmt = $conn->prepare("SELECT * FROM std_details WHERE libraryIdNo = ?");
    $stmt->bind_param("i", $libraryIdNo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode([
            "error" => "❌ User not found!",
            "alertType" => "error",
        ]);
    };
    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid Library ID"]);
}

$conn->close();
