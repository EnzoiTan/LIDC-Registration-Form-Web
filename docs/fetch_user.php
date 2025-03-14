<?php
$host = "localhost";
$username = "root"; // Default XAMPP user
$password = ""; // Default XAMPP password is empty
$database = "student_datas";

$conn = new mysqli($host, $username, $password, $database);

// Check for database connection errors
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Get the library ID and token from the request
$libraryIdNo = $_GET["libraryIdNo"] ?? "";
$token = $_GET["token"] ?? ""; // Get the token from the URL

// Validate the input parameters
if (!$libraryIdNo) {
    echo json_encode(["error" => "Invalid Library ID", "alertType" => 'error']);
    exit;
}

if (!$token) {
    echo json_encode(["error" => "Token is required", "alertType" => 'error']);
    exit;
}

// Proceed to fetch user data only if both parameters are provided
if ($libraryIdNo && $token) {
    // Prepare the SQL statement to fetch user data based on library ID and token
    $stmt = $conn->prepare("SELECT * FROM std_details WHERE libraryIdNo = ? AND token = ?");
    $stmt->bind_param("ss", $libraryIdNo, $token); // Use "ss" for string parameters
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if user data was found
    if ($row = $result->fetch_assoc()) {
        // Return user data as JSON
        echo json_encode($row);
    } else {
        // If no matching record is found, return an error
        echo json_encode([
            'error' => "User not found!",
            "alertType" => 'error'
        ]);
    }
    $stmt->close();
}

// Close the database connection
$conn->close();
