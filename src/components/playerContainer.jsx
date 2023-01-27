import React from 'react'
import styles from './playerContainer.module.css'

function PlayerContainer(props) {

  const tableFromPlayers = () => {
    if (Object.entries(props.players).length === 0) { return [] }

    // Extract scores of each player.
    // Fill the score with empty value for display purpose (a better solution may exist on CSS side).
    // We should ensure that last scores are always visible. TODO
    // Add a sum of the scores at the end.
    let scores = Object.values(props.players)

    // Reorganise data from column to line
    return scores[0].map((_, column) => scores.map(row => row[column]))
  }

  const totalFromPlayers = () => {
    if (Object.entries(props.players).length === 0) { return [] }

    return Object.values(props.players).map((playerScores) => {
      return playerScores.reduce((sum, currentValue) => sum + currentValue, 0)
    })
  }

  return (
    <table className={styles.container}>
      <thead>
        <tr key="header">
          {
            Object.keys(props.players).map((name, column) => {
              return (
                <th key={'header-' + column} className={styles.cell}>
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
          tableFromPlayers().map((line, index) => {
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
      <tfoot>
        <tr key="footer">
          {
            totalFromPlayers().map((cell, column) => {
              return (
                <th key={'footer-' + column} className={styles.cell}>
                  <div className={styles.text}>
                    {cell}
                  </div>
                </th>
              )
            })
          }
        </tr>
      </tfoot>
    </table>
  )
}

export default PlayerContainer
