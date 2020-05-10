import React from 'react';
import styles from './gameContainer.module.css';
import BoardContainer from './boardContainer.jsx';
import EaselContainer from './easelContainer.jsx';
import letterScore from '../services/letterScore.js';
import roundScore from '../services/roundScore.js';
import BOARD from '../data/board.js';
import { FRENCH_POINTS } from '../data/lettersDistribution.js';

class GameContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = { score: 0 }
    this.easel = React.createRef()
    // this.score = React.createRef()
  }

  roundScore = (currentLetters, savedLetters) => {
    this.setState({
      score: roundScore.score(letterScore.bind(null, BOARD, FRENCH_POINTS, currentLetters, savedLetters), Object.keys(currentLetters))
    })
  }

  render() {
    return (
      <div className={styles.game}>
        <div className={styles.board}>
          <BoardContainer easel={this.easel} score={this.roundScore.bind(this)} />
        </div>
        <div className={styles.panel}>
          <div className={styles.players}>
          </div>
          <div className={styles.score}>
            { this.state.score }
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
