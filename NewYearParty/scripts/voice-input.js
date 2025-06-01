const usrVoiceInput = document.getElementById('usrVoiceInput');
var recognition;
let isListening = false;

if (!'webkitSpeechRecognition' in window) {
    usrVoiceInput.textContent = 'Speech recognition not supported in this browser.';
} else {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
}

function startVoiceInputControl() {
        if (!'webkitSpeechRecognition' in window) {
            // Not supported in this browser or user not authorized to access Microphone
            return;
        }
        
        // Check if timer has expired
        if (timeLeft <= 0) {
            return;
        }
        
        console.log('Starting voice input for:', expectedValue);
        
        // Always stop first, then start
        try {
            recognition.stop();
        } catch (e) {
            // Ignore errors when stopping
        }
        
        // Reset the recognition object completely
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        
        isListening = true;
        recognition.start();
        usrVoiceInput.textContent = 'Listening...';
    
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          console.log(transcript + " compared to " + expectedValue);
          isListening = false;
          
          // Always show what user said for feedback
          usrVoiceInput.textContent = `You said: "${transcript}"`;
          
          if (transcript === expectedValue.toLowerCase()) {
            usrVoiceInput.textContent += ' - Correct!';
            // Stop timer and advance to next question immediately
            clearInterval(timerInterval);
            switchAnimation();
          } else {
            usrVoiceInput.textContent += ' - Try again...';
            // Immediate retry if time is left
            if (timeLeft > 0) {
                startVoiceInputControl();
            }
          }
        };
    
        recognition.onerror = (event) => {
          console.log('Recognition error:', event.error);
          usrVoiceInput.textContent = `Error: ${event.error}`;
          isListening = false;
          // Immediate retry if time is left
          if (timeLeft > 0) {
              startVoiceInputControl();
          }
        };
    
        recognition.onend = () => {
            console.log('Recognition ended');
            isListening = false;
        }
}