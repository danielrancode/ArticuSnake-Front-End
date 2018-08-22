document.addEventListener("DOMContentLoaded", function() {
  fetch("http://localhost:3000/api/v1/sentences")
    .then(text => text.json())
    .then(sentenceObjectArray => runApplication(sentenceObjectArray))

  let currentWord
  let currentSentenceArray
  let allSentences
  let wordCounter = 0
  let button = document.getElementById('word-button')

  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new SpeechRecognition()
  let firstOutput = document.querySelector('.heard-output')

  // recognition.onend = function() {
  //   recognition.stop();
  //   console.log('Speech recognition has stopped.');
  // }

  //Listen for when the user finishes talking
  recognition.addEventListener('result', e => {
      if (wordCounter != currentSentenceArray.length) {
        let transcript = e.results[0][0].transcript.toLowerCase()
        console.log(transcript)
        let wordDiv = document.getElementById(`word-${++wordCounter}`)
        updateWord(wordDiv, transcript)
        if (wordCounter == currentSentenceArray.length) {
          
          stopMic()
          round(allSentences)
        } else {
          startMic()
        }
      }
  });

  function startMic() {
    recognition.onend = function() {
      recognition.start()
      console.log("running Start Mic")
    }
  }

  function stopMic() {
    // recognition.onend = function() {
        recognition.stop()
        console.log("running stop mic")

    // }
  }

  function runApplication(sentenceObjectArray) {
    allSentences = sentenceObjectArray
    round(allSentences)
  }

  function round(sentenceObjectArray) {
    wordCounter = 0
    clearDivs()
    let sentence = getRandomSentence(sentenceObjectArray)
    currentSentenceArray = sentence.content.split(" ")
    displaySentence(currentSentenceArray)
    recognition.start()
    console.log("hitting the round function")
  }

  function updateWord(wordDiv, input) {
    if (wordDiv.innerText === input) {
      wordDiv.style.color = 'green'
    } else {
      wordDiv.style.color = 'red'
    }
  }


  function getRandomSentence(info) {
    return info[Math.floor(Math.random()*info.length)];
  }

  function displaySentence(sentenceWordArray) {
    const sentenceDiv = document.getElementById("sentence")
    let counter = 0
    sentenceWordArray.forEach(word => {
      const wordDiv = document.createElement("div")
      wordDiv.setAttribute("id", `word-${++counter}`)
      wordDiv.setAttribute("class", "word-box")
      wordDiv.innerText = word
      sentenceDiv.appendChild(wordDiv)
    })
  }

  function clearDivs() {
    const sentenceDiv = document.getElementById("sentence")
    sentenceDiv.innerHTML = ""
  }

})
