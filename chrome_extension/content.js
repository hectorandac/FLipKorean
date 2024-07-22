// Function to create the QR code overlay
function createQrCodeOverlay(text) {
    // Check if the overlay already exists
    if (document.getElementById('qr-code-overlay')) {
      return;
    }

    // Create the overlay container
    const overlay = document.createElement('div');
    overlay.id = 'qr-code-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.right = '10px';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    overlay.style.padding = '20px';
    overlay.style.borderRadius = '10px';
    overlay.style.zIndex = '10000';
    overlay.style.textAlign = 'center';
    overlay.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.3)'; // Optional: Add shadow for a better look

    // Create the QR code container
    const qrCodeContainer = document.createElement('div');
    qrCodeContainer.id = 'qr-code-container';

    // Generate the QR code
    new QRCode(qrCodeContainer, {
      text: text,
      width: 128,
      height: 128,
      colorDark: "#333333",  // Dark gray squares
      colorLight: "transparent",  // Transparent to blend with the background color
      correctLevel: QRCode.CorrectLevel.H  // High correction level
    });

    // Append the QR code to the overlay
    overlay.appendChild(qrCodeContainer);

    // Append the overlay to the body
    document.body.appendChild(overlay);
}

// Function to remove the QR code overlay
function removeQrCodeOverlay() {
    const overlay = document.getElementById('qr-code-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Add message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleQRCode') {
        if (request.enable) {
            // Fetch session ID and create QR code
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("http://127.0.0.1:5000/initialize_session", requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    createQrCodeOverlay(data.session_id); // Use the session ID from the response
                })
                .catch(error => console.log('error', error));
        } else {
            removeQrCodeOverlay();
        }
    }

    // Forward the message to the window
    window.postMessage(request, '*');
    sendResponse({ status: 'done' });
});
