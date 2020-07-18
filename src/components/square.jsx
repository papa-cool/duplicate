import React from 'react';
import classNames from 'classnames/bind';
import styles from './square.module.css';

let cx = classNames.bind(styles);

const BasicSquare = ({selected}) =>
  <div className={cx('basic', 'square', {selected: selected})}>
    <div className={styles.text}>
      {/* I don't know why browsers align the text of each square of a same row. If texts of squares
      aren't displayed with the same number of lines, some squares will move down. I previously fix
      it with an overflow hidden on the line but squares move when a letter is added. */}
      This<br/>is a<br/>hack
    </div>
  </div>
export default BasicSquare;

const DoubleLetterSquare = ({selected}) =>
  <div className={cx('double_letter', 'square', {selected: selected})}>
    <div className={styles.text}>
      Lettre compte double
    </div>
  </div>

const TripleLetterSquare = ({selected}) =>
  <div className={cx('triple_letter', 'square', {selected: selected})}>
    <div className={styles.text}>
      Lettre compte triple
    </div>
  </div>

const DoubleWordSquare = ({selected}) =>
  <div className={cx('double_word', 'square', {selected: selected})}>
    <div className={styles.text}>
      Mot compte double
    </div>
  </div>

const TripleWordSquare = ({selected}) =>
  <div className={cx('triple_word', 'square', {selected: selected})}>
    <div className={styles.text}>
      Mot compte triple
    </div>
  </div>

export {
  DoubleLetterSquare,
  TripleLetterSquare,
  DoubleWordSquare,
  TripleWordSquare,
}
