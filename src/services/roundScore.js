export default (function () {
  // Return the score of a round, based on letter coordinates of this round and a letterScore method
  // which contains the letter coordinates of previous round, board characteristics and letter score.
  //
  // Define the direction of the word of the round. And iterate on each letter to find words in the other direction.
  // Reduce these words to arrays of factors. Make the sum of each product of these factors.
  //
  // letterScore return an Object with
  // - the score which is an integer between 0 and 30. Take into account double letter and triple letter
  // - the factor which is undefined, 2 or 3. related to double word and triple word.
  // letterScore expect a key ('y-x' with x and y being integer between 0 and 14) as argument
  //
  // currentKeys contains the letter coordinates of the round with the format 'y-x'.
  function score(letterScore, currentKeys) {
    let words, scrabble = 0
    let buildKeyForColumn = (column, line) => { return line.toString() + '-' + column.toString() }
    let buildKeyForLine = (line, column) => { return line.toString() + '-' + column.toString() }

    if(currentKeys.length === 0) { return 0 }

    if(areOnColumn(currentKeys)) {
      words = currentKeys.map((key) => {
        let [line, column] = key.split('-').map(value => parseInt(value, 10))

        return reduceOverDirection(column, letterScore, buildKeyForLine.bind(null, line))
      })

      let [line, column] = currentKeys[0].split('-').map(value => parseInt(value, 10))
      words.push(reduceOverDirection(line, letterScore, buildKeyForColumn.bind(null, column)))
    } else if(areOnLine(currentKeys)) {
      words = currentKeys.map((key) => {
        let [line, column] = key.split('-').map(value => parseInt(value, 10))

        return reduceOverDirection(line, letterScore, buildKeyForColumn.bind(null, column))
      })

      let [line, column] = currentKeys[0].split('-').map(value => parseInt(value, 10))
      words.push(reduceOverDirection(column, letterScore, buildKeyForLine.bind(null, line)))
    } else {
      return 0
    }

    if(currentKeys.length === 7) { scrabble = 50 }

    return words.reduce((sum, wordFactors) => sum + wordFactors.reduce((product, factor) => product * factor, 1), 0) + scrabble
  }

  // Return true if all current position have the same line index
  function areOnLine(keys) {
    let line = keys[0].split('-')[0]

    return keys.every((key) => key.split('-')[0] === line)
  }

  // Return true if all current position have the same column index
  function areOnColumn(keys) {
    let column = keys[0].split('-')[1]

    return keys.every((key) => key.split('-')[1] === column)
  }

  // Iterate on line or column direction in both sens from an initial line or column index.
  // The other line or column index is fixed and already passed as argument into buildKey.
  // Reduce word (each position with letter on the same line or column without space) to an array
  // of factors. The product of its factors is the score of the word.
  //
  // initialIndex is an integer between 0 and 14
  // It is the index line or index column of a current letter.
  //
  // letterScore return an Object with
  // - the score which is an integer between 0 and 30. Take into account double letter and triple letter
  // - the factor which is undefined, 2 or 3. related to double word and triple word.
  // letterScore expect a key ('y-x' with x and y being integer between 0 and 14) as argument
  //
  // buildKey returns a string 'y-x' where x and y are integer between 0 and 14
  // - y is the index of the line
  // - x is the index of the column
  // builKey already have a fixed column or fixed line index and expect to receive the other index as argument.
  function reduceOverDirection(initialIndex, letterScore, buildKey) {
    // wordPresent ensure we won't count a one letter word.
    let factors = [0], wordPresent = false, scoreObj, index

    index = initialIndex - 1
    while(index >= 0) {
      scoreObj = letterScore(buildKey(index))
      if(!scoreObj) { break }

      factors = [...letterScoreToFactorsReducer(factors, scoreObj)]
      index = index - 1
      wordPresent = true
    }

    index = initialIndex + 1
    while(index <= 14) {
      scoreObj = letterScore(buildKey(index))
      if(!scoreObj) { break }

      factors = [...letterScoreToFactorsReducer(factors, scoreObj)]
      index = index + 1
      wordPresent = true
    }

    if(wordPresent) {
      scoreObj = letterScore(buildKey(initialIndex))
      factors = [...letterScoreToFactorsReducer(factors, scoreObj)]
    }

    return factors
  }

  function letterScoreToFactorsReducer(factors, letterScore) {
    factors[0] = factors[0] + letterScore.score
    if(letterScore.factor) { factors.push(letterScore.factor) }
    return factors
  }

  return { score: score }
})()