import React from 'react';
import styles from './easel_container.module.css';
import Letter from './letter.jsx';

class EaselContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      letters: ['A', 'B', ' ', null, 'E', null, 'G']
    }
  }

  render() {
    return (
      <div className={styles.easel}>
        {
          this.state.letters.map((letter, index) => {
            return (
              <div className={styles.square}>
                { letter ? <Letter key={index.toString()} letter={letter} selected={false} /> : null }
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default EaselContainer;
