import React from 'react';
import classNames from 'classnames/bind';
import styles from './letter.module.css';

let cx = classNames.bind(styles);

const Letter = ({letter, selected}) =>
  <div className={cx('letter', 'square', {selected: selected})}>
    <div className={styles.value}>
      <p>{letter}</p>
    </div>
  </div>
export default Letter;
