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
  leftSection.style.width = '75%';
  leftSection.style.padding = '14px';

  let additionalInfo = "";

  if (userData.patron === "student") {
    if (userData.collegeSelect) {
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
    additionalInfo = `<p><strong>Department:</strong> ${userData.collegeSelect.toUpperCase()}</p>`;
  } else if (userData.patron === "admin") {
    additionalInfo = `<p><strong>Office:</strong> ${userData.campusDept.toUpperCase()}</p>`;
  } else if (userData.patron === "visitor") {
    additionalInfo = `<p><strong>School:</strong> ${userData.schoolSelect.toUpperCase() || userData.specifySchool.toUpperCase()}</p>`;
  }

  leftSection.innerHTML = `
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
        <p><strong>Name:</strong> ${userData.lastName}, ${userData.firstName} ${userData.middleInitial || ''}.</p>
        ${additionalInfo}
        <p><strong>Semester:</strong> ${formatSemester(userData.semester)}</p>
      </div>
    </div>
    
    <p style="margin-top: 8px; font-size: 14px; font-family: 'Poppins', sans-serif;"><strong>ID Number:</strong></p>
    <p style="font-weight: bold; font-size: 18px; color: #8B0000; font-family: 'Poppins', sans-serif;">${userData.libraryIdNo}</p>
  `;

  function convertToAcronym(course) {
    const acronyms = {
      "BS Information Technology": "BSIT",
      "Bachelor of Science in Computer Science": "BSCS",
      "BS Information System": "BSIS",
      "Bachelor of Science in Electronics Engineering": "BSECE",
      "Bachelor of Science in Electrical Engineering": "BSEE",
      "Bachelor of Science in Mechanical Engineering": "BSME",
      "Bachelor of Science in Civil Engineering": "BSCE",
    };
    return acronyms[course] || course;
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

  // Increase the scaling factor for high resolution (DPI)
  const scaleFactor = 4;

  html2canvas(idCard, {
    backgroundColor: null,
    scale: scaleFactor,
    useCORS: true
  }).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL("image/png", 1.0);
    link.download = `${userData.libraryIdNo}_id_card.png`;
    link.click();
    document.body.removeChild(idCard);
  }).catch(err => {
    console.error("Error generating high-quality ID card image:", err);
  });
}
