<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>ID Card Preview & Download</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f5f5f5;
        }

        #id-card-container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        #id-card {
            width: 600px;
            height: 280px;
            display: flex;
            background: linear-gradient(to right, #8B0000 65%, #fff 35%);
            border-radius: 10px;
            padding: 15px;
            color: white;
            position: relative;
            font-size: 14px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .left-section {
            width: 70%;
            padding: 15px;
            display: flex;
            flex-direction: column;
        }

        .right-section {
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: white;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            padding: 15px;
        }

        .university-name {
            font-size: 15px;
            font-weight: bold;
            text-transform: uppercase;
            padding: 0;
            margin: 0;
        }

        .address {
            padding: 0;
            margin: 0;
            font-size: 10px;
        }

        .library-id-title {
            font-size: 14px;
            font-weight: bold;
            color: #FFD700;
        }

        .card-info {
            display: flex;
            align-items: center;
        }

        .id-pic {
            width: 100px;
            height: 100px;
            background-color: #fff;
            text-align: center;
            line-height: 80px;
            margin-right: 15px;
        }

        .info p {
            margin: 2px 0;
        }

        .info strong {
            font-weight: bold;
        }

        .qr-code {
            width: 150px;
            height: 150px;
            margin-bottom: 100px;
        }

        .librarian {
            font-size: 12px;
            text-align: center;
            color: black;
            font-weight: bold;
            margin-top: 10px;
        }

        #downloadBtn {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background: #8B0000;
            color: white;
            border: none;
            border-radius: 5px;
        }

        #downloadBtn:hover {
            background: #a50000;
        }

        #libraryId {
            font-size: 1.3em;
            font-weight: bold;
        }

        .position {
            font-size: 0.8em;
            font-weight: 100;
        }
    </style>
</head>

<body>
    <div id="id-card-container">
        <div id="id-card">
            <div class="left-section">
                <p class="university-name">Zamboanga Peninsula Polytechnic <br> State University</p>
                <p class="address">R.T. LIM BLVD., BALIWASAN RD., ZAMBOANGA CITY</p>
                <p class="library-id-title">LCC - LIBRARY ID</p>
                <div class="card-info">
                    <div class="id-pic"></div>
                    <div class="info">
                        <p><strong>Name:</strong> <span id="name"></span></p>
                        <p><strong>Department:</strong> <span id="contact"></span></p>
                        <p><strong>Course & Major:</strong> <span id="course"></span></p>
                        <p><strong>S.Y. & Semester:</strong> <span id="schoolyear"></span></p>
                        <p><strong>Valid Until:</strong> <span id="validUntil"></span></p>
                    </div>
                </div>
                <p><strong>Library ID No:</strong></p>
                <span id="libraryId"></span>
            </div>
            <div class="right-section">
                <img id="qrCode" class="qr-code" src="https://via.placeholder.com/100" alt="QR Code">
                <p class="librarian">JENELEE PASTOR<br><span class="position">COLLEGE LIBRARIAN</span></p>
            </div>
        </div>
        <button id="downloadBtn">Download ID Card</button>
    </div>

    <script>
        const userData = {
            libraryIdNo: "20017825",
            lastName: "Tan",
            firstName: "James Lorenzo",
            middleInitial: "F",
            contactNo: "0967-275-3518",
            course: "BS-Infotech 4",
            validUntil: "August 2024",
            qrCodeImage: "https://via.placeholder.com/100"
        };

        // Populate ID card with user data
        document.getElementById("name").textContent = `${userData.firstName} ${userData.middleInitial}. ${userData.lastName}`;
        document.getElementById("contact").textContent = userData.contactNo;
        document.getElementById("course").textContent = userData.course;
        document.getElementById("validUntil").textContent = userData.validUntil;
        document.getElementById("libraryId").textContent = userData.libraryIdNo;
        document.getElementById("qrCode").src = userData.qrCodeImage;

        // Function to download the ID card as an image
        document.getElementById("downloadBtn").addEventListener("click", function() {
            html2canvas(document.getElementById("id-card")).then(canvas => {
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = `${userData.libraryIdNo}_id_card.png`;
                link.click();
            }).catch(err => {
                console.error("Error generating ID card image:", err);
            });
        });
    </script>
</body>

</html>