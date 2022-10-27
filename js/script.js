const DEFAULT_BOARD_SIZE = 8;

const main = document.getElementById('main');
let board = null;
const cells = [];
const playableCells = range(11, 89).filter(i => 1 <= i % 10 && i % 10 <= 8);
let size = DEFAULT_BOARD_SIZE;
const blackScore = document.getElementById('black');
const whiteScore = document.getElementById('white');
const turnStr = document.getElementById('turn');

// jogadores
const BLACK = 'black';
const WHITE = 'white';
let playerHuman = BLACK;
let playerAI = WHITE;
let turn = playerHuman;
let blackCount = 0;
let whiteCount = 0;

// constantes auxiliares de direção
const UP = -10;
const DOWN = 10;
const LEFT = -1;
const RIGHT = 1;
const UP_RIGHT = -9;
const DOWN_RIGHT = 11;
const DOWN_LEFT = 9;
const UP_LEFT = -11;
const DIRECTIONS = [UP, UP_RIGHT, RIGHT, DOWN_RIGHT, DOWN, DOWN_LEFT, LEFT, UP_LEFT];

// botões
const btnstart = document.getElementById('btnstart');
const btnrules = document.getElementById('btnrules');
const btnrestart = document.getElementById('btnrestart');
const closerules = document.getElementById('closerules');

// atribuindo eventos aos botões
btnstart.addEventListener("click", startGame);
btnrestart.addEventListener("click", resetGame);
btnrules.addEventListener("click", () => {displayRules(true);});
closerules.addEventListener("click", () => {displayRules(false);});

function startGame() {
    if (!board) {
        board = createBoard(size + 2);
        main.appendChild(board);
    }
    setStartingPosition();
    setScoreText();
    main.style.display = 'block';
    btnrestart.style.display = 'block';
    btnstart.style.display = 'none';
}

function resetGame() {
    setStartingPosition();
    setScoreText();
}

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

function setScoreText() {
    whiteScore.innerHTML = `Brancas: ${whiteCount}`;
    blackScore.innerHTML = `Pretas: ${blackCount}`;
    turnStr.innerHTML = turn ? `Jogam as ${turn == BLACK ? 'Pretas' : 'Brancas'}` : 'Fim de Jogo';
}

// função para estabelecer estado inicial do jogo
function setStartingPosition() {
    turn = playerHuman;
    playableCells.forEach((id) =>{
        let cell = cells[id];

        if (cell.firstChild) {
            cell.firstChild.remove();
        }
    });

    insertPiece(44, WHITE);
    insertPiece(55, WHITE);
    insertPiece(54, BLACK);
    insertPiece(45, BLACK);
}

// função auxiliar com a função de criar células
function createCell(id) {
    const newCell = document.createElement('div');

    newCell.classList.add('cell');
    newCell.id = `${id}`;
    newCell.onclick = () => {
        play(turn, id);
    };

    return newCell;
}

function play(player, id) {
    if (isValidCell(id) && isLegalMove(id, player)) {
        insertPiece(id, player);
        DIRECTIONS.forEach(direction =>{
            swapPieces(id, player, direction);
        });

        turn = nextPlayer(player);
    }
    setScoreText();

    return score(playerHuman);
}

function nextPlayer(previous) {
    const opp = opponent(previous);

    if(hasAvailableMoves(opp)) return opp;
    if(hasAvailableMoves(previous)) return previous;
    
    return null;
}

function range(first, last) {
    return [...Array(last - first + 1).keys()].map(i => i + first);
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

    if (color == BLACK) blackCount++;
    else whiteCount++;

    cell.appendChild(piece);
}

// função para controlar a exibição 
// do painel de regras
function displayRules(displayRules) {
    rules.style.display = displayRules ? 'block' : 'none';
}

// função para verifical se uma célula é jogável
function isValidCell(move) {
    return playableCells.includes(move);
}

// função para verificar se um movimento
// é válido para determinado jogador
function isLegalMove(move, player) {
    function formsBracket(direction) {
        return findBracket(move, player, direction);
    }

    return !cells[move].firstChild && DIRECTIONS.map(formsBracket).some((cell) => cell != null);
}

// função para percorrer as células 
// em uma direção até encontrar uma 
// peça da cor do jogador, ou até
// chegar a uma borda
function findBracket(cell, player, direction) {
    let bracket = cell + direction;
    const opp = opponent(player);

    if (cellHoldsPieceOfColor(bracket, player)) return null;
    while (cellHoldsPieceOfColor(bracket, opp)) bracket += direction;

    return cells[bracket].firstChild ? bracket : null;
}

// função para verificar se uma celula contém
// uma peça de determinada cor
function cellHoldsPieceOfColor(id, color) {
    if (!cells[id].firstChild) return false;
    return cells[id].firstChild.classList.contains(color);
}

// função para determinar o oponente
// de um jogador
function opponent(player) {
    return player == WHITE ? BLACK : WHITE;
}

function swapPieces(move, player, direction) {
    const bracket = findBracket(move, player, direction);
    let cell = move + direction;
    
    if(!bracket) return;
    while (cell != bracket) {
        cells[cell].firstChild.classList.remove(opponent(player));
        cells[cell].firstChild.classList.add(player);
        if (player == BLACK) {
            blackCount++;
            whiteCount--;
        }
        else {
            blackCount--;
            whiteCount++;
        }
        cell += direction;
    }
}

function legalMoves(player) {
    return playableCells.filter(move => isLegalMove(move, player));
}

function hasAvailableMoves(player) {
    return legalMoves(player).length > 0;
}

function score(player) {
    let playerScore = 0;
    let oppScore = 0;

    playableCells.forEach ((cell) => {
        let piece = cells[cell].firstChild;

        if(piece && piece.classList.contains(player)) playerScore++;
        else if(piece) oppScore++;
    });

    return playerScore - oppScore;
}
