// TODO: add responsive css
// TODO: reduce the chance of back to back duplicate words
// TODO: hardcode colors
var intervalId;
var counts = {};
function startExercise() {
    // Reset counts for each word
    counts = {};
    var wordInput = document.getElementById('wordArray').value;
    var minTimeInterval = parseInt(document.getElementById('minTimeInterval').value) * 1000;
    var maxTimeInterval = parseInt(document.getElementById('maxTimeInterval').value) * 1000;
    var wordCount = parseInt(document.getElementById('wordCount').value);
    var spokenWords = 0;
    if (minTimeInterval > maxTimeInterval) {
        alert('Minimum time interval must be less than maximum time interval.');
        return;
    }
    var wordArray = wordInput.split(/[\n\r\s]+/).filter(Boolean).slice(0, 10);
    var speakRandomWord = function () {
        var wordIndex = Math.floor(Math.random() * wordArray.length);
        var word = wordArray[wordIndex];
        counts[word] = counts[word] ? counts[word] + 1 : 1;
        spokenWords++;
        if (spokenWords <= wordCount) {
            // Using the Web Speech API to speak the word
            var utterance = new SpeechSynthesisUtterance(word);
            console.log("word: ".concat(word));
            console.log("word count: ".concat(spokenWords));
            speechSynthesis.speak(utterance);
            // Check if we've said the word the required number of times
            if (spokenWords < wordCount) {
                scheduleNextWord();
            }
            else {
                setTimeout(function () {
                    console.log('This will log after 2 seconds.');
                }, 2000);
                var completeUtterance = new SpeechSynthesisUtterance('exercise complete');
                speechSynthesis.speak(completeUtterance);
                console.log("Finished saying ".concat(word, " ").concat(wordCount, " times."));
            }
        }
    };
    var scheduleNextWord = function () {
        var timeInterval = getRandomTimeInterval(minTimeInterval, maxTimeInterval);
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
function getRandomTimeInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// For demonstration purposes, attaching functions to window to make them accessible from HTML
window.startExercise = startExercise;
window.stopExercise = stopExercise;
