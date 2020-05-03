import React from 'react';
import styles from './easel_container.module.css';
import Letter from './letter.jsx';
import { FRENCH } from './letters_distribution.js';
import Knuth from '../knuth_shuffle.js';

class EaselContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      stack: [],
      letters: []
    }
  }

  componentDidMount() {
    let stack = Knuth.knuthShuffle(FRENCH)
    let letters = stack.splice(0, 7)

    this.setState({
      stack: stack,
      letters: letters
    })
  }

  pullFromStack() {
    let stack = this.state.stack
    let letters = stack.splice(0, 7-this.state.letters.length)

    this.setState({
      stack: stack,
      letters: this.state.letters.concat(letters),
    })
  }

  // return the queryLetter if present in the array this.state.letters
  getLetter(queryLetter) {
    let letter = null
    let letters = this.state.letters

    this.state.letters.some((element, index) => {
      if(element === queryLetter) {
        letter = element
        letters.splice(index, 1)
        this.setState({letters: letters})
        return true
      }
      return false
    })

    return letter
  }

  resetLetter(letter) {
    this.state.letters.push(letter)
    this.setState({letters: this.state.letters})
  }

  render() {
    return (
      <div className={styles.easel}>
        {
          this.state.letters.map((letter, index) => {
            return (
              <div key={index.toString()} className={styles.square}>
                { letter ? <Letter letter={letter} selected={false} /> : null }
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default EaselContainer;
