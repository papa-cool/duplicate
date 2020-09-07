import React from 'react';
import styles from './player.module.css';

class PlayerContainer extends React.Component {

  tableFromPlayers() {
    let scores = Object.entries(this.props.players).map(([name, scores]) => [...scores, ...Array(10)])

    return scores[0].map((_, column) => scores.map(row => row[column]))
  }

  render() {
    return (
      <table className={styles.container}>
        <thead>
          <tr>
            {
              Object.keys(this.props.players).map((name, column) => {
                return (
                  <th key={column} className={styles.cell}>
                    <div className={styles.text}>
                      {name}
                    </div>
                  </th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            this.tableFromPlayers().map((line, index) => {
              return (
                <tr key={index}>
                  {
                    line.map((cell, column) => {
                      return (
                        <td key={index + '-' + column} className={styles.cell}>
                          <div className={styles.text}>
                            {cell}
                          </div>
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          } 
        </tbody>
      </table>
    );
  }
}

export default PlayerContainer;
