/* Remove Firebase imports – we no longer use Firebase */

// CSS for modal and loading spinner
const style = document.createElement('style');
style.innerHTML = `
  /* Modal Styles */
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    font-size: 1.1em;
    max-width: 500px;
    width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  #modal-close {
    margin-top: 20px;
    padding: 6px 20px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  #modal-close:hover {
    background: #2980b9;
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
`;
document.head.appendChild(style);

// Create the modal
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
  <div class="modal-content">
    <p id="modal-message"></p>
    <button id="modal-close">OK</button>
  </div>
`;
document.body.appendChild(modal);

// Create the loading overlay
const loadingOverlay = document.createElement('div');
loadingOverlay.className = 'loading-overlay';
loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
document.body.appendChild(loadingOverlay);

// The departmentCourses object remains unchanged
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
      "Bachelor of Technical Vocational Education": [
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

// DOM Elements
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
  updateMajors(null); // Clear majors

  if (selectedDepartment === "shs") {
    gradeInputDiv.style.display = "block";
    strandInputDiv.style.display = "block";
    courseInputDiv.style.display = "none";
    majorInputDiv.style.display = "none";
    collegeInputDiv.style.display = "none"; // Hide college input for SHS
  } else {
    gradeInputDiv.style.display = "none";
    strandInputDiv.style.display = "none";
    courseInputDiv.style.display = "block";
    majorInputDiv.style.display = "block";
    collegeInputDiv.style.display = "block"; // Show college input for non-SHS
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

// Replace Firebase data fetching with AJAX calls to PHP endpoints
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
  const libraryIdNo = urlParams.get('libraryIdNo'); // Get ID from URL if available

  // Event listener for when patron type is changed
  document.querySelector('.patron select').addEventListener('change', (event) => {
    toggleFields(event.target.value);
  });

  // Initialize fields based on default patron type
  if (patronSelect) {
    toggleFields(patronSelect.value);
  }

  const toggleSpecifySchoolInput = () => {
    if (schoolSelected && schoolSelected.value === 'other') {
      specifySchoolInput.style.display = 'block';
    } else {
      specifySchoolInput.style.display = 'none';
    }
  };

  schoolSelect.addEventListener('change', toggleSpecifySchoolInput);
  toggleSpecifySchoolInput();

  if (libraryIdNo) {
    // Fetch user data from XAMPP (PHP/MySQL)
    try {
      const response = await fetch(`http://192.168.0.20:8080/fetch_user.php?libraryIdNo=${libraryIdNo}`);
      const userData = await response.json();
      if (userData.error) {
        console.error("Error: " + userData.error);
        alert("User not found.");
      } else {
        libraryIdInput.value = userData.libraryIdNo;
        validUntilInput.value = userData.validUntil || "July 2025";
        displayUserData(userData);
        toggleFields(userData.patronType);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    validUntilInput.value = "July 2025";
  }
});

// Generate Random Token remains the same
function generateRandomToken() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 16; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

function showModal(message) {
  const modalMessage = document.getElementById('modal-message');
  modalMessage.textContent = message;
  modal.style.display = 'flex';
}

document.getElementById('modal-close').addEventListener('click', () => {
  modal.style.display = 'none';
});

function toggleLoading(show) {
  loadingOverlay.style.display = show ? 'flex' : 'none';
}

// Submit event listener now calls the PHP endpoint to save data
document.querySelector(".submit").addEventListener("click", async (event) => {
  event.preventDefault();

  const submitButton = document.querySelector(".submit");
  submitButton.disabled = true;
  toggleLoading(true);

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

    const libraryIdNo = libraryIdInput.value.trim();
    const validUntil = validUntilInput.value.trim();

    // Additional admin-related data
    const collegeSelect = document.querySelector(".data-input.college select").value.trim();
    const schoolSelect = document.getElementById("school-select").value.trim();
    const specifySchoolInput = document.getElementById("specify-school-input").value.trim();
    const campusDept = document.querySelector(".data-input.campusdept select").value.trim();

    // Prepare the data object
    const userData = {
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
      token: generateRandomToken(),
      timestamp: new Date(),
      collegeSelect,
      schoolSelect,
      specifySchool: schoolSelect === "other" ? specifySchoolInput : "",
      campusDept,
      entryTimestamps: [new Date()],
    };

    // Send the data to the PHP endpoint
    const response = await fetch("http://localhost:3000/docs/save_user.php", {
      method: "POST", // Make sure method is POST
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData) // Convert data to JSON
    });
    const result = await response.json();
    if (result.error) {
      showModal(result.error);
    } else {
      showModal(result.message);
      if (result.qrCodeURL) {
        // Optionally handle QR Code URL (download or display)
        console.log("QR Code URL:", result.qrCodeURL);
      }
    }
  } catch (error) {
    console.error("Error storing data:", error);
    showModal("An error occurred while storing the data. Please try again.");
  } finally {
    toggleLoading(false);
    submitButton.disabled = false;
  }
});

// Show/hide "Specify School" input field when "Other" is selected
document.getElementById("school-select").addEventListener("change", (event) => {
  const specifySchoolInput = document.getElementById("specify-school-input");
  if (event.target.value === "other") {
    specifySchoolInput.style.display = "block";
  } else {
    specifySchoolInput.style.display = "none";
  }
});

// Generate QR Code and return as Base64 data URL remains unchanged
async function generateQRCodeData(data) {
  try {
    const qrDataURL = await QRCode.toDataURL(JSON.stringify(data), {
      width: 256,
      margin: 1,
    });
    return qrDataURL;
  } catch (error) {
    console.error("Error generating QR Code:", error);
    throw error;
  }
}

// Auto-download the QR Code
function downloadQRCode(dataURL, filename) {
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = filename;
  link.click();
}

// Fetch user data function using PHP endpoint
async function fetchUserData(libraryId) {
  toggleLoading(true);
  try {
    const response = await fetch(`http://192.168.0.20:8080/fetch_user.php?libraryIdNo=${libraryId}`);
    const data = await response.json();
    if (data.error) {
      showModal(data.error);
    } else {
      displayUserData(data);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    showModal("An error occurred while fetching user data.");
  } finally {
    toggleLoading(false);
  }
}

// Toggle field visibility based on patron type (unchanged)
function toggleFields(patronType) {
  const departmentInput = document.querySelector('.department-input');
  const courseInput = document.querySelector('.course-input');
  const majorInput = document.querySelector('.major-input');
  const strandInput = document.querySelector('.strand-input');
  const gradeInput = document.querySelector('.grade-input');
  const schoolSelect = document.querySelector('.school');
  const campusDeptInput = document.querySelector('.campusdept');
  const collegeInput = document.querySelector('.college');

  // Hide all fields initially
  departmentInput.style.display = 'none';
  courseInput.style.display = 'none';
  majorInput.style.display = 'none';
  strandInput.style.display = 'none';
  gradeInput.style.display = 'none';
  schoolSelect.style.display = 'none';
  campusDeptInput.style.display = 'none';
  collegeInput.style.display = 'none';

  // Show fields based on patron type
  switch (patronType) {
    case 'faculty':
      collegeInput.style.display = 'block';
      break;
    case 'admin':
      campusDeptInput.style.display = 'block';
      break;
    case 'visitor':
      schoolSelect.style.display = 'block';
      break;
    default:
      departmentInput.style.display = 'block';
      courseInput.style.display = 'block';
      majorInput.style.display = 'block';
      break;
  }
}

async function displayUserData(userData) {
  const userDataDiv = document.getElementById("user-data");

  // Populate dynamic select fields if user data exists
  if (userData.department) {
    await updateCourses(userData.department);
    document.getElementById("course-select").value = userData.course || "";
    await updateMajors(userData.course, userData.department);
    document.getElementById("major-select").value = userData.major || "";
  }

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

  // Dynamically display the user data
  userDataDiv.innerHTML = `
    <p>Library ID: ${userData.libraryIdNo}</p>
    <p>Type of Patron: ${userData.patron}</p>
    <p>Name: ${userData.firstName} ${userData.middleInitial} ${userData.lastName}</p>
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

  // Adjust field visibility
  toggleFields(userData.patron);
}

// Handle URL parameters for fetching user data
const urlParams = new URLSearchParams(window.location.search);
const libraryIdNoParam = urlParams.get('libraryIdNo');
const tokenParam = urlParams.get('token');

if (libraryIdNoParam && tokenParam) {
  fetchUserData(libraryIdNoParam).then(() => {
    // Optionally, after fetching, you could validate the token here if needed.
  }).catch((error) => {
    console.error("Error fetching document:", error);
  });
}

// Another DOMContentLoaded block for auto-filling (if needed)
// [This block might be redundant with the earlier one—ensure you adjust as needed]
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
      const response = await fetch(`http://192.168.0.20:8080/fetch_user.php?libraryIdNo=${libraryIdNo}`);
      const userData = await response.json();
      if (userData.error) {
        console.error("Error: " + userData.error);
        alert("User not found.");
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
