// Select DOM elements
const startBtn = document.getElementById('start-btn');
const message = document.getElementById('message');

// Riddles data
const riddles = [
    {
        question: "அடர்ந்த காட்டின் நடுவே ஒரு பாதை அது என்ன?",
        answer: "தலை வகிடு"
    },
    {
        question: "காலையிலும் மாலையிலும் நெட்டை மதியம் குட்டை நான் யார்?",
        answer: "நிழல்"
    },
    {
        question: "வெள்ளை மாளிகை உள்ளே செல்ல வாசல் இல்லை அது என்ன?",
        answer: "முட்டை"
    },
    {
        question: "நீ எங்கு சென்றாலும் தொடர்ந்து வருவான் அவன் யார்?",
        answer: "நிழல்"
    },
    {
        question: "முதுகிலே சுமை தூக்கி முனகாமல் அசைந்து வரும் அது என்ன?",
        answer: "நத்தை"
    },
    {
        question: "வாயில் இருந்து நூல் போடுவான், மந்திரவாதி இல்லை; கிளைக்கு கிளை தாவுவான் ஆனால் குரங்கு இல்லை; வலை விரித்து பதுங்கி இருப்பான் ஆனால் வேடன் இல்லை – அவன் யார்?",
        answer: "சிலந்தி"
    },
    {
        question: "நீளவால் குதிரையின் வால் ஓடஓடக் குறையும் அது என்ன?",
        answer: "தையல் ஊசியும் நூலும்"
    },
    {
        question: "எவர் கையிலும் சிக்காத கல், எங்கும் விற்காத கல் அது என்ன?",
        answer: "விக்கல்"
    },
    {
        question: "கண்ணால் பார்க்கலாம் கையால் பிடிக்க முடியாது அது என்ன?",
        answer: "நிழல்"
    },
    {
        question: "செய்தி வரும் பின்னே மணி ஓசை வரும் முன்னே அவன் யார்?",
        answer: "தொலைபேசி"
    },
    {
        question: "அள்ள முடியும் ஆனால் கிள்ள முடியாது அது என்ன?",
        answer: "தண்ணீர்"
    },
    {
        question: "ஊர் முழுவதும் சுற்றுவேன், வீட்டுக்குள் நுழைய மாட்டேன் நான் யார்?",
        answer: "செருப்பு"
    },
    {
        question: "கூரை வீட்டைப் பிரித்தால் ஓட்டு வீடு. ஓட்டு வீட்டுக்குள்ளே வெள்ளை மாளிகை. வெள்ளை மாளிகையின் நடுவே ஒரு குளம். அது என்ன?",
        answer: "தேங்காய்"
    },
    {
        question: "தலை இல்லாதவன் தலையை சுமப்பவன் அவன் யார்?",
        answer: "தலையணை"
    },
    {
        question: "பற்கள் இருக்கும் கடிக்கமாட்டான் அவன் யார்?",
        answer: "சீப்பு"
    },
    {
        question: "கன்று நிற்க கயிறு மேயுது அது என்ன?",
        answer: "பூசனிக்கொடி"
    },
    {
        question: "தலையைச் சீவினால் தாளில் நடப்பான் அவன் யார்?",
        answer: "பென்சில்"
    },
    {
        question: "கசக்கிப் பிழிந்தாலும் கடைசிவரை இனிப்பான் அவன் யார்?",
        answer: "கரும்பு"
    },
    {
        question: "பிடுங்கலாம் நடமுடியாது அது என்ன?",
        answer: "தலமுடி"
    },
    {
        question: "மூன்றெழுத்துப் பெயர், உடல் முழுவதும் வெள்ளை நிறம் அது என்ன?",
        answer: "பஞ்சு"
    }
];

const pointGainSound = document.getElementById('point-gain-sound');

let currentRiddleIndex = 0;

// Function to speak a text using Tamil language
function speak(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'ta-IN';
    speech.onend = callback; // Call the callback function once speaking is finished
    window.speechSynthesis.speak(speech);
}

// Function to start voice recognition
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ta-IN';
    recognition.start();

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase();
        checkAnswer(result);
    };

    recognition.onerror = (event) => {
        message.textContent = 'குரல் அடையாளம் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.';
        speak('குரல் அடையாளம் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.');
    };
}

// Function to check the player's answer
function checkAnswer(answer) {
    const correctAnswer = riddles[currentRiddleIndex].answer.toLowerCase();
    if (answer.includes(correctAnswer)) {
        message.textContent = 'பதில் சரியானது! அடுத்த புதிர்.';
        pointGainSound.play();
        speak('பதில் சரியானது! அடுத்த புதிர்.', () => {
            currentRiddleIndex++;
            if (currentRiddleIndex < riddles.length) {
                setTimeout(askRiddle, 2000);
            } else {
                message.textContent = 'வாழ்த்துக்கள்! நீங்கள் எல்லா புதிர்களையும் முடித்துவிட்டீர்கள்.';
                speak('வாழ்த்துக்கள்! நீங்கள் எல்லா புதிர்களையும் முடித்துவிட்டீர்கள்.');
            }
        });
    } else {
        message.textContent = 'பதில் தவறானது. மீண்டும் முயற்சிக்கவும்.';
        speak('பதில் தவறானது. மீண்டும் முயற்சிக்கவும்.', startVoiceRecognition);
    }
}

// Function to ask a riddle
function askRiddle() {
    const riddle = riddles[currentRiddleIndex].question;
    message.textContent = riddle;
    speak(riddle, () => {
        // After reading the riddle, ask for the answer
        message.textContent = 'உங்கள் பதில் என்ன?';
        speak('உங்கள் பதில் என்ன?', startVoiceRecognition);
    });
}

// Event listener to start the game
startBtn.addEventListener('click', () => {
    message.textContent = 'விளையாட்டைத் தொடங்கியுள்ளோம்... கவனமாக இருங்கள்!';
    speak('விளையாட்டைத் தொடங்கியுள்ளோம்... கவனமாக இருங்கள்!', askRiddle);
});