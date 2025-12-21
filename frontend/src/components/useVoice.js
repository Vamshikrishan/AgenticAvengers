export function useVoiceInput(onResult) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = SpeechRecognition
    ? new SpeechRecognition()
    : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
  }

  const startListening = () => {
    if (!recognition) {
      alert("Speech Recognition not supported");
      return;
    }

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
  };

  return { startListening };
}

export function speakText(text) {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.cancel(); // stop previous
  window.speechSynthesis.speak(utterance);
}
