import React from 'react';
import styles from './easel_container.module.css';
import Letter from './letter.jsx';

class EaselContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      letters: ['A', 'A', ' ', null, 'E', null, 'G']
    }
  }

  getLetter(queryLetter) {
    let letter = null
    this.state.letters.some((element, index) => {
      if(element === queryLetter) {
        letter = element
        this.state.letters[index] = null
        this.setState({letters: this.state.letters});
        return true
      }
    })

    return letter;
  }

  resetLetter(letter) {
    this.state.letters.some((element, index) => {
      if(element === null) {
        this.state.letters[index] = letter
        this.setState({letters: this.state.letters});
        return true
      }
    })
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
