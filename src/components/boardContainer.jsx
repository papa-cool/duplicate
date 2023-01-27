import React from 'react';
import styles from './boardContainer.module.css';
import SquareContainer from './squareContainer.jsx';
import BOARD from '../data/board.js';
import PropTypes from 'prop-types';

class BoardContainer extends React.Component {
  constructor(props){
    super(props)
    this.board = React.createRef()
  }

  // Select a square.
  handleClick = (index) => {
    this.props.handleClick(index)
    this.board.current.focus()
  }

  render() {
    return (
      <div className={styles.board} ref={this.board} onKeyPress={this.props.handleKeyPress.bind(this)} onKeyDown={this.props.handleKeyDown.bind(this)} onBlur={this.props.handleBlur.bind(this)} tabIndex="-1" style={{outline: 'none'}}>
        {
          BOARD.map((squares_line, index_line) => {
            return (
              <div className={styles.line} key={index_line.toString()}>
                {
                  squares_line.map((square, index_square) => {
                    let key = index_line.toString()+'-'+index_square.toString()
                    return (
                      <div className={styles.column} key={key} onClick={this.handleClick.bind(this, key)}>
                        <SquareContainer index={key} selected={this.props.selectedIndex === key} letter={this.props.letterPositions[key]} type={square.type}/>
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

BoardContainer.propTypes = {
  selectedIndex: PropTypes.string,
  letterPositions: PropTypes.object,
  handleKeyPress: PropTypes.func,
  handleKeyDown: PropTypes.func,
  handleBlur: PropTypes.func,
  handleClick: PropTypes.func
};

export default BoardContainer;
