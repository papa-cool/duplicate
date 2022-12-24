import React from 'react';
import styles from './gameContainer.module.css';
import BoardContainer from './boardContainer.jsx';
import EaselContainer from './easelContainer.jsx';
import PlayerContainer from './playerContainer.jsx';
import Knuth from '../services/knuthShuffle.js';
import letterScore from '../services/letterScore.js';
import roundScore from '../services/roundScore.js';
import tableCursor from '../services/tableCursor.js';
import BOARD from '../data/board.js';
import { FRENCH, FRENCH_POINTS } from '../data/lettersDistribution.js';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, child, set, get, onValue } from "firebase/database";
import PropTypes from 'prop-types';

function withRouter(GameContainer) {
  return (props) => {
    const params = useParams();
    return <GameContainer {...props} gameId={params.id} name={params.name} />
  }
}

// The GameContainer is the main component of the App.
// It is composed of
// - a board component that handle the position and the mobility of the letters.
// - an easel component that manage available letters for each round.
// - a player component that handle the display of the saved score.
// - a div where we display the calculated score of the ongoing round.
// - a textarea where the user can write its idea.
//
// We can play with 3 modes
// - solo: monoplayer locale game.
// - duplicate: multiplayer synchronized game playing at the same time with the same easel (in dev).
// - classic: multiplayer synchronized game playing each in turn with 2 easel pulling to the same stack (in the future).
//
// Process for each round of solo mode
// - pull letter from the stack to fill the easel
// - move the desired letters to the board calculating the score
// - play the round storing the score and the letters
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
class GameContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      // Stack of letters that will be pull after each round to fill the easel
      // in order to have 7 letters per round.
      stackLetters: [],
      // Letters displayed in the easel and that can be move to the board during the round.
      easelLetters: [],
      // The index of the square we have the focus on.
      // Any action on the board will be applied on the selected square.
      selectedSquareIndex: null,
      // Letters on the board that have been moved is the current rounds.
      // They can be moved back to the easel.
      currentBoardLetters: {},
      // Letters on the board that have been moved and played during previous rounds.
      // They cannot be moved back to the easel. They are freeze until the end of the game.
      savedBoardLetters: {},
      score: 0,
      name: '',
      players: {},
      // On duplicate or classic mode, the user will wait after each round that other player have
      // played too. During this time, letters cannot be moved.
      waiting: false,
      creator: false
    }
  }

  // If the game id does not exist yet on firebase, we want to create the game making the current
  // user the creator of the game.
  // If the game id already exist on firebase, we wait for the form submission in order to add
  // the new user in the game
  componentDidMount() {
    if (this.props.mode === "solo") {
      let stack = Knuth.knuthShuffle(FRENCH)
      let letters = stack.splice(0, 7)

      this.setState({
        stackLetters: stack,
        easelLetters: letters,
        name: 'Solitaire',
        players: { Solitaire: [] }
      })
      return
    }

    const gameRef = ref(getDatabase(), 'games/'+this.props.gameId);
    const creatorRef = child(gameRef, 'creator');
    const playersRef = child(gameRef, 'players');
    const playerRef = child(playersRef, this.props.name);

    // If the creator does not exist remotely, it means the user is the creator.
    get(creatorRef).then((snapshot) => {
      if (snapshot.exists()) {
        this.setState({creator: snapshot.val() === this.props.name})
      } else {
        set(creatorRef, this.props.name)
        this.setState({creator: true})
      }
    }).catch((error) => {
      console.error(error);
    });

    // We want the new player to be displayed for every users.
    get(playerRef).then((snapshot) => {
      if (!snapshot.exists()) {
        // We store an array containing 0 because firebase don't store empty object/array.
        set(playerRef, [0])
      }
    }).catch((error) => {
      console.error(error);
    });

    // We want to sync players and their scores between every users.
    onValue(playersRef, (snapshot) => {
      if (snapshot.exists()) {
        this.setState({ players: snapshot.val() })
      }
    });
  }

  // End the round and start a new round
  // 
  // On solo mode
  // It saves current letters and fills the easel with letter from the stack.
  play() {
    this.saveScore()
    this.saveCurrentBoardLetters()
    this.pullFromStack()
  }

  // EASEL STATE MANAGEMENT

  // Pull new letter from the stack to fill the easel after playing letters on the board.
  pullFromStack() {
    let stack = this.state.stackLetters
    let letters = stack.splice(0, 7-this.state.easelLetters.length)

    this.setState({
      stackLetters: stack,
      easelLetters: this.state.easelLetters.concat(letters),
    })
  }

  // return the queryLetter if present in the array this.state.easelLetters
  getLetter(queryLetter) {
    let letter = null
    let letters = this.state.easelLetters

    this.state.easelLetters.some((element, index) => {
      if(element === queryLetter) {
        letter = element
        letters.splice(index, 1)
        this.setState({easelLetters: letters})
        return true
      }
      return false
    })

    return letter
  }

  resetLetter(letter) {
    this.state.easelLetters.push(letter)
    this.setState({easelLetters: this.state.easelLetters})
  }

  // BOARD STATE MANAGEMENT

  changeSelectedSquare(index) {
    this.setState({selectedSquareIndex: index})
  }

  removeSelection() {
    this.setState({selectedSquareIndex: null})
  }

  moveLetter(letter) {
    // We cannot move any letter if no square are selected.
    if(!this.state.selectedSquareIndex) { return }
    // We cannot move any letter on a square where a letter have already been played.
    if(this.state.savedBoardLetters[this.state.selectedSquareIndex]) { return }

    let { [this.state.selectedSquareIndex]: _, ...new_current } = this.state.currentBoardLetters;
    // If a letter has already been moved on the selected square,
    // the letter is sent back to the easel before being replaced.
    if(this.state.currentBoardLetters[this.state.selectedSquareIndex]) {
      this.resetLetter(this.state.currentBoardLetters[this.state.selectedSquareIndex])
    }
    // The requested letter is moved to the selected square if available in the easel.
    if(this.getLetter(letter)) {
      new_current[this.state.selectedSquareIndex] = letter
    }
    
    this.setState({currentBoardLetters: new_current}, () => this.calculateScore())
  }

  removeLetter() {
    // Nothing to remove if no square are selected.
    if(!this.state.selectedSquareIndex) { return }
    // A saved letter is freeze and cannot be removed.
    if(this.state.savedBoardLetters[this.state.selectedSquareIndex]) { return }
    // If present, the letter on the selected square is sent back to the easel.
    if(this.state.currentBoardLetters[this.state.selectedSquareIndex]) {
      this.resetLetter(this.state.currentBoardLetters[this.state.selectedSquareIndex])
    }

    let { [this.state.selectedSquareIndex]: _, ...new_current } = this.state.currentBoardLetters;
    this.setState({currentBoardLetters: new_current}, () => this.calculateScore())
  }

  saveCurrentBoardLetters() {
    this.setState({
      currentBoardLetters: {},
      savedBoardLetters: {...this.state.savedBoardLetters, ...this.state.currentBoardLetters}
    })    
  }

  // SCORE/PLAYERS STATE MANAGEMENT

  saveScore() {
    let players = {...this.state.players}
    let scores = players[this.state.name]
    let last_score = scores[scores.length - 1] || 0

    scores.push(this.state.score + last_score)

    this.setState({players: players, score: 0})
  }

  calculateScore() {
    this.setState({
      score: roundScore.score(
        letterScore.bind(null, BOARD, FRENCH_POINTS, this.state.currentBoardLetters, this.state.savedBoardLetters),
        Object.keys(this.state.currentBoardLetters)
      )
    })
  }

  // USER EVENT MANAGEMENT

  // Select a square.
  handleClickOnBoard = (clickedSquare) => {
    if(this.state.waiting) { return }

    this.changeSelectedSquare(clickedSquare.props.index)
  }

  // Add pressed letter if available to the selected square.
  handleKeyPressOnBoard(event) {
    if(this.state.waiting) { return }

    this.moveLetter(event.key.toUpperCase())
  }

  handleKeyDownOnBoard(event) {
    if(this.state.waiting) { return }

    if(event.keyCode === 8 || event.keyCode === 46) {
      this.removeLetter()
    } else if(event.keyCode === 37) {
      this.changeSelectedSquare(tableCursor.left(this.state.selectedSquareIndex))
    } else if(event.keyCode === 38) {
      this.changeSelectedSquare(tableCursor.up(this.state.selectedSquareIndex))
    } else if(event.keyCode === 39) {
      this.changeSelectedSquare(tableCursor.right(this.state.selectedSquareIndex))
    } else if(event.keyCode === 40) {
      this.changeSelectedSquare(tableCursor.down(this.state.selectedSquareIndex))
    } else if(event.keyCode === 13) {
      this.play()
    }
  }

  handleBlurOnBoard() {
    this.removeSelection()
  }

  render() {
    return (
      <div className={styles.game}>
        <div className={styles.board}>
          <BoardContainer
            selectedIndex={this.state.selectedSquareIndex}
            letterPositions={{...this.state.savedBoardLetters, ...this.state.currentBoardLetters}}
            handleKeyPress={this.handleKeyPressOnBoard.bind(this)}
            handleKeyDown={this.handleKeyDownOnBoard.bind(this)}
            handleBlur={this.handleBlurOnBoard.bind(this)}
            handleClick={this.handleClickOnBoard}
          />
        </div>
        <div className={styles.panel}>
          <div className={styles.players}>
            <PlayerContainer players={this.state.players}/>
          </div>
          <div className={styles.round}>
            <div className={styles.round_score}>
              { this.state.score }
            </div>
          </div>
          <div className={styles.easel}>
            <EaselContainer letters={this.state.easelLetters}/>
          </div>
          <div className={styles.draft}>
            <textarea className={styles.textarea} name="draft" />
          </div>
        </div>
      </div>
    );
  }
}

GameContainer.propTypes = {
  mode: PropTypes.string,// solo, duplicate, classic
  gameId: PropTypes.string,
  name: PropTypes.string
};

export default withRouter(GameContainer);
