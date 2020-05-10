export default (function () {
  function getLetterScore(BOARD, FRENCH_POINTS, currentCoordinates, savedCoordinates, key) {
    if(savedCoordinates[key]) {
      return { score: FRENCH_POINTS[savedCoordinates[key]] }
    }
    if(!currentCoordinates[key]) { return }

    let score, factor
    score = FRENCH_POINTS[currentCoordinates[key]]

    let [line, column] = key.split('-').map(value => parseInt(value, 10))
    switch(BOARD[line][column]['type']) {
      case 'TripleWord':
        factor = 3
        break
      case 'DoubleWord':
        factor = 2
        break
      case 'TripleLetter':
        score = score * 3
        break
      case 'DoubleLetter':
        score = score * 2
        break
      default:
    }

    return { score: score, factor: factor }
  }

  return { getLetterScore: getLetterScore }
})()