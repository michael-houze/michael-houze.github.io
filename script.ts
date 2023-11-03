let intervalId: number | undefined;
let counts: Record<string, number> = {};

function startExercise() {
  // Reset counts for each word
  counts = {};

  const wordInput = (document.getElementById('wordArray') as HTMLTextAreaElement).value;
  const minTimeInterval = parseInt((document.getElementById('minTimeInterval') as HTMLInputElement).value) * 1000;
  const maxTimeInterval = parseInt((document.getElementById('maxTimeInterval') as HTMLInputElement).value) * 1000;
  const wordCount = parseInt((document.getElementById('wordCount') as HTMLInputElement).value);
  
  if (minTimeInterval > maxTimeInterval) {
    alert('Minimum time interval must be less than maximum time interval.');
    return;
  }

  const wordArray = wordInput.split(/[\n\r\s]+/).filter(Boolean).slice(0, 10);

  const speakRandomWord = () => {
    const wordIndex = Math.floor(Math.random() * wordArray.length);
    const word = wordArray[wordIndex];
    counts[word] = counts[word] ? counts[word] + 1 : 1;

    if (counts[word] <= wordCount) {
      // Using the Web Speech API to speak the word
      const utterance = new SpeechSynthesisUtterance(word);
      console.log(`word: ${word}`)
      speechSynthesis.speak(utterance);

      // Check if we've said the word the required number of times
      if (counts[word] < wordCount) {
        scheduleNextWord();
      } else {
        console.log(`Finished saying ${word} ${wordCount} times.`);
      }
    }
  };

  const scheduleNextWord = () => {
    const timeInterval = getRandomTimeInterval(minTimeInterval, maxTimeInterval);
    intervalId = window.setTimeout(speakRandomWord, timeInterval);
  };

  // Start the process
  scheduleNextWord();
}

function stopExercise() {
  if (intervalId !== undefined) {
    clearTimeout(intervalId);
    intervalId = undefined;
    speechSynthesis.cancel();
  }
  console.log("Stopped and reset.");
}

function getRandomTimeInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// For demonstration purposes, attaching functions to window to make them accessible from HTML
(window as any).startExercise = startExercise;
(window as any).stopExercise = stopExercise;