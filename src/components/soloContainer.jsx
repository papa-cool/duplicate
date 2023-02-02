import React from 'react'
import styles from './gameContainer.module.css'
import BoardContainer from './boardContainer.jsx'
import EaselContainer from './easelContainer.jsx'
import PlayerContainer from './playerContainer.jsx'
import Knuth from '../services/knuthShuffle.js'
import letterScore from '../services/letterScore.js'
import roundScore from '../services/roundScore.js'
import tableCursor from '../services/tableCursor.js'
import BOARD from '../data/board.js'
import { FRENCH, FRENCH_POINTS } from '../data/lettersDistribution.js'
import { useState, useEffect } from 'react'

// We can play with 3 modes
// - solo: monoplayer locale game.
// - duplicate: multiplayer synchronized game playing at the same time with the same easel (in dev).
// - classic: multiplayer synchronized game playing each in turn with 2 easel pulling to the same stack (in the future).
// The SoloContainer handle the game logic for solo mode.
// It returns the GameContainer which contains all game components
//
// Process for each round of solo mode
// - pull letter from the stack to fill the easel
// - move the desired letters to the board calculating the score
// - play the round storing the score and the letters
function GameContainer(props) {
  // Stack of letters that will be pull after each round to fill the easel
  // in order to have 7 letters per round.
  const [stackLetters,setStackLetters] = useState([]);
  // Letters displayed in the easel and that can be move to the board during the round.
  const [easelLetters,setEaselLetters] = useState([]);
  // The index of the square we have the focus on.
  // Any action on the board will be applied on the selected square.
  const [selectedSquareIndex,setSelectedSquareIndex] = useState(null);
  // Letters on the board that have been moved is the current rounds.
  // They can be moved back to the easel.
  const [currentBoardLetters,setCurrentBoardLetters] = useState({});
  // Letters on the board that have been moved and played during previous rounds.
  // They cannot be moved back to the easel. They are freeze until the end of the game.
  const [savedBoardLetters,setSavedBoardLetters] = useState({});
  const [score,setScore] = useState(0);
  const [name,setName] = useState('');
  const [players,setPlayers] = useState({});
  // Is set to true when the game begin.
  // It allows to determine if the stack has been created.
  const [started,setStarted] = useState(false);

  useEffect(() => {
    console.log("Setuping the game on solo mode")
    let stack = Knuth.knuthShuffle(FRENCH)
    let letters = stack.splice(0, 7)

    setStackLetters(stack)
    setEaselLetters(letters)
    setStarted(true)
    setName("Solitaire")
    setPlayers({ Solitaire: [] })

    console.log("Setup the game on solo mode")
    return
  }, [])

  // End the round and start a new round
  // 
  // It saves current letters and fills the easel with letter from the stack.
  const play = () => {
    saveScore()
    saveCurrentBoardLetters()
    pullFromStack()
    return
  }

  // EASEL STATE MANAGEMENT

  // Pull new letter from the stack to fill the easel after playing letters on the board.
  const pullFromStack = () => {
    let stack = stackLetters
    let letters = stack.splice(0, 7 - easelLetters.length)

    setStackLetters(stack)
    setEaselLetters(easelLetters.concat(letters))
  }

  // return the queryLetter if present in the array easelLetters
  const getLetter = (queryLetter) => {
    let letter = null
    let letters = easelLetters

    easelLetters.some((element, index) => {
      if(element === queryLetter) {
        letter = element
        letters.splice(index, 1)
        setEaselLetters(letters)
        return true
      }
      return false
    })

    return letter
  }

  const resetLetter = (letter) => {
    let letters = easelLetters

    letters.push(letter)
    setEaselLetters(letters)
  }

  // BOARD STATE MANAGEMENT

  const changeSelectedSquare = (index) => {
    setSelectedSquareIndex(index)
  }

  const removeSelection = () => {
    setSelectedSquareIndex(null)
  }

  useEffect(() => {
    calculateScore()
  }, [currentBoardLetters])

  const moveLetter = (letter) => {
    // We cannot move any letter if no square are selected.
    if(!selectedSquareIndex) { return }
    // We cannot move any letter on a square where a letter have already been played.
    if(savedBoardLetters[selectedSquareIndex]) { return }

    let { [selectedSquareIndex]: _, ...new_current } = currentBoardLetters
    // If a letter has already been moved on the selected square,
    // the letter is sent back to the easel before being replaced.
    if(currentBoardLetters[selectedSquareIndex]) {
      resetLetter(currentBoardLetters[selectedSquareIndex])
    }
    // The requested letter is moved to the selected square if available in the easel.
    if(getLetter(letter)) {
      new_current[selectedSquareIndex] = letter
    }
    
    setCurrentBoardLetters(new_current)
  }

  const removeLetter = () => {
    // Nothing to remove if no square are selected.
    if(!selectedSquareIndex) { return }
    // A saved letter is freeze and cannot be removed.
    if(savedBoardLetters[selectedSquareIndex]) { return }
    // If present, the letter on the selected square is sent back to the easel.
    if(currentBoardLetters[selectedSquareIndex]) {
      resetLetter(currentBoardLetters[selectedSquareIndex])
    }

    let { [selectedSquareIndex]: _, ...new_current } = currentBoardLetters
    setCurrentBoardLetters(new_current)
  }

  const saveCurrentBoardLetters = () => {
    setCurrentBoardLetters({})
    setSavedBoardLetters({...savedBoardLetters, ...currentBoardLetters})
  }

  // SCORE/PLAYERS STATE MANAGEMENT

  const saveScore = () => {
    let newPlayers = {...players}
    let scores = newPlayers[name]

    scores.push(score)
    setPlayers(newPlayers)
    setScore(0)
  }

  const calculateScore = () => {
    setScore(
      roundScore.score(
        letterScore.bind(null, BOARD, FRENCH_POINTS, currentBoardLetters, savedBoardLetters),
        Object.keys(currentBoardLetters)
      )
    )
  }

  // USER EVENT MANAGEMENT

  // Select a square.
  const handleClickOnBoard = (index) => {
    changeSelectedSquare(index)
  }

  const letterRegex = new RegExp("[A-Z ]")

  const handleKeyDownOnBoard = (event) => {
    if(event.code === "Backspace") {
      removeLetter()
    } else if(event.code === "ArrowLeft") {
      changeSelectedSquare(tableCursor.left(selectedSquareIndex))
    } else if(event.code === "ArrowUp") {
      changeSelectedSquare(tableCursor.up(selectedSquareIndex))
    } else if(event.code === "ArrowRight") {
      changeSelectedSquare(tableCursor.right(selectedSquareIndex))
    } else if(event.code === "ArrowDown") {
      changeSelectedSquare(tableCursor.down(selectedSquareIndex))
    } else if(event.code === "Enter") {
      if(started) {
        play()
      }
    } else if(letterRegex.test(event.key.toUpperCase())) {
      moveLetter(event.key.toUpperCase())
    }
  }

  const handleBlurOnBoard = () => {
    removeSelection()
  }

  return (
    <div className={styles.game}>
      <div className={styles.board}>
        <BoardContainer
          selectedIndex={selectedSquareIndex}
          letterPositions={{...savedBoardLetters, ...currentBoardLetters}}
          handleKeyDown={handleKeyDownOnBoard}
          handleBlur={handleBlurOnBoard}
          handleClick={handleClickOnBoard}
        />
      </div>
      <div className={styles.panel}>
        <div className={styles.players}>
          <PlayerContainer players={players}/>
        </div>
        <div className={styles.round}>
          <div className={styles.round_score}>
            { score }
          </div>
        </div>
        <div className={styles.easel}>
          <EaselContainer letters={easelLetters}/>
        </div>
        <div className={styles.draft}>
          <textarea className={styles.textarea} name="draft" />
        </div>
      </div>
    </div>
  )
}

export default GameContainer
