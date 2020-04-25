import React from 'react';
import classNames from 'classnames/bind';
import styles from './square.module.css';

let cx = classNames.bind(styles);

const BasicSquare = ({selected}) =>
  <div className={cx('basic', 'square', {selected: selected})}>
  </div>
export default BasicSquare;

const DoubleLetterSquare = ({selected}) =>
  <div className={cx('double_letter', 'square', {selected: selected})}>
    <div className={styles.text}>
      <p>Lettre compte double</p>
    </div>
  </div>

const TripleLetterSquare = ({selected}) =>
  <div className={cx('triple_letter', 'square', {selected: selected})}>
    <div className={styles.text}>
      <p>Lettre compte triple</p>
    </div>
  </div>

const DoubleWordSquare = ({selected}) =>
  <div className={cx('double_word', 'square', {selected: selected})}>
    <div className={styles.text}>
      <p>Mot compte double</p>
    </div>
  </div>

const TripleWordSquare = ({selected}) =>
  <div className={cx('triple_word', 'square', {selected: selected})}>
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
