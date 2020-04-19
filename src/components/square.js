import React from 'react';
import styles from './square.module.css';

const BasicSquare = ({basic}) =>
  <div className={styles.basic}>
  </div>
export default BasicSquare;

const DoubleLetterSquare = ({double_letter_square}) =>
  <div className={styles.double_letter}>
    <div className={styles.text}>
      <p>Lettre compte double</p>
    </div>
  </div>

const TripleLetterSquare = ({triple_letter_square}) =>
  <div className={styles.triple_letter}>
    <div className={styles.text}>
      <p>Lettre compte triple</p>
    </div>
  </div>

const DoubleWordSquare = ({double_word_square}) =>
  <div className={styles.double_word}>
    <div className={styles.text}>
      <p>Mot compte double</p>
    </div>
  </div>

const TripleWordSquare = ({triple_word_square}) =>
  <div className={styles.triple_word}>
    <div className={styles.text}>
      <p>Mot compte triple</p>
    </div>
  </div>

export {
  DoubleLetterSquare,
  TripleLetterSquare,
  DoubleWordSquare,
  TripleWordSquare,
}
