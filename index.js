document.addEventListener("DOMContentLoaded", function() {
  fetch("http://localhost:3000/api/v1/sentences")
    .then(text => text.json())
    .then(sentenceObjectArray => runApplication(sentenceObjectArray))

    let sentenceDiv = document.getElementById('sentence')
    let currentSentenceArray
    let allSentences
    let currentScore
    let wordCounter = 0
    let button = document.getElementById('word-button')
    let firstOutput = document.querySelector('.heard-output')
    const correctSound = new sound("gotWordRight.wav");
    const incorrectSound = new sound("gotWordWrong.wav");
    let wordHeardDiv = document.getElementById('word-heard')

    // set-up recognition
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition()

  recognition.onspeechend = () => {
    // console.log("onspeechend, about to hit restartMic()")
    restartMic()
  }

  recognition.addEventListener('result', e => {
      if (wordCounter != currentSentenceArray.length) {
        let transcript = e.results[0][0].transcript.toLowerCase()
        let input = convertHomonym(transcript)
        let wordDiv = document.getElementById(`word-${++wordCounter}`)
        console.log(`Word recognized: ${input}`);
        updateWord(wordDiv, input)
        if (wordCounter == currentSentenceArray.length) {
          setTimeout(() => resultScreen(), 1000)
          setTimeout(() => {
            round(allSentences)
          }, 6000);
        }
      }
  });


  function restartMic() {
      recognition.stop()
      setTimeout(() => {
        recognition.start()
        // console.log("restarted!")
        }, 500)
    }

  function runApplication(sentenceObjectArray) {
    allSentences = sentenceObjectArray
    restartMic()
    round(allSentences)
  }

  function round(sentenceObjectArray) {
    wordCounter = 0
    currentScore = 0
    clearDivs()
    let sentence = getRandomSentence(sentenceObjectArray)
    currentSentenceArray = sentence.content.split(" ")
    displaySentence(currentSentenceArray)
    // debugger
  }

  function updateWord(wordDiv, input) {
    wordHeardDiv.innerText = `You said: ${input}`
    wordHeardDiv.className = "on"
    if (wordDiv.innerText.toLowerCase() === input) {
      wordDiv.style.color = 'green'
      correctSound.play()
      currentScore ++
    } else if (wordDiv.innerText.toLowerCase() == "too" || wordDiv.innerText.toLowerCase() == "too") {
        if (input === "2") {
          wordDiv.style.color = 'green'
          correctSound.play()
          currentScore ++
        } else {
          wordDiv.style.color = 'red'
          incorrectSound.play()
        }
    } else {
      wordDiv.style.color = 'red'
      incorrectSound.play()
    }
  }

  function getRandomSentence(info) {
    return info[Math.floor(Math.random()*info.length)];
  }

  function displaySentence(sentenceWordArray) {
    wordHeardDiv.innerText = ""
   const sentenceDiv = document.getElementById("sentence")
   let counter = 1
   sentenceWordArray.forEach(word => {
     const wordDiv = document.createElement("div")
     let newDiv = makeDiv(counter, word)
     sentenceDiv.appendChild(newDiv)
     let divToAnimate = document.getElementById(`word-${counter}`)
     setWordDivPosition(divToAnimate)
          setInterval(() => {
            setWordDivPosition(divToAnimate);
            console.log(`setWordDivPosition(divToAnimate), divToAnimate = ${divToAnimate}`)
          }, 5000)
     ++counter
   })
 }

 function makeDiv(num, word){
     wordDiv = document.createElement("div")

     wordDiv.setAttribute("id", `word-${num}`)
     wordDiv.setAttribute("class", "word-box")

     setWordDivPosition(wordDiv)

     wordDiv.innerText = word
     return wordDiv
   }

    function setWordDivPosition(wordDiv) {
      width = sentenceDiv.offsetWidth
      height = sentenceDiv.offsetHeight

      // make position sensitive to size and document's width
      posx = (Math.random() * width)
      posy = (Math.random() * height)

      wordDiv.style.position = 'absolute'
      wordDiv.style.left = `${posx}px`
      wordDiv.style.top = `${posy}px`

    }

    function clearDivs() {
      const sentenceDiv = document.getElementById("sentence")
      const resultDiv = document.getElementById("results")
      sentenceDiv.innerHTML = ""
      wordHeardDiv.innerHTML = ""
      wordHeardDiv.className = ""
      if (document.contains(resultDiv)) {
        resultDiv.innerText = "";
      }
    }

    function resultScreen() {

      resultDiv = document.getElementById("results")
      let total = currentSentenceArray.length
      let text = document.createTextNode(`your score is ${currentScore} / ${total}`)
      clearDivs();
      resultDiv.appendChild(text)
    }

      function sound(src) {
       this.sound = document.createElement("audio");
       this.sound.src = src;
       this.sound.setAttribute("preload", "auto");
       this.sound.setAttribute("controls", "none");
       this.sound.style.display = "none";
       document.body.appendChild(this.sound);
       this.play = function(){
           this.sound.play();
       }
       this.stop = function(){
           this.sound.pause();
     }
    }

  function convertHomonym(transcript) {
    switch (transcript) {
      case "8":
        transcript = "ate"
        break;
      case "4":
        transcript = "for"
        break;
      default:
        transcript = transcript
        break;
    }
    return transcript
  }

})
