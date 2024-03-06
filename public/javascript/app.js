let speakButton = document.getElementById('speak');
let textToSpeak = document.getElementById('result').innerText;

speakButton.addEventListener('click' , () => {
    console.log(textToSpeak);
    const synth = window.speechSynthesis
    const utterThis = new SpeechSynthesisUtterance(textToSpeak)

    synth.speak(utterThis);
});