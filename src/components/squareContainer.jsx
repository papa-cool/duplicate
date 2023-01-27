import React from 'react';
import styles from './squareContainer.module.css';
import BasicSquare, {
  DoubleLetterSquare,
  TripleLetterSquare,
  DoubleWordSquare,
  TripleWordSquare
} from './square.jsx';
import Letter from './letter.jsx';


function SquareContainer(props) {
  let square
  switch(props.type) {
    case 'DoubleLetter':
      square = <DoubleLetterSquare key={"square"} selected={props.selected} />;
      break;
    case 'TripleLetter':
      square = <TripleLetterSquare key={"square"} selected={props.selected} />;
      break;
    case 'DoubleWord':
      square = <DoubleWordSquare key={"square"} selected={props.selected} />;
      break;
    case 'TripleWord':
      square = <TripleWordSquare key={"square"} selected={props.selected} />;
      break;
    default:
      square = <BasicSquare key={"square"} selected={props.selected} />;
  }
  return (
    <div className={styles.squareContainer}>
      { props.letter ? [square, <Letter key={"letter"} letter={props.letter} />] : square }
    </div>
  );
}

export default SquareContainer;
