  document.getElementById("qrToggle").addEventListener("change", (event) => {
    const enable = event.target.checked;
    sendMessageToContentScript({ action: 'toggleQRCode', enable });
  });
  
  function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        console.log('Response from content script:', response);
      });
    });
  }
  