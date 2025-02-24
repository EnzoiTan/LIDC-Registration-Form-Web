function downloadIdCard(userData) {
    // Create a container for the ID card
    const idCard = document.createElement('div');
    idCard.style.width = '400px';
    idCard.style.border = '2px solid #333';
    idCard.style.padding = '20px';
    idCard.style.margin = '20px auto';
    idCard.style.fontFamily = 'Arial, sans-serif';
    idCard.style.backgroundColor = '#fff';
    idCard.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

    // Build the inner HTML for the ID card
    idCard.innerHTML = `
      <h2 style="text-align: center;">User ID Card</h2>
      <p><strong>Library ID:</strong> ${userData.libraryIdNo}</p>
      <p><strong>Name:</strong> ${userData.lastName}, ${userData.firstName} ${userData.middleInitial}</p>
      <p><strong>Patron:</strong> ${userData.patron}</p>
      <p><strong>Department:</strong> ${userData.department || '---'}</p>
      <p><strong>Course:</strong> ${userData.course || '---'}</p>
      <p><strong>Major:</strong> ${userData.major || '---'}</p>
      <p><strong>Grade:</strong> ${userData.grade || '---'}</p>
      <p><strong>Strand:</strong> ${userData.strand || '---'}</p>
      <p><strong>School Year:</strong> ${userData.schoolYear}</p>
      <p><strong>Semester:</strong> ${userData.semester}</p>
      <p><strong>Valid Until:</strong> ${userData.validUntil}</p>
      <div style="text-align:center; margin-top:15px;">
        <img src="${userData.qrCodeImage}" alt="QR Code" style="width:100px;height:100px;" />
      </div>
    `;

    // Position the ID card off-screen for rendering
    idCard.style.position = 'fixed';
    idCard.style.top = '-10000px';
    document.body.appendChild(idCard);

    // Convert the ID card element to a canvas image using html2canvas
    html2canvas(idCard).then(canvas => {
        // Create a download link from the canvas data
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = `${userData.libraryIdNo}_id_card.png`;
        link.click();
        // Clean up: remove the off-screen element
        document.body.removeChild(idCard);
    }).catch(err => {
        console.error("Error generating ID card image:", err);
    });
}