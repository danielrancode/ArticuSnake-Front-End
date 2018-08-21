document.addEventListener("DOMContentLoaded", function() {
  fetch("http://localhost:3000/api/v1/sentences")
    .then(text => text.json())
    .then(sentenceObjectArray => runApplication(sentenceObjectArray))

  let currentWord
  let currentSentenceArray
  let allSentences
  let wordCounter = 0
  let button = document.getElementById('word-button')

  button.addEventListener('click', function(e) {
    e.preventDefault()
    if (wordCounter != currentSentenceArray.length) {
      let input = e.target.parentElement.children[0]
      let wordDiv = document.getElementById(`word-${++wordCounter}`)
      updateWord(wordDiv, input)
      input.value = ""
    } else {
      round(allSentences)

    }
  })

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
  }

  function updateWord(wordDiv, input) {
    if (wordDiv.innerText === input.value) {
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
