document.addEventListener("DOMContentLoaded", function() {

  let choice = prompt("Welcome! Do you want to learn by sentence or by word?").toLowerCase()

  fetch("http://localhost:3000/api/v1/sentences")
    .then(text => text.json())
    .then(sentenceObjectArray => runApplication(sentenceObjectArray))

  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition()

  let sentenceDiv = document.getElementById('sentence')
  let currentSentenceArray
  let allSentences
  let currentScore
  let wordCounter = 0
  let firstOutput = document.querySelector('.heard-output')
  const correctSound = new sound("gotWordRight.wav");
  const incorrectSound = new sound("gotWordWrong.wav");
  const despacitoSound = new sound("despacito.mp3")
  let wordHeardDiv = document.getElementById('word-heard')
  const photosDiv = document.getElementById('photos')

  function runApplication(sentenceObjectArray) {
    allSentences = sentenceObjectArray
    if (choice === "word") {
      restartMic()
    }
    round(allSentences)
  }



  if (choice === "sentence") {

    recognition.addEventListener('result', e => {
      let input = e.results[0][0].transcript
      inputArray = input.split(" ")
      wordHeardDiv.innerText = `You said: ${input}`
      if (input === "Alexa play despacito"){
        clearDivs();
        despacitoSound.play()
        let bieberDiv = document.getElementById("bieber")
        bieberDiv.style.display = "block"
      }
      checkIfShowMe(e)
      let slicedArray = inputArray.slice(0, currentSentenceArray.length)
      console.log(slicedArray)
      slicedArray.forEach(function(word) {
        updateWord(document.getElementById(`word-${++wordCounter}`), word)
      })

      setTimeout(() => {
        resultScreen()
      }, 1000);
      setTimeout(() => {
        round(allSentences)
      }, 4000);
    });

  } else if (choice === "word") {

    recognition.addEventListener('result', e => {
      console.log("listening")
      if (wordCounter != currentSentenceArray.length) {
        let transcript = e.results[0][0].transcript.toLowerCase()
        let input = convertHomonym(transcript)
        checkIfShowMe(e)
        checkIfDespacito(e)
        if (transcript === "alexa play despacito"){
          despacitoSound.play()
          let bieberDiv = document.getElementById("bieber")
          bieberDiv.style.display = "block"
        }
        let wordDiv = document.getElementById(`word-${++wordCounter}`)
        console.log(`Word recognized: ${input}`);
        updateWord(wordDiv, input)
        if (wordCounter == currentSentenceArray.length) {
          setTimeout(() => resultScreen(), 1000)
          setTimeout(() => {
            round(allSentences)
          }, 4000);
        }
      }
    })

    recognition.onspeechend = () => {
      restartMic()
    }
  }

  function checkIfDespacito(e) {
    let transcript = e.results[0][0].transcript.toLowerCase()
    if (transcript === "alexa play despacito"){
      despacitoSound.play()
    }
  }

  function checkIfShowMe(e) {
    photosDiv.innerHTML = ""
    let transcript = e.results[0][0].transcript.toLowerCase()
    splitWords = transcript.split(" ")
    if (splitWords[0] == "show" && splitWords[1] == "me"){
      fetch(`https://api.flickr.com/services/rest/?format=json&api_key=ff0739871df955182071444c826a2753&method=flickr.photos.search&nojsoncallback=1&per_page=14&media=photos&extras=url_l&tags=${splitWords[2]}`)
      .then(text => text.json())
      .then(picturesArray => postPhotos(picturesArray))
    }
  }

  function postPhotos(photosArray) {
    counter = 0
    photosArray.photos.photo.forEach(photo => {
      let newDiv = document.createElement('div')
      newDiv.setAttribute('id',`photo-${++counter}`)
      newDiv.setAttribute('class', "photo")
      newDiv.style.display = 'inline-block'
      newDiv.innerHTML = `<img src="${photo.url_l}" height="100" width="100">`
      photosDiv.appendChild(newDiv)
      setTimeout(x=>console.log('hi'), 3000)
    })
  }


  function restartMic() {
    recognition.stop()
    console.log("stopped Mic")
    setTimeout(() => {
      recognition.start()
      console.log("started Mic")
      }, 500)
  }

  function round(sentenceObjectArray) {
    if (choice === "sentence") {
      recognition.start()
    }
    wordCounter = 0
    currentScore = 0
    clearDivs()
    let sentence = getRandomSentence(sentenceObjectArray)
    currentSentenceArray = sentence.content.split(" ")
    displaySentence(currentSentenceArray)
  }

  function updateWord(wordDiv, input) {
     const value = input.toLowerCase()
     if (choice === "word") {
       wordHeardDiv.innerText = `you said: ${input}`
     }
     if (wordDiv.innerText.toLowerCase() === value) {
       wordDiv.style.color = 'green'
       correctSound.play()
       currentScore ++
     } else if (wordDiv.innerText.toLowerCase() == "too" || wordDiv.innerText.toLowerCase() == "too") {
         if (value === "2") {
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
      if (choice === "sentence") {
        recognition.stop()
      }
      resultDiv = document.getElementById("results")
      let total = currentSentenceArray.length
      let text = document.createTextNode(`you got ${currentScore} out of ${total} correct`)
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
