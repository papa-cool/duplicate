import React from 'react';
import styles from './game_container.module.css';
import BoardContainer from './board_container.jsx';
import EaselContainer from './easel_container.jsx';

class GameContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className={styles.game}>
        <div className={styles.board}>
          <BoardContainer />
        </div>
        <div className={styles.panel}>
          <div className={styles.score}>
          </div>
          <div className={styles.easel}>
            <EaselContainer />
          </div>
          <div className={styles.draft}>
          </div>
        </div>
      </div>
    );
  }
}

export default GameContainer;
