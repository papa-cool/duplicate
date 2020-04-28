import React from 'react';
import styles from './board_container.module.css';
import SquareContainer from './square_container.jsx';
import Board from './board.js';

class BoardContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      // letters: []
      // letters: [{value:'A', id:1},{value:'B', id:2},{value:'C', id:3},{value:'D', id:4},]
      selected: null
    }
  }

  handleClick = (container) => {
    if(this.state.selected) { this.state.selected.unselect() }
    this.setState({selected: container});
    container.select()
  }

  handleKeyPress(event) {
    if(this.state.selected) { this.state.selected.assign(event.key.toUpperCase()) }
  }

  handleKeyDown(event) {
    if(this.state.selected && (event.keyCode === 8 || event.keyCode === 46)) {
      this.state.selected.assign(null)
    }
  }

  handleBlur() {
    if(this.state.selected) { this.state.selected.unselect() }
  }

  render() {
    return (
      <div className={styles.board} onKeyPress={this.handleKeyPress.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleBlur.bind(this)} tabIndex="-1" style={{outline: 'none'}}>
        {
          Board.map((squares_line, index_line) => {
            return (
              <div className={styles.line} key={index_line.toString()}>
                {
                  squares_line.map((square, index_square) => {
                    return (<SquareContainer key={index_line.toString()+'-'+index_square.toString()} type={square.type} handleClick={this.handleClick} />)
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
