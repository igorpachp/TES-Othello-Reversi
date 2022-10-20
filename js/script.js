DEFAULT_BOARD_SIZE = 8;

const board = document.getElementById('board');
const cells = [];

let size = DEFAULT_BOARD_SIZE;
createBoard(size+2);

function createBoard(size) {
    for (let i = 0; i < size; i++) {
        let row;

        row = document.createElement('div');
        row.classList.add('row');
        if (i == 0 || i == size - 1) {
            row.classList.add('hidden');
        }
        board.appendChild(row);
    }
    
    const rows = board.getElementsByClassName('row');
    for (let row of rows) {
        for (let j = 0; j < size; j++) {
            let cell = createCell();

            if (j == 0 || j == size - 1 || row == board.firstChild || row == board.lastChild) {
                cell.classList.add('hidden');
            }
            cells.push(cell);
            row.appendChild(cell);
        }
    }
}

function createCell() {
    const newCell = document.createElement('div');
    newCell.classList.add('cell');

    return newCell;
}
