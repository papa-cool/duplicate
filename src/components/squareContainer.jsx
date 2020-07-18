import React from 'react';
import styles from './squareContainer.module.css';
import BasicSquare, {
  DoubleLetterSquare,
  TripleLetterSquare,
  DoubleWordSquare,
  TripleWordSquare
} from './square.jsx';
import Letter from './letter.jsx';


class SquareContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      selected: false
    }
  }

  handleClick() {
    this.props.handleClick(this)
  }

  select() {
    this.setState({selected: true})
  }

  unselect() {
    this.setState({selected: false})
  }

  assign(letter) {
    this.setState({letter: letter})
  }

  render() {
    let square

    switch(this.props.type) {
      case 'DoubleLetter':
        square = <DoubleLetterSquare key={"square"} selected={this.state.selected} />;
        break;
      case 'TripleLetter':
        square = <TripleLetterSquare key={"square"} selected={this.state.selected} />;
        break;
      case 'DoubleWord':
        square = <DoubleWordSquare key={"square"} selected={this.state.selected} />;
        break;
      case 'TripleWord':
        square = <TripleWordSquare key={"square"} selected={this.state.selected} />;
        break;
      default:
        square = <BasicSquare key={"square"} selected={this.state.selected} />;
    }
    return (
      <div className={styles.squareContainer} onClick={this.handleClick.bind(this)}>
        { this.props.letter ? [square, <Letter key={"letter"} letter={this.props.letter} />] : square }
      </div>
    );
  }
}

export default SquareContainer;
