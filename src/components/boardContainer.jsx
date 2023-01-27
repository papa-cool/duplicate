import React from 'react'
import styles from './boardContainer.module.css'
import SquareContainer from './squareContainer.jsx'
import BOARD from '../data/board.js'
import PropTypes from 'prop-types'

function BoardContainer(props) {
  const board = React.createRef()

  // Select a square.
  const handleClick = (index) => {
    props.handleClick(index)
    board.current.focus()
  }

  return (
    <div className={styles.board} ref={board} onKeyPress={props.handleKeyPress} onKeyDown={props.handleKeyDown} onBlur={props.handleBlur} tabIndex="-1" style={{outline: 'none'}}>
      {
        BOARD.map((squares_line, index_line) => {
          return (
            <div className={styles.line} key={index_line.toString()}>
              {
                squares_line.map((square, index_square) => {
                  let key = index_line.toString()+'-'+index_square.toString()
                  return (
                    <div className={styles.column} key={key} onClick={() => handleClick(key)}>
                      <SquareContainer index={key} selected={props.selectedIndex === key} letter={props.letterPositions[key]} type={square.type}/>
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}

BoardContainer.propTypes = {
  selectedIndex: PropTypes.string,
  letterPositions: PropTypes.object,
  handleKeyPress: PropTypes.func,
  handleKeyDown: PropTypes.func,
  handleBlur: PropTypes.func,
  handleClick: PropTypes.func
}

export default BoardContainer
