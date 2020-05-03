import React from 'react';
import styles from './board_container.module.css';
import SquareContainer from './square_container.jsx';
import Board from './board.js';

class BoardContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      selected: null,
      current: {},
      saved: {}
    }
    this.board = React.createRef()
  }

  // Save current letters and fill the easel with letter from the stack.
  play() {
    this.setState({
      current: {},
      saved: {...this.state.saved, ...this.state.current}
    })
    this.props.easel.current.pullFromStack()
  }

  // Select a square.
  handleClick = (container) => {
    if(this.state.selected) { this.state.selected.unselect() }
    this.setState({selected: container})
    container.select()
    this.board.current.focus()
  }

  // Add pressed letter if available to the selected square.
  handleKeyPress(event) {
    if(!this.state.selected) { return }
    if(this.state.saved[this.state.selected.props.index]) { return }
    let { [this.state.selected.props.index]: _, ...new_current } = this.state.current;

    if(this.state.current[this.state.selected.props.index]) {
      this.props.easel.current.resetLetter(this.state.current[this.state.selected.props.index])
    }
    let letter = this.props.easel.current.getLetter(event.key.toUpperCase())
    if(letter) { new_current[this.state.selected.props.index] = letter }
    
    this.setState({current: new_current})
  }

  handleKeyDown(event) {
    if(this.state.selected && (event.keyCode === 8 || event.keyCode === 46)) {
      // Remove letter if present from the selected square.
      if(this.state.saved[this.state.selected.props.index]) { return }
      if(this.state.current[this.state.selected.props.index]) {
        this.props.easel.current.resetLetter(this.state.current[this.state.selected.props.index])
      }
      let { [this.state.selected.props.index]: _, ...new_current } = this.state.current;
      this.setState({current: new_current})
    } else if(event.keyCode === 13) {
      this.play()
    }
  }

  handleBlur() {
    if(this.state.selected) { this.state.selected.unselect() }
  }

  render() {
    return (
      <div className={styles.board} ref={this.board} onKeyPress={this.handleKeyPress.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleBlur.bind(this)} tabIndex="-1" style={{outline: 'none'}}>
        {
          Board.map((squares_line, index_line) => {
            return (
              <div className={styles.line} key={index_line.toString()}>
                {
                  squares_line.map((square, index_square) => {
                    let key = index_line.toString()+'-'+index_square.toString()
                    return (<SquareContainer key={key} index={key} letter={this.state.saved[key] || this.state.current[key]} type={square.type} handleClick={this.handleClick} />)
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
