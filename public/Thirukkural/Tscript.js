const thirukkuralData = [
    {
        kural: "அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு.",
        meaning: "அகரம் என்பது எழுத்துகளுக்கு முதன்மையானது; அந்த வகையில் பிரபஞ்சத்திற்கும் முதன்மையானது பரம்பொருள்.",
        story: "ஒரு நல்ல அரசன் குற்றவாளிகளை மன்னிக்க வேண்டும் என்பதைக் கூறும் குறள்."
    },
    {
        kural: "கற்க கசடறக் கற்பவை கற்றபின் நிற்க அதற்குத் தக.",
        meaning: "நீங்கள் கற்றுத்தொடங்கிய பொழுது முற்றிலும் கற்றுக்கொள்ள வேண்டும். கற்றுக்கொண்டபின் அதன்படி வாழ வேண்டும்.",
        story: "ஒரு சிறுவன் கல்வியின் மகத்துவத்தை உணர்ந்து ஆசிரியரிடம் சென்று கற்றுக் கொண்ட கதை."
    }
    // Add more Thirukkural data here
];

let currentKuralIndex = 0;
let speechSynthesisUtterance = null;

// Start Speech Recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'ta-IN'; // Tamil language

recognition.onstart = function() {
    console.log('Speech recognition started');
};

recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.trim();
    console.log(`Heard: ${transcript}`);
    
    if (transcript === "ஆரம்பம்") {
        startReading();
    } else if (transcript === "மீண்டும்" || transcript === "மீண்டும் வாசி") {
        startReading();
    } else if (transcript === "அடுத்தது" || transcript === "அடுத்த குறள்") {
        nextKural();
    }
};

function startReading() {
    const kural = thirukkuralData[currentKuralIndex].kural;
    const meaning = thirukkuralData[currentKuralIndex].meaning;
    const story = thirukkuralData[currentKuralIndex].story;

    document.getElementById('kural').textContent = kural;
    document.getElementById('meaning').textContent = meaning;
    document.getElementById('story').textContent = story;

    speechSynthesisUtterance = new SpeechSynthesisUtterance(`${kural}. அதன் பொருள்: ${meaning}. தொடர்புடைய கதை: ${story}`);
    speechSynthesisUtterance.lang = 'ta-IN';  // Tamil language code
    speechSynthesis.speak(speechSynthesisUtterance);

    speechSynthesisUtterance.onend = function() {
        askForNextOrRepeat();
    };
}

function askForNextOrRepeat() {
    const question = new SpeechSynthesisUtterance("மீண்டும் அல்லது அடுத்தது ?");
    question.lang = 'ta-IN';
    speechSynthesis.speak(question);

    recognition.start(); // Start listening for user's response
}

function stopReading() {
    if (speechSynthesisUtterance) {
        speechSynthesis.cancel();
    }
}

function nextKural() {
    stopReading();
    currentKuralIndex = (currentKuralIndex + 1) % thirukkuralData.length;
    startReading();
}

// Start speech recognition when the page loads
recognition.start();
