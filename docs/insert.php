<?php
include 'db.php'; // Connect to the database

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $libraryIdNo = $_POST['libraryIdNo'];
    $validUntil = $_POST['validUntil'];
    $patron = $_POST['patron'];
    $lastName = $_POST['lastName'];
    $firstName = $_POST['firstName'];
    $middleInitial = $_POST['middleInitial'];
    $gender = $_POST['gender'];
    $department = $_POST['department'];
    $course = $_POST['course'];
    $major = $_POST['major'];
    $schoolYear = $_POST['schoolYear'];
    $semester = $_POST['semester'];
    $timestamp = date('Y-m-d H:i:s'); // Capture the current date and time

    // SQL Query to insert data
    $sql = "INSERT INTO std_details (libraryIdNo, validUntil, patron, lastName, firstName, middleInitial, gender, department, course, major, schoolYear, semester, timestamp)
            VALUES ('$libraryIdNo', '$validUntil', '$patron', '$lastName', '$firstName', '$middleInitial', '$gender', '$department', '$course', '$major', '$schoolYear', '$semester', '$timestamp')";

    if ($conn->query($sql) === TRUE) {
        echo "New record added successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
