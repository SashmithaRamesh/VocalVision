// Get DOM elements
const gameContainer = document.querySelector(".container"),
  userResult = document.querySelector(".user_result img"),
  cpuResult = document.querySelector(".cpu_result img"),
  result = document.querySelector(".result"),
  optionImages = document.querySelectorAll(".option_image");

// Audio elements
const rockSound = new Audio('sounds/rock.mp3'),
  paperSound = new Audio('sounds/paper.mp3'),
  scissorsSound = new Audio('sounds/scissors.mp3'),
  winSound = new Audio('sounds/win.mp3'),
  loseSound = new Audio('sounds/lose.mp3'),
  drawSound = new Audio('sounds/draw.mp3');
  

function playSound(choice) {
  switch (choice) {
    case 'rock':
      // rockSound.play();
      break;
    case 'paper':
      // paperSound.play();
      break;
    case 'scissors':
      // scissorsSound.play();
      break;
    case 'win':
      // winSound.play();
      break;
    case 'lose':
      // loseSound.play();
      break;
    case 'draw':
      // drawSound.play();
      break;
    default:
      break;
  }
}



function playGame(userChoice) {
  userResult.src = cpuResult.src = "images/rock.png";
  result.textContent = "Wait...";

  gameContainer.classList.add("start");

  setTimeout(() => {
    gameContainer.classList.remove("start");

    // Set user image
    userResult.src = `images/${userChoice}.png`;

    // Random CPU choice
    const choices = ['rock', 'paper', 'scissors'];
    const cpuChoice = choices[Math.floor(Math.random() * choices.length)];
    cpuResult.src = `images/${cpuChoice}.png`;

    // Determine winner
    const outcomes = {
      rock: {rock: 'Draw', paper: 'Cpu', scissors: 'User'},
      paper: {rock: 'User', paper: 'Draw', scissors: 'Cpu'},
      scissors: {rock: 'Cpu', paper: 'User', scissors: 'Draw'}
    };

    const outcome = outcomes[userChoice][cpuChoice];
    result.textContent = outcome === 'Draw' ? 'Match Draw' : `${outcome} Won!!`;


    // Announce the result
    announceResult(userChoice, cpuChoice, outcome);
  }, 2500);
}

function announceResult(userChoice, cpuChoice, outcome) {
  const speech = new SpeechSynthesisUtterance();
  speech.lang = 'en-US';
  
  let announcement = `You chose ${userChoice}, and the CPU chose ${cpuChoice}. `;
  if (outcome === 'Draw') {
    announcement += "It's a draw!";
  } else {
    announcement += `${outcome} won!`;
  }
  
  speech.text = announcement;
  window.speechSynthesis.speak(speech);
}



window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.continuous = true;

recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
  if (transcript.includes('rock')) {
    playSound('rock');
    playGame('rock');
  } else if (transcript.includes('paper')) {
    playSound('paper');
    playGame('paper');
  } else if (transcript.includes('scissors')) {
    playSound('scissors');
    playGame('scissors');
  }
};

recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
};

recognition.start();

