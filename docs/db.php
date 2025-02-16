<?php
$host = "localhost";  // Your database host (usually "localhost" for XAMPP)
$user = "root";       // Your MySQL username (default is "root" in XAMPP)
$pass = "";           // Your MySQL password (leave empty if no password)
$dbname = "student_datas";  // Your database name

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
