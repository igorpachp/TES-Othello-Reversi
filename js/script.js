// tabuleiro
const main = document.getElementById('main');
let board = null;
// array para faciliar o acesso às células
const cells = [];
const pseudoBoard = [];
// array para estipular quais células são jogaveis, ou seja, podem armazenar uma peça
const playableCells = range(11, 89).filter(i => 1 <= i % 10 && i % 10 <= 8);
const CELLS_VALUES = [
    0,  0   ,  0    ,  0    ,  0    ,  0    ,  0    ,  0    ,  0    , 0,
    0,  120	, -20	,  20	,  5	,  5	,  20  	, -20  	,  120  , 0,
    0, -20	, -40	, -5  	, -5  	, -5  	, -5  	, -40	, -20   , 0,
    0,  20	, -5  	,  15  	,  3  	,  3  	,  15  	, -5  	,  20   , 0,
    0,  5	, -5  	,  3  	,  3  	,  3  	,  3  	, -5  	,  5	, 0,
    0,  5	, -5  	,  3  	,  3  	,  3  	,  3  	, -5  	,  5	, 0,
    0,  20	, -5  	,  15  	,  3  	,  3  	,  15  	, -5  	,  20   , 0,
    0, -20	, -40	, -5  	, -5  	, -5  	, -5  	, -40	, -20   , 0,
    0,  120	, -20  	,  20  	,  5  	,  5  	,  20  	, -20  	,  120  , 0,
    0,  0   ,  0    ,  0    ,  0    ,  0    ,  0    ,  0    ,  0    , 0
];
const MAX_BOARD_VALUE = CELLS_VALUES.map((weight) => weight >= 0 ? weight : -weight).reduce((sum, weight) => sum + weight, 0);
const MIN_BOARD_VALUE = -MAX_BOARD_VALUE;

// placar
const blackScore = document.getElementById('black');
const whiteScore = document.getElementById('white');
const turnStr = document.getElementById('turn');
// array para guardar toda a sequencia de movimentos executados por ambos os jogadores
const gameMoves = [];

// jogadores
const BLACK = 'black';
const WHITE = 'white';
let playerHuman = BLACK;
let playerAI = WHITE;
let turn = playerHuman; // determina qual jogador deve jogar nesta rodada
// contagem de peças para cada jogador
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

// função encarregada de iniciar o jogo
function startGame() {
    // criando elemento tabuleiro e adicionando a página
    if (!board) {
        board = createBoard(10);
        main.appendChild(board);
    }

    setStartingPosition(false); // construindo estado inicial do jogo
    setScoreText(); // mostrando placar inicial

    // redefinindo objetos visiveis e invisíveis na página
    main.style.display = 'block';
    btnrestart.style.display = 'block';
    btnstart.style.display = 'none';
}

// função para voltar o jogo ao estado inicial
function resetGame() {
    blackCount = 0;
    whiteCount = 0;
    setStartingPosition(true);
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

    // criando as linhas
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

    // criando as células
    for (let row of rows) {
        for (let j = 0; j < size; j++) {
            let cell = createCell(i + j);

            // bloqueando células inúteis
            if (j == 0 || j == size - 1 || row == board.firstChild || row == board.lastChild) {
                cell.classList.add('blocked');
            }
            cells.push(cell);
            pseudoBoard.push(null);
            row.appendChild(cell);
        }
        i += 10;
    }
    
    return board;
}

// função para atualizar o placar e mensagem de turnos
function setScoreText() {
    whiteScore.innerHTML = `Brancas: ${whiteCount}`;
    blackScore.innerHTML = `Pretas: ${blackCount}`;
    turnStr.innerHTML = turn ? `Jogam as ${turn == BLACK ? 'Pretas' : 'Brancas'}` : 'Fim de Jogo';
}

// função para estabelecer estado inicial do jogo
function setStartingPosition(isReset) {
    turn = playerHuman; // o jogador sempre terá o primeiro movimento

    // se a função é chamada com o intuito de redefinir o tabuleiro
    // precisamos remover todas as peças antes de prosseguir
    if (isReset) {
        playableCells.forEach((id) => {
            let cell = cells[id];

            if (cell.firstChild) {
                cell.firstChild.remove();
            }
            pseudoBoard[id] = null;
        })
    };

    insertPiece(44, WHITE, pseudoBoard);
    insertPiece(55, WHITE, pseudoBoard);
    insertPiece(54, BLACK, pseudoBoard);
    insertPiece(45, BLACK, pseudoBoard);
}

// função para criar células
function createCell(id) {
    const newCell = document.createElement('div');

    newCell.classList.add('cell');
    newCell.id = `${id}`;
    newCell.onclick = () => {
        // tenta fazer uma jogada para o jogador
        play(playerHuman, id, pseudoBoard);
        // pede que o computador realize sua(s) jogada(s)
        // precisamos verificar múltiplas vezes se ainda é turno
        // do computador pois pode acontecer de não haver movimentos 
        // legais para o jogador, neste caso o computador
        // realiza movimentos até que o jogador tenha jogadas,
        //  ou até que o jogo acabe quando as jogadas legais
        // do computador também se esgotarem
        while (turn == playerAI) aiPlay(minimaxSearcher(3, weightedScore));
    };

    return newCell;
}

// função responsável por tentar realizar um movimento para um jogador
function play(player, id, brd) {
    // um movimento só deve ser feito se forem verdadeiras as condições:
    //   -> o turno é do jogador
    //   -> a célula é válida
    //   -> o movimento é legal
    if (isPlayerTurn(player) && isValidCell(id) && isLegalMove(id, player, brd)) {
        makeMove(id, player, brd);
        turn = nextPlayer(brd, player); // determina qual jogador terá o próximo turno
    }
    setScoreText(); // atualiza placar

    return [brd, weightedScore(playerHuman, brd)];
}

// função para determinar qual jogador deve executar a próxima jogada
function nextPlayer(brd, previous) {
    const opp = opponent(previous);

    // se o oponento do jogador atual possui 
    // jogadas disponíveis, o próximo turno é dele
    if(hasAvailableMoves(opp, brd)) return opp;
    // caso contrário, se o jogador atual ainda 
    // possui movimentos disponíveis, o próximo turno é dele
    if(hasAvailableMoves(previous, brd)) return previous;
    
    // se nenhum jogador possui jogadas, fim do jogo
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
function insertPiece(id, color, brd) {
    brd[id] = color;

    // atualizando contagem de peças
    if (brd == pseudoBoard) {
        cells[id].appendChild(createPiece(color));
        if (color == BLACK) blackCount++;
        else whiteCount++;
    }
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
function isLegalMove(move, player, brd) {
    // o movimento é legal se a nova peça está sendo
    // inserida em uma célula válida vazia, e envolve
    // uma ou mais peças do oponente com alguma outra peça 
    // do jogador já posicionada no tabuleiro
    function formsBracket(direction) {
        // retorna se é possivel encontrar outra peça 
        // do jogador na direção recebida
        return findBracket(move, player, brd, direction);
    }

    // retorna:
    // true (celula escolhida esta vazia e movimento captura pelo menos 1 peça em pelo menos 1 direção)
    // false (celula escolhida não esta vazia ou movimento não captura nenhuma peça em nenhuma direção)
    return !brd[move] && DIRECTIONS.map(formsBracket).some((cell) => cell != null);
}

// função para percorrer as células 
// em uma direção até encontrar uma 
// peça da cor do jogador, ou até
// chegar a uma borda
function findBracket(cell, player, brd, direction) {
    let bracket = cell + direction;
    const opp = opponent(player);

    // se a primeira celula nesta direção possuir uma peça do mesmo jogador, retorne nulo
    if (cellHoldsPieceOfColor(bracket, player, brd)) return null;
    // ande na direção até encontrar uma célula que não contenha uma peça do oponente
    while (cellHoldsPieceOfColor(bracket, opp, brd)) bracket += direction;

    // retorne:
    // id da celula, caso contenha uma peça (obrigatoriamente do jogador)
    // nulo, caso a celula não contenha peça
    return brd[bracket] ? bracket : null;
}

// função para verificar se uma celula contém
// uma peça de determinada cor
function cellHoldsPieceOfColor(id, color, brd) {
    if (!brd[id]) return false;
    return brd[id] == color;
}

// função para determinar o oponente
// de um jogador
function opponent(player) {
    return player == WHITE ? BLACK : WHITE;
}

// função para verificar se o turno pertence ao jogador
function isPlayerTurn(player) {
    return player == turn;
}

// função para inverter a cor de peças capturadas
function swapPieces(move, player, brd, direction) {
    // procura o id da celula que forma a captura nesta direção
    const bracket = findBracket(move, player, brd, direction);
    let cell = move + direction;

    // se o id é nulo, retorne
    if(!bracket) return;

    // ande na direção até chegar a célula de captura
    while (cell != bracket) {
        // troca de cor
        brd[cell] = player;
        // muda placar
        if (brd == pseudoBoard) {
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
        }

        cell += direction;
    }
}

// função para calcular os possiveis movimentos de um jogador
function legalMoves(player, brd) {
    // retorna o id de todas as céculas que formam movimentos legais
    return playableCells.filter(move => isLegalMove(move, player, brd));
}

// função para verificar se o jogador possui movimentos
function hasAvailableMoves(player, brd) {
    return legalMoves(player, brd).length > 0;
}

// função para contar as peças de cada jogador em um tabuleiro
function countPieces(player, brd, pScore, oScore, weighted) {
    playableCells.forEach((cell) => {
        let piece = brd[cell];

        if (piece && piece == player) pScore += weighted ? CELLS_VALUES[cell] : 1;
        else if(piece) oScore += weighted ? CELLS_VALUES[cell] : 1;
    });

    return [pScore, oScore];
}

// função para avaliar vantagem de um jogador sobre outro
function weightedScore(player, brd) {
    let playerScore = 0;
    let oppScore = 0;

    let scr = countPieces(player, brd, playerScore, oppScore, true);
    [playerScore, oppScore] = scr;

    return playerScore - oppScore;
}

// função para realizar um movimento de um jogador
function makeMove(move, player, brd) {
    insertPiece(move, player, brd);
    DIRECTIONS.forEach(direction =>{
        swapPieces(move, player, brd, direction);
    });

    return brd;
}

// função responsável pelas decisões e movimentos do computador
function aiPlay(strategy) {
    const brd = pseudoBoard;
    let ai = playerAI;

    // só executa movimentos em seus turnos
    if (isPlayerTurn(ai)) {
        // escolhe um movimento de acordo com a estratégia
        let move = getMove(strategy, ai, brd);

        // executa movimento
        makeMove(move, ai, brd);
        gameMoves.push(`${ai}${move}`);
        turn = nextPlayer(brd, ai);
        // atualiza placar
        setScoreText();
    }

    return [brd, weightedScore(playerHuman, brd)];
}

// função para escolher movimento do computador de acordo com a estrategia
function getMove(strategy, player, brd) {
    // faz replica do tabuleiro para evitar jogadas indesejadas
    const copy = cloneBoard(brd);
    // determina movimento
    const move = strategy(player, copy);

    // se a celula escolhida não é valido ou o movimento não é legal, returne nulo
    if (!isValidCell(move) || !isLegalMove(move, player, brd)) return null;

    return move;
}

// função para fazer uma cópia profunda do tabuleiro
function cloneBoard(brd) {
    return [...brd];
}

function minimax(player, brd, depth, evaluate) {
    const moves = legalMoves(player, brd);
    const opp = opponent(player);
    
    function value(brd) {
        return -minimax(opp, brd, depth - 1, evaluate)[0];
    }
    
    if (!depth) return [evaluate(player, brd), null];
    if (!moves) {
        if (!hasAvailableMoves(opp, brd)) return [finalValue(player, brd), null];
        return [value(brd), null];
    }

    let greaterMove = moves[0];
    let greaterValue = value(makeMove(greaterMove, player, cloneBoard(brd)));
    
    for (let i = 1; i < moves.length; i++) {
        let newValue = value(makeMove(moves[i], player, cloneBoard(brd)));

        if (newValue > greaterValue) {
            greaterMove = moves[i];
            greaterValue = newValue;
        }
    }
    
    return [greaterValue, greaterMove];
}

function finalValue(player, brd) {
    const diff = score(player, brd);

    return diff < 0 ? MIN_BOARD_VALUE: diff > 0 ? MAX_BOARD_VALUE : diff;
}

function minimaxSearcher(depth, evaluate) {

    function strategy(player, brd) {
        return minimax(player, brd, depth, evaluate)[1];
    }

    return strategy;
}
