const listeningStatus = document.getElementById('listeningStatus');
const userInput = document.getElementById('userInput');
const feedbackMessage = document.getElementById('feedbackMessage');
var recognition;
let isListening = false;

// Levenshtein distance function
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    // Create matrix
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Check if answer is close enough
function isAnswerClose(userAnswer, expectedAnswer) {
    // Direct match
    if (userAnswer === expectedAnswer) {
        return true;
    }
    
    // Remove common words and articles for better matching
    const cleanUser = userAnswer.replace(/\b(the|a|an)\b/g, '').trim();
    const cleanExpected = expectedAnswer.replace(/\b(the|a|an)\b/g, '').trim();
    
    // Check cleaned versions
    if (cleanUser === cleanExpected) {
        return true;
    }
    
    // Use Levenshtein distance for fuzzy matching
    const distance = levenshteinDistance(cleanUser, cleanExpected);
    const maxLength = Math.max(cleanUser.length, cleanExpected.length);
    
    // Accept if similarity is 80% or higher (20% error tolerance)
    const similarity = (maxLength - distance) / maxLength;
    console.log(`Similarity: ${similarity.toFixed(2)} (${cleanUser} vs ${cleanExpected})`);
    
    return similarity >= 0.8;
}

if (!'webkitSpeechRecognition' in window) {
    listeningStatus.textContent = 'Speech recognition not supported in this browser.';
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
        listeningStatus.textContent = 'Listening... Speak now!';
    
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          const expected = expectedValue.toLowerCase();
          console.log(transcript + " compared to " + expected);
          isListening = false;
          
          // Show what user said
          userInput.textContent = `"${transcript}"`;
          
          // Check if answer is close enough using Levenshtein distance
          if (isAnswerClose(transcript, expected)) {
            // Highlight correct answer
            userInput.className = 'voiceDisplay correct-answer';
            feedbackMessage.textContent = 'Correct! Moving to next question...';
            listeningStatus.textContent = 'Great job!';
            
            // Stop timer and advance to next question immediately
            clearInterval(timerInterval);
            switchAnimation();
          } else {
            // Highlight incorrect answer
            userInput.className = 'voiceDisplay incorrect-answer';
            feedbackMessage.textContent = `Try again... (Expected: ${expectedValue})`;
            listeningStatus.textContent = 'Keep trying!';
            
            // Immediate retry if time is left
            if (timeLeft > 0) {
                startVoiceInputControl();
            }
          }
        };
    
        recognition.onerror = (event) => {
          console.log('Recognition error:', event.error);
          listeningStatus.textContent = `Error: ${event.error}`;
          feedbackMessage.textContent = 'Please try speaking again';
          isListening = false;
          // Immediate retry if time is left
          if (timeLeft > 0) {
              startVoiceInputControl();
          }
        };
    
        recognition.onend = () => {
            console.log('Recognition ended');
            isListening = false;
            if (listeningStatus.textContent === 'Listening... Speak now!') {
                listeningStatus.textContent = 'Ready to listen';
            }
        }
}