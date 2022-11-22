import React from 'react';
import styles from './boardContainer.module.css';
import SquareContainer from './squareContainer.jsx';
import BOARD from '../data/board.js';
import tableCursor from '../services/tableCursor.js';

class BoardContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      // The index of the square we have the focus on.
      // Any action on the board will be applied on the selected square.
      selectedIndex: null,
      // Letters on the board that have been moved is the current rounds.
      // They can be moved back to the easel.
      current: {},
      // Letters on the board that have been moved and played during previous rounds.
      // They cannot be moved back to the easel. They are freeze until the end of the game.
      saved: {}
    }
    this.board = React.createRef()
  }

  changeSelectedSquare(index) {
    this.setState({selectedIndex: index})
    this.board.current.focus()
  }

  removeSelection() {
    this.setState({selectedIndex: null})
  }

  moveLetter(letter) {
    // We cannot move any letter if no square are selected.
    if(!this.state.selectedIndex) { return }
    // We cannot move any letter on a square where a letter have already been played.
    if(this.state.saved[this.state.selectedIndex]) { return }

    let { [this.state.selectedIndex]: _, ...new_current } = this.state.current;
    // If a letter has already been moved on the selected square,
    // the letter is sent back to the easel before being replaced.
    if(this.state.current[this.state.selectedIndex]) {
      this.props.easel.current.resetLetter(this.state.current[this.state.selectedIndex])
    }
    // The requested letter is moved to the selected square if available in the easel.
    if(this.props.easel.current.getLetter(letter)) {
      new_current[this.state.selectedIndex] = letter
    }
    
    this.setState({current: new_current}, () => this.props.score(this.state.current, this.state.saved))
  }

  removeLetter() {
    // Nothing to remove if no square are selected.
    if(!this.state.selectedIndex) { return }
    // A saved letter is freeze and cannot be removed.
    if(this.state.saved[this.state.selectedIndex]) { return }
    // If present, the letter on the selected square is sent back to the easel.
    if(this.state.current[this.state.selectedIndex]) {
      this.props.easel.current.resetLetter(this.state.current[this.state.selectedIndex])
    }

    let { [this.state.selectedIndex]: _, ...new_current } = this.state.current;
    this.setState({current: new_current}, () => this.props.score(this.state.current, this.state.saved))
  }

  // Save current letters and fill the easel with letter from the stack.
  play() {
    this.setState({
      current: {},
      saved: {...this.state.saved, ...this.state.current}
    })
    this.props.play()
  }

  // Select a square.
  handleClick = (clickedSquare) => {
    this.changeSelectedSquare(clickedSquare.props.index)
  }

  // Add pressed letter if available to the selected square.
  handleKeyPress(event) {
    this.moveLetter(event.key.toUpperCase())
  }

  handleKeyDown(event) {
    if(event.keyCode === 8 || event.keyCode === 46) {
      this.removeLetter()
    } else if(event.keyCode === 37) {
      this.changeSelectedSquare(tableCursor.left(this.state.selectedIndex))
    } else if(event.keyCode === 38) {
      this.changeSelectedSquare(tableCursor.up(this.state.selectedIndex))
    } else if(event.keyCode === 39) {
      this.changeSelectedSquare(tableCursor.right(this.state.selectedIndex))
    } else if(event.keyCode === 40) {
      this.changeSelectedSquare(tableCursor.down(this.state.selectedIndex))
    } else if(event.keyCode === 13) {
      this.play()
    }
  }

  handleBlur() {
    this.removeSelection()
  }

  render() {
    return (
      <div className={styles.board} ref={this.board} onKeyPress={this.handleKeyPress.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleBlur.bind(this)} tabIndex="-1" style={{outline: 'none'}}>
        {
          BOARD.map((squares_line, index_line) => {
            return (
              <div className={styles.line} key={index_line.toString()}>
                {
                  squares_line.map((square, index_square) => {
                    let key = index_line.toString()+'-'+index_square.toString()
                    return (
                      <div className={styles.column} key={key}>
                        <SquareContainer index={key} selected={this.state.selectedIndex === key} letter={this.state.saved[key] || this.state.current[key]} type={square.type} handleClick={this.handleClick} />
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default BoardContainer;
