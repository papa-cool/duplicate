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
import { getDatabase, ref, child, set, get, onValue } from "firebase/database"
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

// We can play with 3 modes
// - solo: monoplayer locale game.
// - duplicate: multiplayer synchronized game playing at the same time with the same easel (in dev).
// - classic: multiplayer synchronized game playing each in turn with 2 easel pulling to the same stack (in the future).
// The DuplicateContainer handle the game logic for duplicate mode.
// It returns the GameContainer which contains all game components
//
// Process for each round of duplicate mode
// - the easel of the winner (or the creator) pull letter from the stack and synchronize stack and easel letters
// - easel containers listen for state changes to get their letters
// - each player move the desired letters to their board getting the score calculating
// - everyone play the round synchronizing the score and storing the letters
// - then player containers listen for state changes
// - the board of the winner of the round (or the game creator in case of equality) synchronize its state
// - board containers listen for state changes to get their board up to date
// 
// It would probably be better to use firebase function to define and store the best play instead of
// doing it on one of the client. But it seems simpler to me to start using it on a client.
// 
// remote storage in duplicate mode
// games: {
//   gameId: {
//     players: {
//       name1: [33,77,104,...],
//       name2: [29,84,102,...],
//       ...
//     },
//     stack: ["A","J","F","U","R","P","D","H",...],
//     easel: ["A","B","C","D","E","F","G"],
//     board: {
//       saved: {"7-7": C, "7-8": O, "7-9": O, "7-10": L, ...},
//       current:  {"5-9": T, "6-9": R, "7-9": O, "8-9": L, "9-9": L},
//     }
//   }
// }
function GameContainer(props) {
  const params = useParams() // gameId and name

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
  const [players,setPlayers] = useState({});
  // Is set to true when the game begin.
  // It allows to determine if the stack has been created.
  const [started,setStarted] = useState(false);
  // On duplicate or classic mode, the user will wait after each round that other player have
  // played too. During this time, letters cannot be moved.
  const [waiting,setWaiting] = useState(false);
  const [creator,setCreator] = useState(false);

  // Check if winner or creator, then play and sync, else do nothing
  useEffect(() => {
    if (score === 0) { return }
    if (isNotWinner()) { return }
    
    syncBoardAndEasel()
  }, [players])

  // We want the user not to be able to move its letters anymore before sending its score to firebase.
  useEffect(() => {
    if (waiting) {
      syncScore()
    }
  }, [waiting])

  // We want to refresh the current score each time the board changes.
  useEffect(() => {
    calculateScore()
  }, [currentBoardLetters])
  
  useEffect(() => {
    const gameRef = ref(getDatabase(), 'games/'+params.gameId)
    const creatorRef = child(gameRef, 'creator')
    const playersRef = child(gameRef, 'players')
    const playerRef = child(playersRef, params.name)
    const lettersRef = child(gameRef, 'letters')

    // If the creator does not exist remotely, it means the current user is the creator.
    get(creatorRef).then((snapshot) => {
      if (snapshot.exists()) {
        setCreator(snapshot.val() === params.name)
      } else {
        set(creatorRef, params.name)
        setCreator(true)
      }
    }).catch((error) => {
      console.error(error)
    })

    // We want the new player to be displayed for every users.
    get(playerRef).then((snapshot) => {
      if (!snapshot.exists()) {
        // We store an array containing 0 because firebase don't store empty object/array.
        set(playerRef, [0])
      }
    }).catch((error) => {
      console.error(error)
    })

    // We want to sync players and their scores between every users.
    onValue(playersRef, (snapshot) => {
      if (snapshot.exists()) {
        // We only update the state if every players have played.
        if ([...new Set(Object.entries(snapshot.val()).map(([_name, scores]) => scores.length))].length === 1) {
          setPlayers(snapshot.val())
        }
      }
    })

    // We want to sync letters (easel and board) between every users.
    // Each time the letters are updated, a new round start.
    onValue(lettersRef, (snapshot) => {
      if (snapshot.exists()) {
        setStackLetters(snapshot.val()['stack'])
        setEaselLetters(snapshot.val()['easel'] || [])
        setSavedBoardLetters(snapshot.val()['board'] || {})
        setCurrentBoardLetters({})
        setScore(0)
        setStarted(true)
        setWaiting(false)
      }
    })
    
    return () => {
      console.log("Removing firebase listeners playersRef and lettersRef")
      gameRef.off("players")
      gameRef.off("letters")
      console.log("Removed firebase listeners playersRef and lettersRef")
    }
  }, [])

  // Create the stack and fill the easel for the first time
  // Only used on duplicate mode.
  const start = () => {
    syncBoardAndEasel()
  }

  // End the round and start a new round
  // 
  // On solo mode
  // It saves current letters and fills the easel with letter from the stack.
  // 
  // On dupicate mode
  // It only sync the score.
  // Then, only the user with the best score will save its current letters, fill the easel and sync
  // the new round
  const play = () => {
    setWaiting(true)
  }

  const isNotWinner = () => {
    let myScores = players[params.name]
    return Object.entries(players).some(([name, scores], _index) => {
      // We don't sync if a player has a better score
      // In case of equality, it is the creator that will sync its game.
      // This last rule must be improved as it won't work for three players.
      if (name === params.name) { return false }
      if (scores[scores.length-1] > myScores[myScores.length-1]) { return true }
      if (!creator && scores[scores.length-1] === myScores[myScores.length-1]) { return true }
      return false
    })
  }

  // EASEL STATE MANAGEMENT

  const syncBoardAndEasel = () => {
    const lettersRef = ref(getDatabase(), 'games/'+params.gameId+'/letters')
    let stack, letters
    let board = {...savedBoardLetters, ...currentBoardLetters}

    if (stackLetters.length === 0) {
      // Create the stack at the beginning of the game.
      stack = Knuth.knuthShuffle(FRENCH)
    } else {
      stack = stackLetters
    }
    letters = stack.splice(0, 7-easelLetters.length)

    set(lettersRef, {stack: stack, easel: easelLetters.concat(letters), board: board})
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

  // SCORE/PLAYERS STATE MANAGEMENT

  const syncScore = () => {
    const playerRef = ref(getDatabase(), 'games/'+params.gameId+'/players/'+params.name)
    let newPlayers = {...players}
    let scores = newPlayers[params.name]

    scores.push(score)
    set(playerRef, scores)
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
    if(waiting) { return }

    changeSelectedSquare(index)
  }

  const letterRegex = new RegExp("[A-Z ]")

  const handleKeyDownOnBoard = (event) => {
    if(waiting) { return }

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
      } else {
        start()
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
