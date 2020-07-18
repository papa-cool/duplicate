import React from 'react';
import classNames from 'classnames/bind';
import styles from './letter.module.css';
import { FRENCH_POINTS } from '../data/lettersDistribution.js';

let cx = classNames.bind(styles);

const Letter = ({letter, selected}) =>
  <div className={cx('letter', 'square', {selected: selected})}>
    <div className={styles.value}>
      <div>{letter}</div>
    </div>
    <div className={styles.point}>
      <div>{FRENCH_POINTS[letter]}</div>
    </div>
  </div>
export default Letter;
