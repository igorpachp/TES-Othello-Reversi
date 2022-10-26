DEFAULT_BOARD_SIZE = 8;

const main = document.getElementById('main');
const cells = [];
var board;
let size = DEFAULT_BOARD_SIZE;

// botões
const btnstart = document.getElementById('btnstart');
const btnrules = document.getElementById('btnrules');
const btnrestart = document.getElementById('btnrestart');
const closerules = document.getElementById('closerules');

// atribuindo eventos aos botões
btnstart.addEventListener("click", () => {
    if (main.firstChild == null) {
        board = createBoard(size + 2);
        main.appendChild(board);
        setStartingPosition();
        main.style.display = 'block';
        btnrestart.style.display = 'block';
        btnstart.style.display = 'none';
    }
});
btnrules.addEventListener("click", () => {displayRules(true);});
closerules.addEventListener("click", () => {displayRules(false);});

// função para criar o tabuleiro de jogo
// o tabuleiro é basicamente uma grade NxN
// separada em linhas, onde a primeira e última linha
// são invisíveis e inacessíveis ao jogador, 
// criadas apenas para utilizar referência direta.
// O mesmo pode ser dito para a primeira e última coluna.
function createBoard(size) {
    const board = document.createElement('div');
    board.id = 'board';

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

    return board;
}

// função para estabelecer estado inicial do jogo
function setStartingPosition() {
    start = size / 2;

    insertPiece(start, start, 'white');
    insertPiece(start + 1, start + 1, 'white');
    insertPiece(start + 1, start, 'black');
    insertPiece(start, start + 1, 'black');
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
    const newPiece = document.createElement('div');

    newPiece.classList.add('piece', color);

    return newPiece;
}

// função para inserir uma peça de
// determinada cor em uma célula específica
function insertPiece(r, c, color) {
    const cell = getCell(r, c);
    const piece = createPiece(color);

    cell.appendChild(piece);
}
