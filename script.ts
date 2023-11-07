// TODO: add responsive css

let intervalId: number | undefined;
let counts: Record<string, number> = {};
let lastWordSpoken: string = '';
let wordRepeated: boolean = false;
let spokenWords: number = 0;

async function startExercise() {
  // Reset counts for each word
  counts = {};


  const selectElement = document.getElementById(
    "wordSelect"
  ) as HTMLSelectElement;
  const wordCount = parseInt(
    (document.getElementById("wordCount") as HTMLInputElement).value
  );
  const minTimeInterval =
    parseInt(
      (document.getElementById("minTimeInterval") as HTMLInputElement).value
    ) * 1000;
  const maxTimeInterval =
    parseInt(
      (document.getElementById("maxTimeInterval") as HTMLInputElement).value
    ) * 1000;

  if (minTimeInterval > maxTimeInterval) {
    alert("Minimum time interval must be less than maximum time interval.");
    return;
  }

  const selectedOptions = Array.from(selectElement.selectedOptions).map(
    (option) => option.value
  );
  
  const wordArray =
    selectedOptions.length > 0
      ? selectedOptions
      : ["green", "yellow", "red", "orange"]; // Fallback to all words if none selected

  await countdown();

  const speakRandomWord = async () => {
    let word: string = '';

    if ((Math.random() >= 0.1) || wordRepeated) { // must be a new word
      do {
        var wordIndex = Math.floor(Math.random() * wordArray.length);
        word = wordArray[wordIndex];
      } while ((word === lastWordSpoken) && (wordArray.length > 1));

      wordRepeated = false;
    } 
    else { // repeat same word
      word = lastWordSpoken;
      wordRepeated = true;
    }
    
    //counts[word] = counts[word] ? counts[word] + 1 : 1;
    spokenWords++;

    if (spokenWords <= wordCount) {
      // Using the Web Speech API to speak the word
      var utterance = new SpeechSynthesisUtterance(word);
      lastWordSpoken = word;
      console.log(`word: ${word}`);
      console.log(`word count: ${spokenWords}`);
      speechSynthesis.speak(utterance);

      // Check if we've said the word the required number of times
      if (spokenWords < wordCount) {
        scheduleNextWord();
      } else {
        await delay(3000);
        var completeUtterance = new SpeechSynthesisUtterance(
          "Exercise complete. Great Job!"
        );
        speechSynthesis.speak(completeUtterance);
        console.log(`Finished saying ${wordCount} words.`);
      }
    }
  };

  const scheduleNextWord = () => {
    var timeInterval = getRandomTimeInterval(
      minTimeInterval,
      maxTimeInterval
    );
    intervalId = window.setTimeout(speakRandomWord, timeInterval);
  };

  // Start the process
  scheduleNextWord();
}

function delay(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function countdown(): Promise<void> {
  var startUtterance = new SpeechSynthesisUtterance(
    "Starting exercise. Beginning in three."
  );
  speechSynthesis.speak(startUtterance);
  await delay(3000);

  var twoUtterance = new SpeechSynthesisUtterance(
    "two"
  );
  speechSynthesis.speak(twoUtterance);
  await delay(1000);

  var oneUtterance = new SpeechSynthesisUtterance(
    "one"
  );
  speechSynthesis.speak(oneUtterance);

  return new Promise(resolve => setTimeout(resolve, 2000));
}

async function stopExercise() {
  if (intervalId !== undefined) {
    clearTimeout(intervalId);
    intervalId = undefined;
    speechSynthesis.cancel();
    spokenWords = 0;
  }
  console.log("Stopped and reset.");
}

function getRandomTimeInterval(min: number, max: number): number {
  if(spokenWords == 0){
    return 1;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// For demonstration purposes, attaching functions to window to make them accessible from HTML
(window as any).startExercise = startExercise;
(window as any).stopExercise = stopExercise;
