import React from 'react';
import styles from './game_container.module.css';
import BoardContainer from './board_container.jsx';

class GameContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className={styles.game}>
        <BoardContainer />
      </div>
    );
  }
}

export default GameContainer;
