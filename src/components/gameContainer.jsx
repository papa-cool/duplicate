import React from 'react';
import styles from './gameContainer.module.css';
import BoardContainer from './boardContainer.jsx';
import EaselContainer from './easelContainer.jsx';
import PlayerContainer from './playerContainer.jsx';
import letterScore from '../services/letterScore.js';
import roundScore from '../services/roundScore.js';
import BOARD from '../data/board.js';
import { FRENCH_POINTS } from '../data/lettersDistribution.js';

class GameContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      score: 0,
      main_player: 'Vous',
      players: { Vous: [] }
    }
    this.player = React.createRef()
    this.easel = React.createRef()
    this.round = React.createRef()
  }

  roundScore = (currentLetters, savedLetters) => {
    this.setState({
      score: roundScore.score(letterScore.bind(null, BOARD, FRENCH_POINTS, currentLetters, savedLetters), Object.keys(currentLetters))
    })
  }

  pushScore(score) {
    let players = {...this.state.players}
    let scores = players[this.state.main_player]
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

export default GameContainer;
