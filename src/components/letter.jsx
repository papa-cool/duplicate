import React from 'react';
import classNames from 'classnames/bind';
import styles from './letter.module.css';
import { FRENCH_POINTS } from './letters_distribution.js';

let cx = classNames.bind(styles);

const Letter = ({letter, selected}) =>
  <div className={cx('letter', 'square', {selected: selected})}>
    <div className={styles.value}>
      <p>{letter}</p>
    </div>
    <div className={styles.point}>
      <p>{FRENCH_POINTS[letter]}</p>
    </div>
  </div>
export default Letter;
