const problemElement = document.getElementById('problem');
const resultElement = document.getElementById('result');
const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
const scoreBoardElement = document.getElementById('scoreboard');
const highestScoreElement = document.getElementById('highestscore');
const hampersElement = document.getElementById('gift-animation');
const userId = 5; // Placeholder user ID for demonstration; replace with actual ID from localStorage

let num1, num2, correctAnswer;
let recognition;
let isRecognizing = false;
let attemptsLeft = 2; // Number of attempts for the user
let score = 0;
let highestScore = 0;

// Fetch the highest score for the user from the backend
async function fetchHighestScore() {
    try {
        const response = await fetch(`http://localhost:8080/api/scores/highest?userId=${userId}&gameName=Multiplication Game`);
        if (response.ok) {
            const data = await response.json();
            console.log('Fetched highest score data:', data);
            if (data && data.score !== undefined) {
                highestScore = data.score;
                highestScoreElement.innerText = `Highest Score: ${highestScore}`;
            } else {
                console.error('No score found in response:', data);
            }
        } else {
            throw new Error('Failed to fetch highest score');
        }
    } catch (error) {
        console.error('Error fetching highest score:', error);
    }
}

// Save the current score to the backend
async function saveScore() {
    try {
        const response = await fetch('http://localhost:8080/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, gameName: 'Multiplication Game', score }),
        });
        if (!response.ok) {
            throw new Error('Failed to save score');
        }
        console.log('Score saved successfully.');
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// Save the highest score to the backend
async function saveHighestScore() {
    try {
        const response = await fetch('http://localhost:8080/api/scores/highest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, gameName: 'Multiplication Game', score: highestScore }),
        });
        if (!response.ok) {
            throw new Error('Failed to save highest score');
        }
        console.log('Highest score saved successfully.');
    } catch (error) {
        console.error('Error saving highest score:', error);
    }
}

// Generate a new math problem for the game
function generateProblem() {
    if (attemptsLeft > 0) {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = num1 * num2;

        problemElement.innerText = `What is ${num1} * ${num2}?`;
        speak(`What is ${num1} times ${num2}?`);
    } else {
        endGame();
    }
}

// Use speech synthesis to speak the problem text
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    console.log('Speaking:', text);
}

// Check the user's answer and update the game state
function checkAnswer(answer) {
    const parsedAnswer = parseInt(answer, 10);
    if (!isNaN(parsedAnswer) && parsedAnswer === correctAnswer) {
        resultElement.innerText = 'Correct!';
        speak('Correct!');
        score++;
        updateScoreBoard();
        setTimeout(() => {
            generateProblem();
            resultElement.innerText = ''; // Clear previous result text
        }, 2000); // Generate a new problem after 2 seconds
    } else {
        resultElement.innerText = 'Try again!';
        speak('Try again!');
        attemptsLeft--;
        updateScoreBoard();
        if (attemptsLeft === 0) {
            endGame();
        }
    }
}

// Update the scoreboard and handle highest score
function updateScoreBoard() {
    scoreBoardElement.innerText = `Score: ${score} | Attempts Left: ${attemptsLeft}`;
    if (score > highestScore) {
        highestScore = score;
        highestScoreElement.innerText = `Highest Score: ${highestScore}`;
        localStorage.setItem('highestScore', highestScore); // Save the highest score to local storage
        triggerHampersAnimation(); // Trigger the hampers animation
        saveHighestScore(); // Save the new highest score
    }
}

// Trigger animation when a new highest score is achieved
function triggerHampersAnimation() {
    hampersElement.style.display = 'block'; // Show hampers
    setTimeout(() => {
        hampersElement.style.display = 'none'; // Hide hampers after animation
    }, 2000); // Duration matches the animation duration
}

// End the game and show the final result
async function endGame() {
    resultElement.innerText = `Game over! Your final score is ${score}.`;
    speak(`Game over! Your final score is ${score}.`);
    startButton.disabled = true; // Disable the start button
    restartButton.style.display = 'inline-block'; // Show the restart button

    // Save the final score to the backend
    await saveScore();
}

// Restart the game with initial settings
function restartGame() {
    attemptsLeft = 2;
    score = 0;
    updateScoreBoard();
    resultElement.innerText = '';
    startButton.disabled = false; // Enable the start button
    restartButton.style.display = 'none'; // Hide the restart button
    generateProblem();
}

// Normalize and clean up the answer from speech recognition
function normalizeAnswer(answer) {
    return answer.replace(/[^0-9]/g, '').trim(); // Remove non-numeric characters and trim spaces
}

// Start speech recognition and handle the results
function startRecognition() {
    if (isRecognizing) {
        recognition.stop(); // Ensure any previous instance is stopped
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        isRecognizing = true;
        console.log('Voice recognition started. Try speaking into the microphone.');
    };

    recognition.onresult = function(event) {
        let spokenAnswer = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                spokenAnswer = normalizeAnswer(event.results[i][0].transcript);
                console.log('Final recognized speech:', spokenAnswer);
                resultElement.innerText = `You said: ${spokenAnswer}`;
                checkAnswer(spokenAnswer);
            } else {
                console.log('Interim recognized speech:', event.results[i][0].transcript);
                resultElement.innerText = `Listening: ${normalizeAnswer(event.results[i][0].transcript)}`;
            }
        }
    };

    recognition.onerror = function(event) {
        console.error('Recognition error:', event.error);
        resultElement.innerText = 'Error occurred in recognition: ' + event.error;

        if (event.error === 'no-speech') {
            console.log('No speech detected. Restarting recognition...');
            setTimeout(() => recognition.start(), 500);
        } else if (event.error === 'aborted') {
            isRecognizing = false;
        }
    };

    recognition.onend = function() {
        isRecognizing = false;
        console.log('Voice recognition ended.');
        setTimeout(() => {
            if (!isRecognizing) {
                recognition.start();
            }
        }, 500);
    };

    recognition.start();
    console.log('Recognition started.');

    window.addEventListener('beforeunload', () => {
        recognition.stop();
    });
}

// Start the game when the start button is clicked
startButton.addEventListener('click', () => {
    if (attemptsLeft > 0) {
        fetchHighestScore(); // Fetch the highest score when starting the game
        generateProblem();
        startRecognition();
    }
});

// Restart the game when the restart button is clicked
restartButton.addEventListener('click', restartGame);

// Initialize scoreboard and highest score display
updateScoreBoard();
highestScoreElement.innerText = `Highest Score: ${highestScore}`;
restartButton.style.display = 'none';
