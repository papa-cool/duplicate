import React from 'react';
import styles from './gameContainer.module.css';
import BoardContainer from './boardContainer.jsx';
import EaselContainer from './easelContainer.jsx';
import PlayerContainer from './playerContainer.jsx';
import letterScore from '../services/letterScore.js';
import roundScore from '../services/roundScore.js';
import BOARD from '../data/board.js';
import { FRENCH_POINTS } from '../data/lettersDistribution.js';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, child, set, get, onValue } from "firebase/database";

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
  // props:
  // multiplayer
  // gameId
  // name
  constructor(props){
    super(props)
    this.state = {
      score: 0,
      name: '',
      players: {},
      creator: false,
    }
    this.player = React.createRef()
    this.easel = React.createRef()
    this.round = React.createRef()
  }

  // If the game id does not exist yet on firebase, we want to create the game making the current
  // user the creator of the game.
  // If the game id already exist on firebase, we wait for the form submission in order to add
  // the new user in the game
  componentDidMount() {
    if (!this.props.multiplayer) {
      this.setState({ name: 'Solitaire', players: { Solitaire: [] } })
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
        set(gameRef, {creator: this.props.name})
        this.setState({creator: true})
      }
    }).catch((error) => {
      console.error(error);
    });

    // We want the new player to be displayed for every users.
    get(playerRef).then((snapshot) => {
      if (!snapshot.exists()) {
        // We store an empty string instead of an empty array because firebase don't store empty object/array.
        set(playerRef, "")
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

  roundScore = (currentLetters, savedLetters) => {
    this.setState({
      score: roundScore.score(letterScore.bind(null, BOARD, FRENCH_POINTS, currentLetters, savedLetters), Object.keys(currentLetters))
    })
  }

  pushScore(score) {
    let players = {...this.state.players}
    let scores = players[this.state.name]
    let last_score = scores[scores.length - 1] || 0

    scores.push(score + last_score)
    this.setState({players: players})
  }

  play = () => {
    this.pushScore(this.state.score)
    this.easel.current.pullFromStack()
    this.setState({score: 0})
  }

  render() {
    return (
      <div className={styles.game}>
        <div className={styles.board}>
          <BoardContainer easel={this.easel} score={this.roundScore.bind(this)} play={this.play.bind(this)} />
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
            <EaselContainer ref={this.easel}/>
          </div>
          <div className={styles.draft}>
            <textarea className={styles.textarea} name="draft" />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(GameContainer);
