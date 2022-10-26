const DEFAULT_BOARD_SIZE = 8;

const main = document.getElementById('main');
let board = null;
const cells = [];
const playableCells = range(11, 89).filter(i => 1 <= i % 10 && i % 10 <= 8);
let size = DEFAULT_BOARD_SIZE;

// botões
const btnstart = document.getElementById('btnstart');
const btnrules = document.getElementById('btnrules');
const btnrestart = document.getElementById('btnrestart');
const closerules = document.getElementById('closerules');

// atribuindo eventos aos botões
btnstart.addEventListener("click", () => {
    if (!board) {
        board = createBoard(size + 2);
        main.appendChild(board);
    }
    setStartingPosition();
    main.style.display = 'block';
    btnrestart.style.display = 'block';
    btnstart.style.display = 'none';
});
btnrestart.addEventListener("click", () => {
    setStartingPosition();
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
        // bloqueando linhas inúteis
        if (i == 0 || i == size - 1) {
            row.classList.add('blocked');
        }
        board.appendChild(row);
    }
    
    const rows = board.getElementsByClassName('row');
    let i = 0;

    for (let row of rows) {

        for (let j = 0; j < size; j++) {
            let cell = createCell(i + j);

            // bloqueando células inúteis
            if (j == 0 || j == size - 1 || row == board.firstChild || row == board.lastChild) {
                cell.classList.add('blocked');
            }
            cells.push(cell);
            row.appendChild(cell);
        }
        i += 10;
    }
    
    return board;
}

// função para estabelecer estado inicial do jogo
function setStartingPosition() {
    playableCells.forEach((id) =>{
        let cell = cells[id];

        if (cell.firstChild) {
            cell.firstChild.remove();
        }
    });

    insertPiece(44, 'white');
    insertPiece(55, 'white');
    insertPiece(54, 'black');
    insertPiece(45, 'black');
}

// função auxiliar com a função de criar células
function createCell(id) {
    const newCell = document.createElement('div');

    newCell.classList.add('cell');
    newCell.id = `${id}`;

    return newCell;
}

function range(first, last) {
    return [...Array(last - first + 1).keys()].map(i => i + first);
}

// função para encontrar uma célula 
// através de referência direta
function getCell(id) {
    return cells[id];
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
function insertPiece(id, color) {
    // const cell = getCell(r, c);
    const cell = cells[id];
    const piece = createPiece(color);

    cell.appendChild(piece);
}

// função para controlar a exibição 
// do painel de regras
function displayRules(displayRules) {
    rules.style.display = displayRules ? 'block' : 'none';
}
