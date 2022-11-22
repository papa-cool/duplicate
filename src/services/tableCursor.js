// Each square on the board is identified by an index key with the format "<indexLine>-<indexColumn>"
// Following functions aim to select a square next to the selected one incrementing or decrementing
// the index key on one of its dimension.
// The index key won't change if the new index is out of the board table composed of 15x15 squares.
export default (function () {
  function buildIndexKey(lineIndex, columnIndex) {
    return lineIndex.toString() + '-' + columnIndex.toString()
  }

  function up(index) {
    let [lineIndex, columnIndex] = index.split('-');

    if(lineIndex === "0") { return index }
    return buildIndexKey(+lineIndex - 1, columnIndex)
  }

  function down(index) {
    let [lineIndex, columnIndex] = index.split('-');

    if(lineIndex === "14") { return index }
    return buildIndexKey(+lineIndex + 1, columnIndex)
  }

  function left(index) {
    let [lineIndex, columnIndex] = index.split('-');

    if(columnIndex === "0") { return index }
    return buildIndexKey(lineIndex, +columnIndex - 1)
  }

  function right(index) {
    let [lineIndex, columnIndex] = index.split('-');

    if(columnIndex === "14") { return index }
    return buildIndexKey(lineIndex, +columnIndex + 1)
  }

  return { up: up, down: down, left: left, right: right }
})()