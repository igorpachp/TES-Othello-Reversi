DEFAULT_BOARD_SIZE = 8;

const board = document.getElementById('board');
const cells = [];

let size = DEFAULT_BOARD_SIZE;
createBoard(size + 2);

// função para criar o tabuleiro de jogo
// o tabuleiro é basicamente uma grade NxN
// separada em linhas, onde a primeira e última linha
// são invisíveis e inacessíveis ao jogador, 
// criadas apenas para utilizar referência direta.
// O mesmo pode ser dito para a primeira e última coluna.
function createBoard(size) {
    for (let i = 0; i < size; i++) {
        let row;

        row = document.createElement('div');
        row.classList.add('row');
        // ocultando linhas inúteis
        if (i == 0 || i == size - 1) {
            row.classList.add('hidden');
        }
        board.appendChild(row);
    }
    
    const rows = board.getElementsByClassName('row');
    for (let row of rows) {
        for (let j = 0; j < size; j++) {
            let cell = createCell();

            // ocultando células inúteis
            if (j == 0 || j == size - 1 || row == board.firstChild || row == board.lastChild) {
                cell.classList.add('hidden');
            }
            cells.push(cell);
            row.appendChild(cell);
        }
    }
}

// função auxiliar com a função de criar células
function createCell() {
    const newCell = document.createElement('div');
    newCell.classList.add('cell');

    return newCell;
}

// função para encontrar uma célula 
// através de referência direta
function getCell(r, c) {
    return cells[r * (size + 2) + c];
}

// função para criar uma peça baseado
// na cor recebida como parâmetro
function createPiece(color) {
    const newPiece = document.createElement('div').classList.add('piece', color);

    return newPiece;
}
