"use strict";
// TODO: add responsive css
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let intervalId;
let counts = {};
let lastWordSpoken = '';
let wordRepeated = false;
let spokenWords = 0;
function startExercise() {
    return __awaiter(this, void 0, void 0, function* () {
        // Reset counts for each word
        counts = {};
        const selectElement = document.getElementById("wordSelect");
        const wordCount = parseInt(document.getElementById("wordCount").value);
        const minTimeInterval = parseInt(document.getElementById("minTimeInterval").value) * 1000;
        const maxTimeInterval = parseInt(document.getElementById("maxTimeInterval").value) * 1000;
        if (minTimeInterval > maxTimeInterval) {
            alert("Minimum time interval must be less than maximum time interval.");
            return;
        }
        const selectedOptions = Array.from(selectElement.selectedOptions).map((option) => option.value);
        const wordArray = selectedOptions.length > 0
            ? selectedOptions
            : ["green", "yellow", "red", "orange"]; // Fallback to all words if none selected
        yield countdown();
        const speakRandomWord = () => __awaiter(this, void 0, void 0, function* () {
            let word = '';
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
                }
                else {
                    yield delay(3000);
                    var completeUtterance = new SpeechSynthesisUtterance("Exercise complete. Great Job!");
                    speechSynthesis.speak(completeUtterance);
                    console.log(`Finished saying ${wordCount} words.`);
                }
            }
        });
        const scheduleNextWord = () => {
            var timeInterval = getRandomTimeInterval(minTimeInterval, maxTimeInterval);
            intervalId = window.setTimeout(speakRandomWord, timeInterval);
        };
        // Start the process
        scheduleNextWord();
    });
}
function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
function countdown() {
    return __awaiter(this, void 0, void 0, function* () {
        var startUtterance = new SpeechSynthesisUtterance("Starting exercise. Beginning in three.");
        speechSynthesis.speak(startUtterance);
        yield delay(3000);
        var twoUtterance = new SpeechSynthesisUtterance("two");
        speechSynthesis.speak(twoUtterance);
        yield delay(1000);
        var oneUtterance = new SpeechSynthesisUtterance("one");
        speechSynthesis.speak(oneUtterance);
        return new Promise(resolve => setTimeout(resolve, 2000));
    });
}
function stopExercise() {
    return __awaiter(this, void 0, void 0, function* () {
        if (intervalId !== undefined) {
            clearTimeout(intervalId);
            intervalId = undefined;
            speechSynthesis.cancel();
            spokenWords = 0;
        }
        console.log("Stopped and reset.");
    });
}
function getRandomTimeInterval(min, max) {
    if (spokenWords == 0) {
        return 1;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// For demonstration purposes, attaching functions to window to make them accessible from HTML
window.startExercise = startExercise;
window.stopExercise = stopExercise;
