const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  CONFIRMATION: 'confirmation',
  WARNING: 'warning'
};

const style = document.createElement('style');
style.innerHTML = `
  /* Modal Background */
  .custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .auto-gen {
  font-weight: bold;
  font-size: 13px;
}
  /* Modal Content */
  .modal-content {
    background: white;
    padding: 20px;
    margin: 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    width: 320px;
    animation: fadeIn 0.3s ease-in-out;
  }
  /* Checkmark / Error Icon */
  .modal-icon {
    padding: 0;
    margin-bottom: 15px;
  }
  p {
    padding: 0;
  }
  /* Message Text */
  .modal-content p {
    font-size: 16px;
    color: #333;
    margin-bottom: 15px;
    font-weight: bold;
  }
  /* OK Button */
  .modal-button {
    background:rgb(33, 33, 33);
    color: white;
    border: none;
    padding: 8px 30px;
    margin-bottom: 5px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s;
  }
  .modal-button:hover {
    background:rgb(48, 48, 48);
  }
  /* Fade-in Animation */
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  /* Loading Spinner Styles */
  .loading-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 10, 0.8);
    justify-content: center;
    align-items: center;
    z-index: 1001;
  }
  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #8b2c2c;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .small-note {
  font-size: 12px; /* Make text smaller */
  font-family: ariel, sans-serif;
  color: #666; /* Use a slightly faded color */
  display: block;
  margin-top: 10px;
  margin-bottom: 5px;
}

input:disabled, select:disabled {
    color: black; /* Set text color to black */
    background-color: #f0f0f0; /* Light grey background to indicate disabled state */
    opacity: 1; /* Ensure full opacity */
    cursor: not-allowed; /* Change cursor to indicate disabled state */
  }
`;

document.head.appendChild(style);

function showModal(message, type, userData) {
  const modal = document.createElement("div");
  modal.classList.add("custom-modal");

  let iconSrc = '';
  let modalClass = '';

  switch (type) {
    case 'success':
      iconSrc = 'assets/success.png';
      modalClass = 'success';
      break;
    case 'error':
      iconSrc = 'assets/error.png';
      modalClass = 'error';
      break;
    case 'confirmation':
      iconSrc = 'assets/confirmation.jpg';
      modalClass = 'confirmation';
      break;
    case 'warning':
      iconSrc = 'assets/warning.png';
      modalClass = 'warning';
      break;
  }

  modal.innerHTML = `
    <div class="modal-content ${modalClass}">
      <div class="modal-icon">
        <img src="${iconSrc}" alt="${type} icon" style="width: 100px; max-height: 120px; display: block; margin: 0 auto;" />
      </div>
      <p class="message">${message.replace(/\n/g, "<br>")}</p>
      <div class="modal-button-container" id="button-container">
        ${type === 'success' && userData ? '<button class="modal-button" id="download-button">Download ID Card</button>' : ''}
        <button class="modal-button" id="close-button" style="display: none;">Okay</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add event listener for the "Download ID Card" button (only for success with userData)
  if (type === 'success' && userData) {
    const downloadButton = modal.querySelector("#download-button");
    downloadButton.addEventListener("click", () => {
      generateIdCard(userData); // Generate and download the ID card

      // Show the close button after a 3-second delay
      setTimeout(() => {
        const closeButton = modal.querySelector("#close-button");
        closeButton.style.display = "inline-block"; // Show the close button
      }, 3000); // Simulated 3-second delay before showing Close button
    });
  } else {
    // For error, confirmation, and warning types, show the close button immediately
    const closeButton = modal.querySelector("#close-button");
    closeButton.style.display = "inline-block"; // Show the close button immediately
  }

  // Add event listener for the "Okay" button
  const closeButton = modal.querySelector("#close-button");
  closeButton.addEventListener("click", () => {
    modal.remove(); // Close the modal
    if (type === 'error' || type === 'success') {
      location.reload(); // Refresh the page for error or success
    }
  });
}



// Create the loading overlay
const loadingOverlay = document.createElement('div');
loadingOverlay.className = 'loading-overlay';
loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
document.body.appendChild(loadingOverlay);

const departmentCourses = {
  cics: {
    courses: {
      "BS Information System": ["None"],
      "BS Information Technology": ["None"],
    },
  },
  cte: {
    courses: {
      "Bachelor of Elementary Education": ["None"],
      "Bachelor of Technology and Livelihood Education": ["Home Economics", "Industrial Arts", "Information Communications Technology (ICT)"],
      "Bachelor of Secondary Education": ["English", "Mathematics"],
      "Bachelor of Technical Vocational Teacher Education": [
        "Automotive Technology",
        "Civil and Construction Technology",
        "Drafting Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Food and Service Management",
        "Garments, Fashion and Design",
        "Heating, Ventilation and Air Conditioning Technology",
        "Mechanical Technology",
        "Welding and Fabrication Technology",
      ],
      "Professional Education Certificate": ["None"],
    },
  },
  cet: {
    courses: {
      "BS Industrial Technology": [
        "Architectural Drafting Technology",
        "Civil Technology",
        "Food Technology",
        "Garments and Textile Technology",
        "Mechatronics Technology",
        "Power Plant Engineering Technology",
      ],
      "BS Automotive Technology": ["None"],
      "BS Electrical Technology": ["None"],
      "BS Electronics Technology": ["None"],
      "BS Mechanical Technology": ["None"],
      "BS Refrigeration and Air Conditioning Technology": ["None"],
      "BS Computer Technology": ["None"],
      "BS Civil Engineering": ["None"],
      "Bachelor of Industrial Technology": [
        "Automotive Technology",
        "Apparel and Fashion Technology",
        "Architectural Drafting Technology",
        "Culinary Technology",
        "Construction Technology",
        "Computer Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Heating, Ventilation and Air Conditioning Technology",
        "Mechanical Technology",
        "Mechatronics Technology",
        "Power Plant Technology",
      ],
    },
  },
  cahss: {
    courses: {
      "BS Development Communication": ["None"],
      "Bachelor of Fine Arts": ["None"],
      "Batsilyer sa Sining ng Filipino (BATSIFIL)": ["None"],
    },
  },
  sba: {
    courses: {
      "BS Entrepreneurship": ["None"],
      "BS Hospitality Management": ["None"],
    },
  },
  cme: {
    courses: {
      "BS Marine Engineering": ["None"],
    },
  },
  cpes: {
    courses: {
      "Bachelor of Physical Education": ["None"],
      "BS Exercise and Sports Sciences": ["Fitness and Sports Coaching", "Fitness and Sports Management"],
    },
  },
  ite: {
    courses: {
      "Diploma of Technology": [
        "Automotive Engineering Technology",
        "Civil Engineering Technology",
        "Electrical Engineering Technology",
        "Electronics, Communication Technology",
        "Food Production & Services Management Technology",
        "Garments, Fashion & Design Technology",
        "Hospitality Management Technology",
        "Information Technology",
        "Mechanical Engineering Technology",
      ],
      "3-Year Trade Industrial Technical Education": ["Civil Technology", "Mechanical Technology", "Welding & Fabrication Technology"],
      "Associate in Industrial Technology": [
        "Auto Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Food Technology",
        "Garments & Textile Technology",
        "Refrigeration and Air Conditioning Technology",
      ],
      "2-Year Trade Technical Education Curriculum": ["Technical Drafting Technology"],
    },
  },
  shs: {
    courses: {
      "Grade 11": ["None"],
      "Grade 12": ["None"],
    },
  },
  gs: {
    courses: {
      "Doctor of Philosophy": ["Technology Management"],
      "Doctor of Education": ["Educational Administration and Supervision", "Learning and Instruction", "Curriculum Instruction"],
      "Doctor of Technology Education": ["None"],
      "Master of Arts in Teaching Vocational Education": ["Technology and Livelihood Education", "Home Economics"],
      "Master of Arts in Education": ["Educational Administration and Supervision", "Curriculum and Instructional Development", "Mathematics"],
      "Master of Technology Education": ["None"],
    },
  },
};

// DOM Elements for select inputs
const departmentSelect = document.getElementById("department-select");
const courseSelect = document.getElementById("course-select");
const majorSelect = document.getElementById("major-select");
const gradeSelect = document.getElementById("grade-select");
const strandSelect = document.getElementById("strand-select");
const gradeInputDiv = document.querySelector(".grade-input");
const courseInputDiv = document.querySelector(".course-input");
const majorInputDiv = document.querySelector(".major-input");
const strandInputDiv = document.querySelector(".strand-input");
const collegeInputDiv = document.querySelector(".college-input");

departmentSelect.addEventListener("change", () => {
  const selectedDepartment = departmentSelect.value;
  updateCourses(selectedDepartment);
  updateMajors(null);
  if (selectedDepartment === "shs") {
    gradeInputDiv.style.display = "block";
    strandInputDiv.style.display = "block";
    courseInputDiv.style.display = "none";
    majorInputDiv.style.display = "none";
    collegeInputDiv.style.display = "none";
  } else {
    gradeInputDiv.style.display = "none";
    strandInputDiv.style.display = "none";
    courseInputDiv.style.display = "block";
    majorInputDiv.style.display = "block";
    collegeInputDiv.style.display = "block";
  }
});

courseSelect.addEventListener("change", () => {
  const selectedCourse = courseSelect.value;
  const selectedDepartment = departmentSelect.value;
  updateMajors(selectedCourse, selectedDepartment);
});

function updateCourses(department) {
  return new Promise((resolve) => {
    courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
    if (department && departmentCourses[department]) {
      const courses = departmentCourses[department].courses;
      for (const course in courses) {
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseSelect.appendChild(option);
      }
    } else {
      console.warn(`No courses found for department: ${department}`);
    }
    resolve();
  });
}

function updateMajors(course, department) {
  return new Promise((resolve) => {
    majorSelect.innerHTML = '<option value="" disabled selected>Select Major</option>';
    if (course && department && departmentCourses[department]) {
      const majors = departmentCourses[department].courses[course];
      if (majors) {
        majors.forEach((major) => {
          const option = document.createElement("option");
          option.value = major;
          option.textContent = major;
          majorSelect.appendChild(option);
        });
      } else {
        console.warn(`No majors found for course: ${course}`);
      }
    } else {
      console.warn(`Invalid course (${course}) or department (${department}).`);
    }
    resolve();
  });
}

// On DOMContentLoaded, fetch the new library ID for new users
document.addEventListener("DOMContentLoaded", async () => {
  const libraryIdInput = document.getElementById("library-id");
  if (!libraryIdInput) {
    console.error("Library ID input element not found.");
    return;
  }
  try {
    const response = await fetch("http://192.168.0.21:8080/id_number.php");
    const data = await response.json();
    if (data.newLibraryId) {
      libraryIdInput.value = data.newLibraryId;
    } else {
      console.error("Error: Could not fetch new library ID.");
    }
  } catch (error) {
    console.error("Error fetching new library ID:", error);
  }
});

// Function to hide or disable the submit button
function hideSubmitButton() {
  const submitButton = document.querySelector(".submit");
  if (submitButton) {
    submitButton.style.display = 'none'; // Hide the submit button
    // Alternatively, you can disable the button instead of hiding it:
    // submitButton.disabled = true;
  }
}

// Fetch user data if URL parameters exist
document.addEventListener("DOMContentLoaded", async () => {
  const libraryIdInput = document.getElementById("library-id");
  const validUntilInput = document.getElementById("valid-until");
  const patronSelect = document.querySelector('.patron select');
  const schoolSelect = document.querySelector('.school');
  const schoolSelected = document.querySelector('.school select');
  const specifySchoolInput = document.getElementById("specify-school-input");

  if (!libraryIdInput || !validUntilInput || !patronSelect) {
    console.error("One or more required DOM elements are missing.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const libraryIdNo = urlParams.get('libraryIdNo');
  const token = urlParams.get('token');

  // Set the library ID input to the one from the URL initially
  libraryIdInput.value = libraryIdNo || "";

  // Event listener for patron selection
  patronSelect.addEventListener('change', (event) => {
    const patronType = event.target.value;
    console.log("Patron Type Changed:", patronType); // Log the changed patron type
    toggleFields(patronType);
  });

  patronSelect.removeEventListener('change', toggleFields); // Remove existing listener if needed
  patronSelect.addEventListener('change', (event) => {
    toggleFields(event.target.value);
  });

  // Initial toggle for patron type
  const initialPatronType = patronSelect.value;
  toggleFields(initialPatronType);

  // Initial toggle for patron type
  toggleFields(patronSelect.value);

  // Function to toggle specify school input
  const toggleSpecifySchoolInput = () => {
    if (schoolSelected && schoolSelected.value === 'other') {
      specifySchoolInput.style.display = 'block';
    } else {
      specifySchoolInput.style.display = 'none';
    }
  };

  // Event listener for school selection
  schoolSelect.addEventListener('change', toggleSpecifySchoolInput);
  toggleSpecifySchoolInput();

  // Fetch user data if libraryIdNo and token are present
  if (libraryIdNo && token) {
    toggleLoading(true); // Show loading indicator
    try {
      const response = await fetch(`http://192.168.0.21:8080/fetch_user.php?libraryIdNo=${libraryIdNo}&token=${token}`);
      const userData = await response.json();

      if (userData.error) {
        console.error("Error: " + userData.error);
      } else {
        libraryIdInput.value = userData.libraryIdNo;
        validUntilInput.value = userData.validUntil || "July 2025";
        displayUserData(userData);

        disableInputs();

        // Check if patron exists
        if (userData.patron) { // Change this line
          toggleFields(userData.patron); // Use the patron from userData
          console.log("Patron Type:", userData.patron); // Log the patron type
        } else {
          console.warn("Patron Type is missing in user data. Please check the server response.");
          toggleFields("defaultPatronType"); // Handle missing patron type
        }

        // Hide the submit button if user data exists
        // hideSubmitButton();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      toggleLoading(false); // Hide loading indicator
    }
  } else {
    // If no library ID is provided, fetch a new one
    try {
      const response = await fetch("http://192.168.0.21:8080/id_number.php");
      const data = await response.json();
      if (data.newLibraryId) {
        libraryIdInput.value = data.newLibraryId;
      } else {
        console.error("Error: Could not fetch new library ID.");
      }
    } catch (error) {
      console.error("Error fetching new library ID:", error);
    }
  }
});

function disableInputs() {
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach(input => {
    input.disabled = true;
  });
}

// Auto-capitalize name inputs and restrict middle initial to one letter
document.addEventListener("DOMContentLoaded", function () {
  const nameInputs = document.querySelectorAll("input[type='text']");
  const middleInitialInput = document.querySelector(".middle-initial input");
  function toTitleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
  nameInputs.forEach(input => {
    input.addEventListener("input", function () {
      this.value = toTitleCase(this.value);
    });
  });
  middleInitialInput.addEventListener("input", function () {
    this.value = this.value.toUpperCase().charAt(0);
  });
});

// Generate a random token
function generateRandomToken() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 16; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

function toggleLoading(show) {
  loadingOverlay.style.display = show ? 'flex' : 'none';
}

// Updated submit event: now downloads an ID card (with user info and QR code) instead of auto-downloading the QR code
document.querySelector(".submit").addEventListener("click", async (event) => {
  event.preventDefault();
  const submitButton = document.querySelector(".submit");
  submitButton.disabled = true;
  toggleLoading(true);

  const libraryIdInput = document.getElementById("library-id");
  const expectedLibraryId = libraryIdInput.value.trim(); // Get the expected ID

  // Check if the URL has parameters
  const urlParams = new URLSearchParams(window.location.search);
  const libraryIdNoParam = urlParams.get('libraryIdNo');
  const tokenParam = urlParams.get('token');

  // Validate that the library ID is correct only if parameters are present
  if (libraryIdNoParam && tokenParam) {
    if (expectedLibraryId !== libraryIdNoParam) {
      showModal("Error: The library ID does not match the expected ID. Refresh the page and try again.", "confirmation");
      toggleLoading(false);
      submitButton.disabled = false;
      return; // Prevent submission
    }
  }

  try {
    // Collect form data
    const libraryIdInput = document.getElementById("library-id");
    const validUntilInput = document.getElementById("valid-until");
    const patron = document.querySelector(".patron select").value.trim();
    const lastName = document.querySelector(".name-inputs .data-input:nth-child(1) input").value.trim();
    const firstName = document.querySelector(".name-inputs .data-input:nth-child(2) input").value.trim();
    const middleInitial = document.querySelector(".name-inputs .data-input:nth-child(3) input").value.trim();
    const gender = document.querySelector(".gender select").value.trim();
    const department = departmentSelect.value.trim();
    const course = courseSelect.value.trim();
    const major = majorSelect.value.trim();
    const grade = gradeSelect.value.trim();
    const strand = strandSelect.value.trim();
    const schoolYear = document.querySelector(".year-sem-inputs .data-input:nth-child(1) select").value.trim();
    const semester = document.querySelector(".year-sem-inputs .data-input:nth-child(2) select").value.trim();
    let libraryIdNo = libraryIdInput.value.trim();
    const validUntil = validUntilInput.value.trim();
    const collegeSelect = document.querySelector(".data-input.college select").value.trim();
    const schoolSelectField = document.getElementById("school-select").value.trim();
    const specifySchoolInput = document.getElementById("specify-school-input").value.trim();
    const campusDept = document.querySelector(".data-input.campusdept select").value.trim();
    const token = generateRandomToken();
    const qrCodeURL = `http://192.168.0.21:8080/?libraryIdNo=${libraryIdNo}&token=${token}`;
    const qrCodeImage = await generateQRCodeData(qrCodeURL);
    const name = `${lastName}, ${firstName} ${middleInitial}.`.trim();

    const userData = {
      libraryIdNo: expectedLibraryId,
      libraryIdNo,
      validUntil,
      patron,
      lastName,
      firstName,
      middleInitial,
      gender,
      department,
      course: department === "shs" ? "" : course,
      major: department === "shs" ? "" : major,
      grade: department === "shs" ? grade : "",
      strand: department === "shs" ? strand : "",
      schoolYear,
      semester,
      timesEntered: 1,
      token,
      collegeSelect,
      schoolSelect: schoolSelectField,
      specifySchool: schoolSelectField === "other" ? specifySchoolInput : "",
      campusDept,
      qrCodeURL,
      qrCodeImage,
      timestamp: new Date().toISOString(),
      name
    };

    const response = await fetch("http://192.168.0.21:8080/save_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (result.error) {
      showModal(result.error, "error"); // Explicitly set type to 'error'
    } else if (result.alertType === "confirmation") {
      showModal(result.message, "confirmation"); // Explicitly set type to 'confirmation'
    } else if (!result.exists) {
      // Show modal with download button
      showModal(result.success || result.message, "success", userData); // Pass userData to showModal
    } else {
      showModal(result.message, result.alertType || "info");
    }
  } catch (error) {
    console.error("Error storing data:", error);
    showModal("An error occurred while storing the data. Please try again.");
  } finally {
    toggleLoading(false);
    submitButton.disabled = false;
  }
});

// Generate QR Code and return as Base64 data URL (using QRCode library)
async function generateQRCodeData(url) {
  try {
    const qrDataURL = await QRCode.toDataURL(url, {
      width: 256,
      margin: 1,
    });
    return qrDataURL;
  } catch (error) {
    console.error("Error generating QR Code:", error);
    throw error;
  }
}

async function fetchUserData(libraryId, token) {
  toggleLoading(true); // Show loading indicator
  try {
    const response = await fetch(`http://192.168.0.21:8080/fetch_user.php?libraryIdNo=${libraryId}&token=${token}`);
    const data = await response.json();

    if (data.error) {
      showModal(data.error, data.alertType);
    } else {
      const libraryIdInput = document.getElementById("library-id");
      libraryIdInput.value = data.libraryIdNo || libraryId; // Use fetched ID or fallback to URL ID
      displayUserData(data);

      // Automatically submit the user data after fetching
      await submitUserData(data); // Call the submission function here
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    showModal("An error occurred while fetching user data.");
  } finally {
    toggleLoading(false); // Hide loading indicator
  }
}

async function submitUserData(userData) {
  const submitButton = document.querySelector(".submit");
  submitButton.disabled = true;
  toggleLoading(true);

  try {
    const response = await fetch("http://192.168.0.21:8080/save_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (result.error) {
      showModal(result.error, "error");
    } else if (result.alertType === "confirmation") {
      showModal(result.message, "confirmation");
    } else if (!result.exists) {
      showModal(result.success || result.message, "success", userData);
    } else {
      showModal(result.message, result.alertType || "info");
    }
  } catch (error) {
    console.error("Error storing data:", error);
    showModal("An error occurred while storing the data. Please try again.");
  } finally {
    toggleLoading(false);
    submitButton.disabled = false;
  }
}

function toggleFields(patronType) {
  const departmentSelect = document.querySelector('.department-select'); // Ensure this exists
  const selectedDepartment = departmentSelect ? departmentSelect.value : "";

  const departmentInput = document.querySelector('.department-input');
  const courseInput = document.querySelector('.course-input');
  const majorInput = document.querySelector('.major-input');
  const strandInput = document.querySelector('.strand-input');
  const gradeInput = document.querySelector('.grade-input');
  const schoolSelect = document.querySelector('.school');
  const campusDeptInput = document.querySelector('.campusdept');
  const collegeInput = document.querySelector('.college');

  // Hide all inputs initially
  departmentInput.style.display = 'none';
  courseInput.style.display = 'none';
  majorInput.style.display = 'none';
  strandInput.style.display = 'none';
  gradeInput.style.display = 'none';
  schoolSelect.style.display = 'none';
  campusDeptInput.style.display = 'none';
  collegeInput.style.display = 'none';

  // Show fields based on patron type
  if (patronType === "faculty") {
    collegeInput.style.display = 'block';
  } else if (patronType === "admin") {
    campusDeptInput.style.display = 'block';
  } else if (patronType === "visitor") {
    schoolSelect.style.display = 'block';
  } else if (patronType === "student") {
    departmentInput.style.display = 'block';

    if (selectedDepartment === "shs") {  // If department is SHS, show only strand & grade
      strandInput.style.display = 'block';
      gradeInput.style.display = 'block';
    } else {  // If department is college, show course & major
      courseInput.style.display = 'block';
      majorInput.style.display = 'block';
    }
  } else {
    // Default case: Show department, course, and major if patronType doesn't match known values
    departmentInput.style.display = 'block';
    courseInput.style.display = 'block';
    majorInput.style.display = 'block';
  }
}

// Display user data in the form and a summary section
async function displayUserData(userData) {
  const userDataDiv = document.getElementById("user-data");
  if (userData.department) {
    await updateCourses(userData.department);
    document.getElementById("department-select").value = userData.department || "";
    await updateCourses(userData.department);
    document.getElementById("course-select").value = userData.course || "";
    await updateMajors(userData.course, userData.department);
    document.getElementById("major-select").value = userData.major || "";
  }
  document.getElementById("library-id").value = userData.libraryIdNo || "";
  document.getElementById("valid-until").value = userData.validUntil || "";
  document.querySelector(".patron select").value = userData.patron || "";
  document.querySelector(".name-inputs .data-input:nth-child(1) input").value = userData.lastName || "";
  document.querySelector(".name-inputs .data-input:nth-child(2) input").value = userData.firstName || "";
  document.querySelector(".name-inputs .data-input:nth-child(3) input").value = userData.middleInitial || "";
  document.querySelector(".gender select").value = userData.gender || "";
  document.getElementById("grade-select").value = userData.grade || "";
  document.getElementById("strand-select").value = userData.strand || "";
  document.querySelector(".year-sem-inputs .data-input:nth-child(1) select").value = userData.schoolYear || "";
  document.querySelector(".year-sem-inputs .data-input:nth-child(2) select").value = userData.semester || "";

  if (userData.patron === 'faculty') {
    document.getElementById("college-select").value = userData.collegeSelect || "";
  } else if (userData.patron === 'admin') {
    document.getElementById("campusdept-select").value = userData.campusDept || "";
  } else if (userData.patron === 'visitor') {
    document.getElementById("school-select").value = userData.schoolSelect || "";
    if (userData.schoolSelect === 'other') {
      document.getElementById("specify-school-input").value = userData.specifySchool || "";
      document.getElementById("specify-school-input").style.display = "block";
    } else {
      document.getElementById("specify-school-input").style.display = "none";
    }
  }

  userDataDiv.innerHTML = `
    <p>Library ID: ${userData.libraryIdNo}</p>
    <p>Type of Patron: ${userData.patron}</p>
    <p>Name: ${userData.lastName}, ${userData.firstName} ${userData.middleInitial}</p>
    ${userData.department ? `<p>Department: ${userData.department}</p>` : ''}
    ${userData.course ? `<p>Course: ${userData.course}</p>` : ''} 
    ${userData.major ? `<p>Major: ${userData.major}</p>` : ''}
    ${userData.grade ? `<p>Grade: ${userData.grade}</p>` : ''}
    ${userData.strand ? `<p>Strand: ${userData.strand}</p>` : ''}
    <p>School Year: ${userData.schoolYear}</p>
    <p>Semester: ${userData.semester}</p>
    <p>Valid Until: ${userData.validUntil}</p>
    <p>Token: ${userData.token}</p>
    <p>Times Entered: ${userData.timesEntered}</p>
    ${userData.collegeSelect ? `<p>College: ${userData.collegeSelect}</p>` : ''}
    ${userData.schoolSelect ? `<p>School: ${userData.schoolSelect}</p>` : ''}
    ${userData.specifySchool ? `<p>Specify School: ${userData.specifySchool}</p>` : ''}
    ${userData.campusDept ? `<p>Campus Department: ${userData.campusDept}</p>` : ''}
  `;
  toggleFields(userData.patron);
}

// Handle URL parameters for fetching user data
const urlParams = new URLSearchParams(window.location.search);
const libraryIdNoParam = urlParams.get('libraryIdNo');
const tokenParam = urlParams.get('token');

function onQRCodeScanned(libraryId, token) {
  if (libraryId && token) {
    fetchUserData(libraryId, token);
  } else {
    showModal("Error: Both Library ID and Token are required.", "error");
  }
}

if (libraryIdNoParam && tokenParam) {
  fetchUserData(libraryIdNoParam, tokenParam).then(() => {
    // Optionally, validate token if needed.
  }).catch((error) => {
    console.error("Error fetching document:", error);
  });
} else if (libraryIdNoParam && !tokenParam) {
  // Show error modal if libraryIdNo is present but token is missing
  showModal("Error: Token is required to fetch user data.", "error");
}

// Another auto-fill block (if needed)
document.addEventListener("DOMContentLoaded", async () => {
  const libraryIdInput = document.getElementById("library-id");
  const validUntilInput = document.getElementById("valid-until");
  if (!libraryIdInput || !validUntilInput) {
    console.error("One or more required DOM elements are missing.");
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const libraryIdNo = urlParams.get('libraryIdNo');
  if (libraryIdNo) {
    try {
      const response = await fetch(`http://192.168.0.21:8080/fetch_user.php?libraryIdNo=${libraryIdNo}`);
      const userData = await response.json();
      if (userData.error) {


      } else {
        libraryIdInput.value = userData.libraryIdNo;
        validUntilInput.value = userData.validUntil || "July 2025";
        displayUserData(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    validUntilInput.value = "July 2025";
  }
});