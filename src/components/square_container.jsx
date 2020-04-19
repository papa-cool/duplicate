import React from 'react';
import styles from './square_container.module.css';
import BasicSquare, {
  DoubleLetterSquare,
  TripleLetterSquare,
  DoubleWordSquare,
  TripleWordSquare
} from './square.js';
import Letter from './letter.js';


class SquareContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      letter: null
    }
  }

  render() {
    const type = this.props.type
    let square

    switch(this.props.type) {
      case 'DoubleLetter':
        square = <DoubleLetterSquare />;
        break;
      case 'TripleLetter':
        square = <TripleLetterSquare />;
        break;
      case 'DoubleWord':
        square = <DoubleWordSquare />;
        break;
      case 'TripleWord':
        square = <TripleWordSquare />;
        break;
      default:
        square = <BasicSquare />;
    }
    return (
      <div className={styles.square_container}>
        { this.state.letter ? <Letter letter={this.state.letter} /> : square }
      </div>
    );
  }
}

export default SquareContainer;
