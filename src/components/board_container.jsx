import React from 'react';
import styles from './board_container.module.css';
import SquareContainer from './square_container.jsx';

class BoardContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      // letters: []
      // letters: [{value:'A', id:1},{value:'B', id:2},{value:'C', id:3},{value:'D', id:4},]
      squares: [
        [{type:'TripleWord'}, {}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'TripleWord'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {}, {type:'TripleWord'}, ],
        [{}, {type:'DoubleWord'}, {}, {}, {}, {type:'TripleLetter'}, {}, {}, {}, {type:'TripleLetter'}, {}, {}, {}, {type:'DoubleWord'}, {}, ],
        [{}, {}, {type:'DoubleWord'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'DoubleWord'}, {}, {}, ],
        [{type:'DoubleLetter'}, {}, {}, {type:'DoubleWord'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'DoubleWord'}, {}, {}, {type:'DoubleLetter'}, ],
        [{}, {}, {}, {}, {type:'DoubleWord'}, {}, {}, {}, {}, {}, {type:'DoubleWord'}, {}, {}, {}, {}, ],
        [{}, {type:'TripleLetter'}, {}, {}, {}, {type:'TripleLetter'}, {}, {}, {}, {type:'TripleLetter'}, {}, {}, {}, {type:'TripleLetter'}, {}, ],
        [{}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {}, ],
        [{type:'TripleWord'}, {}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'DoubleWord'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {}, {type:'TripleWord'}, ],
        [{}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {}, ],
        [{}, {type:'TripleLetter'}, {}, {}, {}, {type:'TripleLetter'}, {}, {}, {}, {type:'TripleLetter'}, {}, {}, {}, {type:'TripleLetter'}, {}, ],
        [{}, {}, {}, {}, {type:'DoubleWord'}, {}, {}, {}, {}, {}, {type:'DoubleWord'}, {}, {}, {}, {}, ],
        [{type:'DoubleLetter'}, {}, {}, {type:'DoubleWord'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'DoubleWord'}, {}, {}, {type:'DoubleLetter'}, ],
        [{}, {}, {type:'DoubleWord'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'DoubleWord'}, {}, {}, ],
        [{}, {type:'DoubleWord'}, {}, {}, {}, {type:'TripleLetter'}, {}, {}, {}, {type:'TripleLetter'}, {}, {}, {}, {type:'DoubleWord'}, {}, ],
        [{type:'TripleWord'}, {}, {}, {type:'DoubleLetter'}, {}, {}, {}, {type:'TripleWord'}, {}, {}, {}, {type:'DoubleLetter'}, {}, {}, {type:'TripleWord'}, ],
      ],
      selected: null
    }
  }

  handleClick = (container) => {
    if(this.state.selected) {
      this.state.selected.unselect()
    }
    this.setState({selected: container});
    container.select()
  }

  render() {
    return (
      <div className={styles.board}>
        {
          this.state.squares.map((squares_line, index_line) => {
            return (
              <div className={styles.line} key={index_line.toString()}>
                {
                  squares_line.map((square, index_square) => {
                    return (<SquareContainer key={index_line.toString()+'-'+index_square.toString()} type={square.type} handleClick={this.handleClick} />)
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default BoardContainer;
