document.addEventListener("DOMContentLoaded", function() {
  fetch("http://localhost:3000/api/v1/sentences")
    .then(text => text.json())
    .then(sentenceObjectArray => runApplication(sentenceObjectArray))

    // set-up recognition
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition()

  recognition.onspeechend = () => {
    console.log("onspeechend, about to hit restartMic()")
    restartMic()
  }

  recognition.addEventListener('result', e => {
      if (wordCounter != currentSentenceArray.length) {
        let transcript = e.results[0][0].transcript.toLowerCase()
        console.log(transcript)
        let wordDiv = document.getElementById(`word-${++wordCounter}`)
        updateWord(wordDiv, transcript)
        if (wordCounter == currentSentenceArray.length) {
          round(allSentences)
        }
      }
  });

  let currentSentenceArray
  let allSentences
  let wordCounter = 0
  let button = document.getElementById('word-button')
  let firstOutput = document.querySelector('.heard-output')

  function restartMic() {
      recognition.stop()
      setTimeout(() => {
        recognition.start()
        console.log("restarted!")
        }, 500)
    }

  function runApplication(sentenceObjectArray) {
    allSentences = sentenceObjectArray
    restartMic()
    round(allSentences)
  }

  function round(sentenceObjectArray) {
    wordCounter = 0
    clearDivs()
    let sentence = getRandomSentence(sentenceObjectArray)
    currentSentenceArray = sentence.content.split(" ")
    displaySentence(currentSentenceArray)
  }

  function updateWord(wordDiv, input) {
    if (wordDiv.innerText.toLowerCase() === input) {
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
   let counter = 1
   sentenceWordArray.forEach(word => {
     const wordDiv = document.createElement("div")
     let newDiv = makeDiv(counter, word)

     sentenceDiv.appendChild(newDiv)
     ++ counter
   })
 }

   function makeDiv(num, word){
    wordDiv = document.createElement("div")

    wordDiv.setAttribute("id", `word-${num}`)
    wordDiv.setAttribute("class", "word-box")

    // make position sensitive to size and document's width
    posx = (Math.random() * window.innerWidth.toFixed())
    posy = (Math.random() * window.innerHeight.toFixed())

    wordDiv.style.position = 'absolute'
    wordDiv.style.left = `${posx}px`
    wordDiv.style.top = `${posy}px`
    // wordDiv.style.display = 'none'
    wordDiv.innerText = word
    return wordDiv
  }

    function clearDivs() {
      const sentenceDiv = document.getElementById("sentence")
      sentenceDiv.innerHTML = ""
    }

})
