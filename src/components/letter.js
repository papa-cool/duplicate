import React from 'react';
import styles from './letter.module.css';

const Letter = ({letter}) =>
  <div className={styles.letter}>
    <div className={styles.value}>
      <p>{letter.value}</p>
    </div>
  </div>
export default Letter;
