const inputs = document.querySelector(".inputs"),
    hintTag = document.querySelector(".hint span"),
    guessLeft = document.querySelector(".guess-left span"),
    wrongLetter = document.querySelector(".wrong-letter span"),
    resetBtn = document.querySelector(".reset-btn"),
    voiceBtn = document.querySelector(".voice-btn"),
    typingInput = document.querySelector(".typing-input"),
    scoreDisplay = document.getElementById('score-display'),
    highestScoreDisplay = document.getElementById('highest-score-display');

const pointGainSound = document.getElementById('point-gain-sound');

let word, maxGuesses, incorrectLetters = [], correctLetters = [], score = 0, highestScore = 0;
const userId = 5; // Replace with the actual user ID from your authentication system

// Fetch the highest score from the backend and update the display
async function loadHighestScore() {
    try {
        const response = await fetch(`http://localhost:8080/api/scores/highest?userId=${userId}&gameName=Word Guessing Game`);
        const data = await response.json();
        highestScore = data ? data.score : 0;
        highestScoreDisplay.innerText = highestScore; // Update the highest score display
    } catch (error) {
        console.error('Error fetching highest score:', error);
    }
}

// Save the highest score to the backend
async function saveHighestScore() {
    try {
        const response = await fetch('http://localhost:8080/api/scores/highest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, gameName: 'Word Guessing Game', score: highestScore })
        });
        await response.json();
    } catch (error) {
        console.error('Error saving highest score:', error);
    }
}

// Function to select a random word from the wordList and initialize the game
function randomWord() {
    let ranItem = wordList[Math.floor(Math.random() * wordList.length)];
    word = ranItem.word;
    maxGuesses = word.length >= 5 ? 8 : 6;
    correctLetters = [];
    incorrectLetters = [];
    hintTag.innerText = ranItem.hint;
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrectLetters.join(", ");
    scoreDisplay.innerText = score; // Update current score display

    let html = "";
    for (let i = 0; i < word.length; i++) {
        html += `<input type="text" disabled>`;
        inputs.innerHTML = html;
    }

    console.log(`The word to guess is: ${word}`);
    speak(`Hint: ${ranItem.hint}. You have ${maxGuesses} guesses. Start guessing the word.`);
}

async function updateScore() {
    try {
        await fetch('http://localhost:8080/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, gameName: 'Word Guessing Game', score: score })
        });

        // Update highest score if current score exceeds it
        if (score > highestScore) {
            highestScore = score;
            highestScoreDisplay.innerText = highestScore; // Update the highest score display
            saveHighestScore(); // Save the highest score after updating
        }
    } catch (error) {
        console.error('Error updating score:', error);
    }
}

function updateScoreDisplay() {
    scoreDisplay.innerText = score; // Update the current score display
}

function initGame(key) {
    key = key.toLowerCase();
    if (key.length === 1 && key.match(/^[a-z]$/) && !incorrectLetters.includes(key) && !correctLetters.includes(key)) {
        if (word.includes(key)) {
            for (let i = 0; i < word.length; i++) {
                if (word[i] === key) {
                    correctLetters.push(key);
                    inputs.querySelectorAll("input")[i].value = key;
                }
            }
            score += 10; // Increment score by 10 points for each correct letter
            speak(`Good job! The letter ${key} is correct.`);
            updateScoreDisplay(); // Update the current score display
        } else {
            maxGuesses--;
            incorrectLetters.push(key);
            speak(`Sorry, the letter ${key} is not in the word.`);
        }
        guessLeft.innerText = maxGuesses;
        wrongLetter.innerText = incorrectLetters.join(", ");
    }

    setTimeout(() => {
        if (correctLetters.length === word.length) {
            score += maxGuesses; // Update score
            speak(`Congrats! You found the word ${word.toUpperCase()}.`);
            pointGainSound.play();
            updateScore(); // Update score on the server
            setTimeout(randomWord, 2000); // Small delay before starting a new word
        } else if (maxGuesses < 1) {
            speak(`Game over! You don't have any remaining guesses. The word was ${word.toUpperCase()}.`);
            for (let i = 0; i < word.length; i++) {
                inputs.querySelectorAll("input")[i].value = word[i];
            }
            updateScore(); // Update score on the server
            setTimeout(randomWord, 2000); // Small delay before starting a new word
        }
    }, 100);
}

resetBtn.addEventListener("click", randomWord);

function speak(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.rate = 1.5;  // Increase speech rate for faster feedback
    speechSynthesis.speak(speech);
}

const recognition = new webkitSpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = true;  // Enable interim results
recognition.continuous = true;  // Continuous listening
recognition.maxAlternatives = 1;

// Increase recognition sensitivity by improving context handling and ensuring results are processed efficiently
recognition.onresult = (event) => {
    const result = event.results[event.resultIndex];
    const transcript = result[0].transcript.trim().toLowerCase();

    if (result.isFinal) {
        const singleLetter = transcript.match(/^[a-z]$/);
        if (singleLetter) {
            console.log(`Recognized letter: ${singleLetter[0]}`);
            initGame(singleLetter[0]);
        } else {
            speak("Please say a single letter.");
        }
    } else {
        console.log(`Interim result: ${transcript}`);
    }
};

recognition.onerror = (event) => {
    console.log(`Recognition error: ${event.error}`);
    speak("Sorry, I didn't catch that. Please try again.");
    setTimeout(() => recognition.start(), 1000);
};

recognition.onend = () => {
    console.log("Speech recognition ended. Restarting...");
    recognition.start();  // Restart recognition immediately
};

voiceBtn.addEventListener("click", () => {
    recognition.start();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        recognition.start();
    }
});

// Load the highest score when the page loads
window.addEventListener('load', loadHighestScore);
