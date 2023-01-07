import React from 'react';
import styles from './playerContainer.module.css';

class PlayerContainer extends React.Component {

  tableFromPlayers() {
    if (Object.entries(this.props.players).length === 0) { return [] }

    // Extract scores of each player.
    // Fill the score with empty value for display purpose (a better solution may exist on CSS side).
    // We should ensure that last scores are always visible. TODO
    // Add a sum of the scores at the end.
    let scores = Object.entries(this.props.players).map(([name, scores]) => {
      const sumScores = scores.reduce((acc, currentValue) => acc + currentValue, 0);
      return [...scores, " ", sumScores, ...Array(6)]
    })

    // Reorganise data from column to line
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
