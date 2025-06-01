const usrVoiceInput = document.getElementById('usrVoiceInput');
var recognition;
if (!'webkitSpeechRecognition' in window) {
    document.getElementById('result').textContent = 'Speech recognition not supported in this browser.';
}else {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
}

function startVoiceInputControl() {
        if (!'webkitSpeechRecognition' in window) {
            // Not supported int his browser or user not authorized to access Microphone
            return;
        }
        recognition.start();
        usrVoiceInput.textContent = 'Listening...';
    
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase(); // Lowercase for case-insensitive comparison
          usrVoiceInput.textContent = `You said: ${transcript}`;
          console.log(transcript+" compared to "+expectedValue)
          if (transcript.toLowerCase() === expectedValue.toLowerCase()) {
            usrVoiceInput.textContent += ' - Correct!';
          } else {
            usrVoiceInput.textContent += ' - Incorrect.';
          }
        };
    
        recognition.onerror = (event) => {
          usrVoiceInput.textContent = `Error: ${event.error}`;
        };
    
        recognition.onend = () => {
            usrVoiceInput.textContent += ' Get Ready for the next question'
        }
      
}