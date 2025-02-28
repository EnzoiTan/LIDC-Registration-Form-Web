function downloadIdCard(userData) {
const idCardContainer = document.createElement('div');
idCardContainer.id = 'id-card-container';
idCardContainer.style.textAlign = 'center';

const idCard = document.createElement('div');
idCard.id = 'id-card';
idCard.style.width = '600px';
idCard.style.height = '350px';
idCard.style.display = 'flex';
idCard.style.background = '#fff';
idCard.style.borderRadius = '10px';
idCard.style.padding = '15px';
idCard.style.position = 'relative';
idCard.style.fontSize = '14px';
idCard.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
idCard.style.border = '3px solid black';

const leftSection = document.createElement('div');
leftSection.style.width = '70%';
leftSection.style.padding = '15px';
leftSection.style.textAlign = 'left';
leftSection.innerHTML = `
<p style="font-size: 14px; font-weight: bold; color: #8B0000; text-transform: uppercase;">
    Zamboanga Peninsula Polytechnic State University
</p>
<p>R.T. LIM BLVD., BALIWASAN RD., ZAMBOANGA CITY</p>
<p style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">LIBRARY IDENTIFICATION CARD</p>
<p><strong>Name:</strong> ${userData.firstName} ${userData.middleInitial}. ${userData.lastName}</p>
<p><strong>Department:</strong> ${userData.department}</p>
<p><strong>Course:</strong> ${userData.course}</p>
<p><strong>Major:</strong> ${userData.major}</p>
<p><strong>Semester:</strong> ${userData.semester}</p>
<p><strong>Student No.:</strong> ${userData.libraryIdNo}</p>
`;

const rightSection = document.createElement('div');
rightSection.style.width = '30%';
rightSection.style.background = '#8B0000';
rightSection.style.color = 'white';
rightSection.style.display = 'flex';
rightSection.style.flexDirection = 'column';
rightSection.style.alignItems = 'center';
rightSection.style.justifyContent = 'center';
rightSection.style.borderTopRightRadius = '10px';
rightSection.style.borderBottomRightRadius = '10px';
rightSection.style.padding = '15px';

const qrImage = document.createElement('img');
qrImage.src = userData.qrCodeImage;
qrImage.style.width = '100px';
qrImage.style.height = '100px';
qrImage.className = 'qr-code';

const validity = document.createElement('p');
validity.textContent = `ID Validity: ${userData.validUntil}`;

rightSection.appendChild(qrImage);
rightSection.appendChild(validity);

idCard.appendChild(leftSection);
idCard.appendChild(rightSection);

idCardContainer.appendChild(idCard);

const downloadBtn = document.createElement('button');
downloadBtn.id = 'downloadBtn';
downloadBtn.textContent = 'Download ID Card';
downloadBtn.style.marginTop = '20px';
downloadBtn.style.padding = '10px 20px';
downloadBtn.style.fontSize = '16px';
downloadBtn.style.cursor = 'pointer';
downloadBtn.style.background = '#8B0000';
downloadBtn.style.color = 'white';
downloadBtn.style.border = 'none';
downloadBtn.style.borderRadius = '5px';

downloadBtn.addEventListener('click', function () {
html2canvas(idCard).then(canvas => {
const link = document.createElement('a');
link.href = canvas.toDataURL('image/png');
link.download = `${userData.libraryIdNo}_id_card.png`;
link.click();
}).catch(err => {
console.error('Error generating ID card image:', err);
});
});

idCardContainer.appendChild(downloadBtn);
document.body.appendChild(idCardContainer);
}