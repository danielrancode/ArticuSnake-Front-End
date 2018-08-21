document.addEventListener("DOMContentLoaded", function() {
  fetch("http://localhost:3000/api/v1/sentences")
    .then(text => text.json())
    .then(sentenceObjectArray => runApplication(sentenceObjectArray))

  let currentWord
  let counter = 0
  let button = document.getElementById('word-button')

  button.addEventListener('click', function(e) {
    e.preventDefault()
    let input = e.target.parentElement.children[0]
    let wordDiv = document.getElementById(`word-${++counter}`)
    if (wordDiv.innerText === input.value) {
      wordDiv.style.color = 'green'
    } else {
      wordDiv.style.color = 'red'
    }
    input.value = ""
  })

  function runApplication(sentenceArray) {
    let sentence = getRandomSentence(sentenceArray)
    let sentenceWordArray = sentence.content.split(" ")
    displaySentence(sentenceWordArray)
  }

  function isWordMatching(word, input) {
      return (input === word)
    }

  // function runGame(sentenceArray) {
  //   let currentRound = 1
  //   while (currentRound < 3) {
  //     clearDivs()
  //     let sentence = getRandomSentence(sentenceArray)
  //     let sentenceWordArray = sentence.content.split(" ")
  //
  //     round(sentenceWordArray)
  //     currentRound ++
  //   }
  // }

  function round(sentenceWordArray) {
    let counter = 0
    let score = 0
    // sentenceWordArray.forEach(word => {
    //   currentWord = word
    //   let wordDiv = document.getElementById(`word-${++counter}`)
    //   if (isWordMatching(word)) {
    //     wordDiv.style.color = 'green'
    //     ++ score
    //   }else{
    //     wordDiv.style.color = 'red'
    //   }
    // })
      console.log(`${score} out of ${sentenceWordArray.length} correct`)
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
