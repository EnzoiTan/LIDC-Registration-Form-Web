function generateIdCard(userData) {
  const idCard = document.createElement('div');
  idCard.style.cssText = `
    width: 550px;
    height: 320px;
    display: flex;
    background: white;
    border-radius: 10px;
    position: relative;
    font-family: Georgia, serif;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    border: 3px solid black;
    overflow: hidden;
  `;

  const leftSection = document.createElement('div');
  leftSection.style.cssText = `
    width: 75%;
    padding: 14px;
    position: relative;
  `;

  // 🔹 Use <img> instead of background-image for sharper rendering
  const bgImage = new Image();
  bgImage.src = "assets/bg.jpg";
  bgImage.style.cssText = `
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    object-fit: cover; /* Ensures it scales properly */
    image-rendering: pixelated; /* Helps prevent blur */
  `;
  leftSection.appendChild(bgImage);

  let additionalInfo = "";

  const departmentSynonym = convertToFullName(userData.collegeSelect.toLowerCase());

  if (userData.patron === "student") {
    if (userData.course) {
      additionalInfo = `
        <p><strong>Department:</strong> ${userData.department.toUpperCase()}</p>
        <p><strong>Course:</strong> ${convertToAcronym(userData.course)}</p>
        <p><strong>Major:</strong> ${userData.major || 'N/A'}</p>
      `;
    } else {
      additionalInfo = `
        <p><strong>Department:</strong> ${userData.department.toUpperCase()}</p>
        <p><strong>Strand:</strong> ${userData.strand || 'N/A'}</p>
        <p><strong>Grade:</strong> ${userData.grade || 'N/A'}</p>
      `;
    }
  } else if (userData.patron === "faculty") {
    additionalInfo = `<p><strong>Department:</strong> ${departmentSynonym}</p>`;
  } else if (userData.patron === "admin") {
    additionalInfo = `<p><strong>Office:</strong> ${userData.campusDept}</p>`;
  } else if (userData.patron === "visitor") {
    let schoolName = userData.schoolSelect.toLowerCase() === "other"
      ? userData.specifySchool.toUpperCase()
      : convertToSynonym(userData.schoolSelect);

    additionalInfo = `<p><strong>School:</strong> ${schoolName}</p>`;
  }


  leftSection.innerHTML += `
    <p style="font-size: 13px; text-align: center; font-weight: bold; color: #8B0000; text-transform: uppercase;">
      Zamboanga Peninsula Polytechnic State University
    </p>
    <p style="font-size: 12px; text-align: center; font-weight: bold; letter-spacing: 1px">LEARNING COMMONS CENTER</p>
    <p style="text-align: center; font-size: 10px; margin-bottom: 10px">R.T. Lim Blvd., Baliwasan, Zamboanga City</p>
    <p style="text-align: center; font-size: 16px; font-weight: bold; color: #8B0000;">LIBRARY ID CARD</p>
    <p style="text-align: center; font-size: 13px; margin-bottom: 10px"><strong>S.Y.: 2024 - 2025</strong></p>
    
    <div style="display: flex; align-items: center; font-family: 'Poppins', sans-serif;">
      <div style="width: 125px; height: 125px; background-color: #ccc; margin-right: 10px; flex-shrink: 0; min-width: 125px; min-height: 125px;"></div>
      <div>
        <p><strong>Name:</strong> ${userData.lastName}, ${userData.firstName}${userData.middleInitial ? ' ' + userData.middleInitial + '.' : ''}</p>
        ${additionalInfo}
        <p><strong>Semester:</strong> ${formatSemester(userData.semester)}</p>
      </div>
    </div>
    
    <p style="margin-top: 8px; font-size: 14px; font-family: 'Poppins', sans-serif;"><strong>ID Number:</strong></p>
    <p style="font-weight: bold; font-size: 18px; color: #8B0000; font-family: 'Poppins', sans-serif;">${userData.libraryIdNo}</p>
  `;

  function convertToAcronym(course) {
    const acronyms = {
      "BS Information Technology": "BSInfoTech",
      "BS Information System": "BSIS",
      "Bachelor of Science in Computer Science": "BSCS",
      "Bachelor of Science in Electronics Engineering": "BSECE",
      "Bachelor of Science in Electrical Engineering": "BSEE",
      "Bachelor of Science in Mechanical Engineering": "BSME",
      "Bachelor of Science in Civil Engineering": "BSCE",
      "BS Industrial Technology": "BSIndTech",
      "BS Automotive Technology": "BSAT",
      "BS Electrical Technology": "BSET",
      "BS Electronics Technology": "BSElexT",
      "BS Mechanical Technology": "BSMT",
      "BS Refrigeration and Air Conditioning Technology": "BSRACT",
      "BS Computer Technology": "BSCompTech",
      "Bachelor of Industrial Technology": "BSIT",
      "BS Development Communication": "BSDevCom",
      "Bachelor of Fine Arts": "BFA",
      "Batsilyer sa Sining ng Filipino (BATSIFIL)": "BATSIFIL",
      "BS Entrepreneurship": "BSEntrep",
      "BS Hospitality Management": "BSHM",
      "BS Marine Engineering": "BSMarE",
      "Bachelor of Physical Education": "BPED",
      "BS Exercise and Sports Sciences": "BSESS",
      "Bachelor of Elementary Education": "BEED",
      "Bachelor of Technology and Livelihood Education": "BTLED",
      "Bachelor of Secondary Education": "BSED",
      "Bachelor of Technical Vocational Teacher Education": "BTVTED",
      "Professional Education Certificate": "PEC",
      "Diploma of Technology": "DT",
      "3-Year Trade Industrial Technical Education": "TITE",
      "Associate in Industrial Technology": "AIT",
    };

    return acronyms[course] || course;
  }

  function convertToFullName(acronym) {
    const acronymToFullName = {
      "cics": "College of Information in Computing Sciences",
      "cte": "College of Teacher Education",
      "cet": "College of Engineering and Technology",
      "cahss": "College of Arts, Humanities and Social Sciences",
      "sba": "School of Business Administration",
      "cme": "College of Marine Education",
      "cpes": "College of Physical Education and Sport",
      "ite": "Institute of Technical Education",
      "shs": "Senior High School",
      "gs": "Graduate School"
    };

    return acronymToFullName[acronym.toLowerCase()] || acronym; // Convert input to lowercase before lookup
  }

  function convertToSynonym(schoolSelect) {
    const synonyms = {
      "uz": "Universidad de Zamboanga",
      "wmsu": "Western Mindanao State University",
      "zscmst": "Zamboanga State College of Marine Sciences and Technology",
    };
    return synonyms[schoolSelect] || schoolSelect;
  }

  function formatSemester(semester) {
    if (semester.includes("first-semester")) return "1st Sem";
    if (semester.includes("second-semester")) return "2nd Sem";
    return semester;
  }

  const logo = document.createElement('img');
  logo.src = 'assets/lcc.png';
  logo.style.width = '75px';
  logo.style.height = '80px';
  logo.style.marginBottom = '10px';

  const rightSection = document.createElement('div');
  rightSection.style.cssText = `
    width: 25%;
    background: #8B0000;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 10px;
    position: relative;
  `;

  const validity = document.createElement('p');
  validity.textContent = `ID Validity: ${userData.validUntil}`;
  validity.style.fontSize = '12px';
  validity.style.marginTop = '50px';
  validity.style.textAlign = 'center';
  validity.style.fontFamily = 'Poppins';

  const qrImage = document.createElement('img');
  qrImage.src = userData.qrCodeImage;
  qrImage.style.width = '120px';
  qrImage.style.height = '120px';
  qrImage.style.backgroundColor = 'white';
  qrImage.style.padding = '5px';
  qrImage.style.borderRadius = '5px';

  rightSection.appendChild(logo);
  rightSection.appendChild(qrImage);
  rightSection.appendChild(validity);

  idCard.appendChild(leftSection);
  idCard.appendChild(rightSection);

  idCard.style.position = 'fixed';
  idCard.style.top = '-10000px';
  document.body.appendChild(idCard);

  // 🔹 Increase scaleFactor for higher resolution
  const scaleFactor = 5;

  function downloadIDCard(dataURL, filename) {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    link.click();
  }

  bgImage.onload = function () {
    html2canvas(idCard, {
      backgroundColor: null,
      scale: scaleFactor,
      useCORS: true
    })
      .then(canvas => {
        const idCardDataURL = canvas.toDataURL("image/png", 1.0);

        // Auto-download the ID card
        downloadIDCard(idCardDataURL, `${userData.libraryIdNo}_id_card.png`);

        // Clean up the ID card element after download
        document.body.removeChild(idCard);
      })
      .catch(err => {
        console.error("Error generating high-quality ID card image:", err);
      });
  };
}
