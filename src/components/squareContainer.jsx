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
        square = <DoubleLetterSquare selected={this.state.selected} />;
        break;
      case 'TripleLetter':
        square = <TripleLetterSquare selected={this.state.selected} />;
        break;
      case 'DoubleWord':
        square = <DoubleWordSquare selected={this.state.selected} />;
        break;
      case 'TripleWord':
        square = <TripleWordSquare selected={this.state.selected} />;
        break;
      default:
        square = <BasicSquare selected={this.state.selected} />;
    }
    return (
      <div className={styles.squareContainer} onClick={this.handleClick.bind(this)}>
        { this.props.letter ? <Letter letter={this.props.letter} selected={this.state.selected} /> : square }
      </div>
    );
  }
}

export default SquareContainer;
