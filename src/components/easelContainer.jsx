import React from 'react'
import styles from './easelContainer.module.css'
import Letter from './letter.jsx'
import PropTypes from 'prop-types'

function EaselContainer(props) {
  return (
    <div className={styles.easel}>
      {
        props.letters.map((letter, index) => {
          return (
            <div key={index.toString()} className={styles.square}>
              { letter ? <Letter letter={letter} selected={false} /> : null }
            </div>
          )
        })
      }
    </div>
  )
}

EaselContainer.propTypes = {
  letters: PropTypes.array
}

export default EaselContainer
