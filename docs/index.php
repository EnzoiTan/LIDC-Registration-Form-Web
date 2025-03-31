<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="css/index.css" />
  <link rel="icon" href="LCC-logo.png" type="image/x-icon" />

  <title>ZPPSU Library Users Registration Form</title>

  <script src="js/html2canvas.min.js"></script>
  <script src="js/jquery.min.js"></script>
  <script src="js/qrcode.min.js"></script>
</head>

<body>
  <div class="container">
    <div class="lidc-title">
      <div class="logo-zppsu">
        <div class="logos">
          <img src="zppsu-logo.png" alt="" />
          <img src="LCC-logo.png" class="zpps" alt="" />
        </div>
        <div>
          <p class="title">
            Zamboanga Peninsula Polytechnic State University
          </p>
          <p>LIBRARY USERS</p>
          <span>Registration Form</span>
        </div>
      </div>
    </div>
    <form id="userForm" onsubmit="return confirmSubmission(event)" action=" insert.php" method="POST">
      <div class="data-input patron">
        <p>Type of Patron<span>*</span></p>
        <select required>
          <option value="" disabled selected class="select-option">Select Type of Patron</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
          <option value="visitor">Visitor</option>
        </select>
      </div>

      <div class="name-inputs">
        <div class="data-input">
          <p>Last Name<span>*</span></p>
          <input type="text" required />
        </div>
        <div class="data-input">
          <p>First Name<span>*</span></p>
          <input type="text" required />
        </div>
        <div class="data-input middle-initial">
          <p>M.I.</p>
          <input type="text" />
        </div>
        <div class="data-input gender">
          <p>Gender<span>*</span></p>
          <select required>
            <option value="" disabled selected class="select-option">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div class="course-year-inputs">
        <div class="data-input department-input">
          <p>Department<span>*</span></p>
          <select id="department-select" required>
            <option value="" disabled selected class="select-option">Select Department</option>
            <option value="cics">College of Information in Computing Sciences (CICS)</option>
            <option value="cte">College of Teacher Education (CTE)</option>
            <option value="cet" data-college="true">College of Engineering and Technology (CET)</option>
            <option value="cahss" data-college="true">College of Arts, Humanities and Social Sciences (CAHSS)</option>
            <option value="sba">School of Business Administration (SBA)</option>
            <option value="cme" data-college="true">College of Marine Education (CME)</option>
            <option value="cpes">College of Physical Education and Sport (CPES)</option>
            <option value="ite">Institute of Technical Education (ITE)</option>
            <option value="shs">Senior High School (SHS)</option>
            <option value="gs">Graduate School</option>
          </select>
        </div>
        <div class="data-input course-input">
          <p>Course<span>*</span></p>
          <select id="course-select" required>
            <option value="" disabled selected>Select Course</option>
          </select>
        </div>
        <div class="data-input major-input">
          <p>Major<span>*</span></p>
          <select id="major-select" required>
            <option value="" disabled selected>Select Major</option>
          </select>
        </div>

        <div class="data-input strand-input" style="display: none">
          <p>Strand<span>*</span></p>
          <select id="strand-select" required>
            <option value="" disabled selected>Select Strand</option>
            <option value="GAS">GAS</option>
            <option value="STEM">STEM</option>
            <option value="TVL">TVL</option>
          </select>
        </div>

        <div class="data-input grade-input" style="display: none">
          <p>Grade<span>*</span></p>
          <select id="grade-select" required>
            <option value="" disabled selected>Select Grade</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
        </div>

        <div class="data-input school" style="display: none">
          <p>School<span>*</span></p>
          <select id="school-select">
            <option value="" disabled selected>Select School</option>
            <option value="wmsu">Western Mindanao State University</option>
            <option value="zscmst">Zamboanga State College of Marine Sciences and Technology</option>
            <option value="uz">Universidad de Zamboanga</option>
            <option value="other">Other</option>
          </select>
          <input type="text" id="specify-school-input" style="display: none; margin-top: 10px" placeholder="Specify School" />
        </div>

        <div class="data-input campusdept" style="display: none">
          <p>Office<span>*</span></p>
          <select id="campusdept-select" required>
            <option value="" disabled selected>Select Office</option>
            <option value="University Registrar">University Registrar</option>
            <option value="Alumni">Alumni</option>
            <option value="Medical and Dental Clinic">Medical and Dental Clinic</option>
            <option value="Cashier">Cashier</option>
            <option value="Office and the Vice President for Student Affairs">Office and the Vice President for Student Affairs</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>

        <div class="data-input college" style="display: none">
          <p>College/Department<span>*</span></p>
          <select id="college-select" required>
            <option value="" disabled selected class="select-option">Select College/Department</option>
            <option value="cics">College of Information in Computing Sciences (CICS)</option>
            <option value="cte">College of Teacher Education (CTE)</option>
            <option value="cet">College of Engineering and Technology (CET)</option>
            <option value="cahss">College of Arts, Humanities and Social Sciences (CAHSS)</option>
            <option value="sba">School of Business Administration (SBA)</option>
            <option value="cme">College of Marine Education (CME)</option>
            <option value="cpes">College of Physical Education and Sport (CPES)</option>
            <option value="ite">Institute of Technical Education (ITE)</option>
            <option value="shs">Senior High School (SHS)</option>
            <option value="gs">Graduate School</option>
          </select>
        </div>
      </div>

      <div class="year-sem-inputs">
        <div class="data-input">
          <p>School Year<span>*</span></p>
          <select id="year-select" required>
            <option value="" disabled selected class="select-option">Select S.Y.</option>
            <option value="2024-2025">2024 - 2025</option>
            <option value="2025-2026">2025 - 2026</option>
            <option value="2026-2027">2026 - 2027</option>
            <option value="2027-2028">2027 - 2028</option>
          </select>
        </div>
        <div class="data-input">
          <p>Semester<span>*</span></p>
          <select id="semester-select" required>
            <option value="" disabled selected class="select-option">Select Sem</option>
            <option value="first-semester">First Semester</option>
            <option value="second-semester">Second Semester</option>
          </select>
        </div>
      </div>

      <div class="generate-data" style="display: none">
        <div class="data-input">
          <p>ID Number <span class="auto-gen">(Auto-filled by System)</span></p>
          <div class="input-wrapper">
            <input type="text" id="library-id" readonly required />
          </div>
        </div>
        <div class="data-input">
          <p>Valid Until <span class="auto-gen">(Auto-filled by System)</span></p>
          <div class="input-wrapper">
            <input type="text" id="valid-until" readonly required />
          </div>
        </div>
      </div>

      <div id="user-data" style="display: none"></div>
      <button type="submit" class="submit">Submit</button>
      <input type="text" id="qr-input" placeholder="Scan QR Code" autofocus />
    </form>

    <script src="js/qrcode.min.js"></script>
    <script type="module" src="index.js" defer></script>
    <script src="lidc.js" defer></script>
</body>

</html>