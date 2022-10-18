function createBoard() {
    let board = [];
    let isWhite = true;
    for (let row = 0; row < 8; row++) {
        board.push([]);
        for (let column = 0; column < 8; column++) {
            if ((row % 2 === 0 && column % 2 !== 0) || (row % 2 !== 0 && column % 2 === 0)) {
                if (row === 3 || row === 4)
                    board[row][column] = blackCell();//empty black cell
                else {
                    let type = (row > 4) ? isWhite : !isWhite;
                    board[row][column] = createPiece(type);//black cell with checker piece
                }
            }
            else
                board[row][column] = null;//white cell
        }
    }
    return board;
}
function createPiece(type) {
    return { isWhite: type, isKing: false };
}
function blackCell() {
    return { isWhite: null };
}

let logicalBoard = [];
logicalBoard = createBoard();

let pieceClickedId = null;// the last piece clicked on the board and its id
let pieceChosen = null;// the final piece chosen
let boxChosen = null;// where the piece going to
let middleBox = null;
let isWhiteTurn = false, justAte = false;
let whitePieceCounter = 12, blackPieceCounter = 12;
let piecesCanEatId = [], locationPieceMustMove = [];
let arrayCounter = 0;
let pieceMustEatAgain = null;
let dirToMove = 0;
let piecesCanMove = 0;
let move_piece = null;
let to_cell = null;
let move_from_row = null;
let move_from_column = null;
let move_to_row = null;
let move_to_column = null;

function checkFirstClick() {
    let row = parseInt(pieceClickedId[0]);
    let column = parseInt(pieceClickedId[1]);
    let isLegal;
    let pieceColor = checkForPieceColor(logicalBoard[row][column]);
    dirToMove = (pieceColor === 'black') ? 1 : -1;
    if (logicalBoard[row][column] === null) return false;
    if (!((isWhiteTurn === (pieceColor === 'white')) || ((!isWhiteTurn) === (pieceColor === 'black'))) || pieceColor === 'no') return false;
    isLegal = isCanMove(row, column, pieceColor, dirToMove);
    if (isLegal === false && logicalBoard[row][column].isKing) {
        dirToMove *= -1;
        isLegal = isCanMove(row, column, pieceColor, dirToMove);
    }
    return isLegal;
}
function checkForPieceColor(pieceTest) {
    if (pieceTest === undefined) return '';
    if (pieceTest.isWhite === null) return 'no';
    if (pieceTest.isWhite) return 'white';
    if (!pieceTest.isWhite) return 'black';
}
function secondClick() {
    move_piece = logicalBoard[parseInt(pieceChosen.id[0])][parseInt(pieceChosen.id[1])]
    to_cell = logicalBoard[parseInt(boxChosen.id[0])][parseInt(boxChosen.id[1])]
    move_from_row = parseInt(pieceChosen.id[0]);
    move_from_column = parseInt(pieceChosen.id[1]);
    move_to_row = parseInt(boxChosen.id[0]);
    move_to_column = parseInt(boxChosen.id[1]);
    if (isMoveLegal())
        movePiece();
    else return false;
    if (isPieceAKing())
        pieceBecomeKing();
    return true;
}
function endTurn() {
    isWhiteTurn = !isWhiteTurn;
    document.getElementById('turn').style = isWhiteTurn ? 'background-Color : white; outline: 3px solid #dddddd; color: #dddddd;' : 'background-Color : #333; outline: 3px solid #000; color: #000;';
    resetAll();
}
function canEat() {
    piecesCanEatId = [];
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            let isPieceCanEat = false;
            const pieceToCheck = logicalBoard[row][column];
            if (pieceToCheck === null) continue;
            const pieceColor = checkForPieceColor(pieceToCheck);
            if (pieceColor === 'no') continue;
            dirToMove = (pieceColor === 'white') ? -1 : 1;
            isPieceCanEat = isCanEat(row, column, pieceColor, dirToMove)
            if (isPieceCanEat) {
                piecesCanEatId.push(`${row}${column}`)
            }
            if (!isPieceCanEat && pieceToCheck.isKing) {
                dirToMove *= -1;
                isPieceCanEat = isCanEat(row, column, pieceColor, dirToMove)
                if (isPieceCanEat) {
                    piecesCanEatId.push(`${row}${column}`)
                }
            }
        }
    }
}
function isCanEat(row, column, pieceColor, dirToMove) {
    if (((pieceColor === 'white') && (row < 2) && (dirToMove === -1)) || ((pieceColor === 'black') && (row > 5) && (dirToMove === 1))) return false;
    let rightPieceStyle = checkForPieceColor(logicalBoard[parseInt(row + dirToMove)][parseInt(column + 1)]);
    let leftPieceStyle = checkForPieceColor(logicalBoard[parseInt(row + dirToMove)][parseInt(column - 1)]);
    if (rightPieceStyle === 'no' && leftPieceStyle === 'no') return false;
    let right2PieceStyle = ((column < 6) && 
                            ((((row > 1) && (pieceColor === 'white') && (dirToMove === -1)) || ((pieceColor === 'white') && (dirToMove === 1))) || 
                             (((row < 6) && (pieceColor === 'black') && (dirToMove === 1)) || ((pieceColor === 'black') && (dirToMove === -1))))) ? 
                        checkForPieceColor(logicalBoard[parseInt(row + 2 * dirToMove)][parseInt(column + 2)]) : '';
    let left2PieceStyle = ((column > 1) && 
                           ((((row > 1) && (pieceColor === 'white') && (dirToMove === -1)) || ((pieceColor === 'white') && (dirToMove === 1))) || 
                            (((row < 6) && (pieceColor === 'black') && (dirToMove === 1)) || ((pieceColor === 'black') && (dirToMove === -1))))) ? 
                        checkForPieceColor(logicalBoard[parseInt(row + 2 * dirToMove)][parseInt(column - 2)]) : '';
    if (((isWhiteTurn && pieceColor === 'white' && rightPieceStyle === 'black') || (!isWhiteTurn && pieceColor === 'black' && rightPieceStyle === 'white')) && right2PieceStyle === 'no') {
        locationPieceMustMove.push(`${(row + 2 * dirToMove)}${(column + 2)}`)
        return true;
    }
    if (((isWhiteTurn && pieceColor === 'white' && leftPieceStyle === 'black') || (!isWhiteTurn && pieceColor === 'black' && leftPieceStyle === 'white')) && left2PieceStyle === 'no') {
        locationPieceMustMove.push(`${(row + 2 * dirToMove)}${(column - 2)}`)
        return true;
    }
    return false;
}
function isMoveLegal() {
    if (!move_piece.isKing) {
        if (!(!isWhiteTurn ? move_to_row > move_from_row : move_to_row < move_from_row)) return false;
    }
    if (locationPieceMustMove.length > 0) {
        let isPieceAte = false;
        for (let i = 0; i < piecesCanEatId.length; i++) {
            if ((piecesCanEatId[i] === pieceChosen.id) && (locationPieceMustMove[i] === boxChosen.id)) {
                eat();
                isPieceAte = true;
                return true;
            }
        }
        if (!isPieceAte) {
            if (Math.abs(boxChosen.id[0] - pieceChosen.id[0]) === 1 && Math.abs(boxChosen.id[1] - pieceChosen.id[1]) === 1) {
                for (let i = 0; i < piecesCanEatId.length; i++) {
                    let burnedPieceId = `${piecesCanEatId[i]}`;
                    let burnedPieceBox = logicalBoard[burnedPieceId[0]][burnedPieceId[1]];
                    if (piecesCanEatId[i] === pieceChosen.id) continue;
                    if ((isWhiteTurn && checkForPieceColor(burnedPieceBox) === 'white') || (!isWhiteTurn && checkForPieceColor(burnedPieceBox) === 'black')) {
                        removeBurnedPieces(burnedPieceId);
                    }
                }
                return true;
            }
        }
    }
    else if (locationPieceMustMove == null || locationPieceMustMove.length === 0) {
        if (Math.abs(move_to_row - move_from_row) === 1 && Math.abs(move_to_column - move_from_column) === 1)
            return true;
    }
    return false;
}
function removeBurnedPieces(burnedPieceId) {
    logicalBoard[burnedPieceId[0]][burnedPieceId[1]] = blackCell();
    isWhiteTurn ? whitePieceCounter-- : blackPieceCounter--;
}
function eat() {
    logicalBoard[getMiddleBoxId()[0]][getMiddleBoxId()[1]] = blackCell();
    isWhiteTurn ? blackPieceCounter-- : whitePieceCounter--;
}
function getMiddleBoxId() {
    let minPieceIdX = move_from_row < move_to_row ? move_from_row : move_to_row;
    let minPieceIdY = move_from_column < move_to_column ? move_from_column : move_to_column;
    minPieceIdX++, minPieceIdY++;
    return (`${minPieceIdX}${minPieceIdY}`);
}
function movePiece() {
    let isMovedPieceAKing = logicalBoard[move_from_row][move_from_column].isKing;
    logicalBoard[move_from_row][move_from_column] = blackCell();
    logicalBoard[move_to_row][move_to_column] = createPiece(isWhiteTurn);
    logicalBoard[move_to_row][move_to_column].isKing = isMovedPieceAKing;
}
function removeKing(pieceChosen) {
    pieceChosen.isKing = false;
}
function resetAll() {
    pieceChosen = null;
    pieceClickedId = null;
    boxChosen = null;
    middleBox = null;
    piecesCanEatId = [];
    locationPieceMustMove = [];
    dirToMove = 0;
    move_piece = null;
    to_cell = null;
    move_from_row = null;
    move_from_column = null;
    move_to_row = null;
    move_to_column = null;
}
function pieceBecomeKing() {
    logicalBoard[move_to_row][move_to_column].isKing = true;
}
function isPieceAKing() {
    if ((!logicalBoard[move_to_row][move_to_column].isWhite && move_to_row === 7) || (logicalBoard[move_to_row][move_to_column].isWhite && move_to_row === 0))
        return true;
}
function checkForWin() {
    if (whitePieceCounter === 0) {
        txtEndModal.innerHTML = "BLACK WINS!!"
        endModal.className = "modal"
        return true;
    }
    if (blackPieceCounter === 0) {
        txtEndModal.innerHTML = "WHITE WINS!!"
        endModal.className = "modal"
        return true;
    }
    if (canMove() === 0) {
        txtEndModal.innerHTML = isWhiteTurn ? "BLACK WINS!" : "WHITE WINS!"
        endModal.className = "modal"
        return true;
    }
    return false;
}
function canMove() {
    let pieceToCheck, pieceColor;
    piecesCanMove = 0;
    let dirToMove = 0;
    let isKingCanMove = false;
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            pieceToCheck = logicalBoard[row][column]
            if (pieceToCheck == null) continue;
            pieceColor = checkForPieceColor(pieceToCheck);
            if (pieceColor === 'no') continue;
            dirToMove = (pieceColor === 'white') ? -1 : 1;
            if ((isWhiteTurn && pieceColor === 'white') || (!isWhiteTurn && pieceColor === 'black')) {
                if (isCanMove(row, column, pieceColor, dirToMove)) {
                    if (pieceToCheck.isKing) {
                        isKingCanMove = true;
                    }
                    piecesCanMove++;
                }
                if (!isKingCanMove && pieceToCheck.isKing) {
                    dirToMove *= -1;
                    if (isCanMove(row, column, pieceColor, dirToMove)) {
                        piecesCanMove++;
                    }
                }
            }
        }
    }
    return piecesCanMove;
}
function isCanMove(row, column, pieceColor, dirToMove) {
    if (((pieceColor === 'white') && (row === 0) && (dirToMove === -1)) || ((pieceColor === 'black') && (row === 7) && (dirToMove === 1))) return false;
    let rightPieceStyle = checkForPieceColor(logicalBoard[row + dirToMove][column + 1]);
    let leftPieceStyle = checkForPieceColor(logicalBoard[row + dirToMove][column - 1]);
    if (rightPieceStyle === 'no' || leftPieceStyle === 'no') return true;
    let right2PieceStyle = ((column < 6) && 
                            ((((row > 1) && (pieceColor === 'white') && (dirToMove === -1)) || ((pieceColor === 'white') && (dirToMove === 1))) || 
                             (((row < 6) && (pieceColor === 'black') && (dirToMove === 1)) || ((pieceColor === 'black') && (dirToMove === -1))))) ? 
                        checkForPieceColor(logicalBoard[row + 2 * dirToMove][column + 2]) : '';
    let left2PieceStyle = ((column > 1) && 
                            ((((row > 1) && (pieceColor === 'white') && (dirToMove === -1)) || ((pieceColor === 'white') && (dirToMove === 1))) || 
                             (((row < 6) && (pieceColor === 'black') && (dirToMove === 1)) || ((pieceColor === 'black') && (dirToMove === -1))))) ? 
                        checkForPieceColor(logicalBoard[row + 2 * dirToMove][column - 2]) : '';
    if ((pieceColor !== rightPieceStyle) && right2PieceStyle === 'no') return true;
    if ((pieceColor !== leftPieceStyle) && left2PieceStyle === 'no') return true;
    return false;
}