document.addEventListener("DOMContentLoaded", function() {
  fetch("http://localhost:3000/api/v1/sentences")
    .then(text => text.json())
    .then(parsed => runApplication(parsed))

  function runApplication(sentenceArray) {
    const sentence = getRandomSentence(sentenceArray)
    displaySentence(sentence)

  }
  function getRandomSentence(info) {
    return info[Math.floor(Math.random()*info.length)];
  }

  function displaySentence(sentence) {
    const sentenceWordArray = sentence.content.split(" ")
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


})
