const createHtmlBoard = () => {
    let board = document.getElementById("board")
    board.className = 'grid-outline'
    let divBoard = document.createElement('div')
    divBoard.className = 'grid'
    board.appendChild(divBoard)
    for(let row=0;row<8;row++){
        for(let column=0;column<8;column++){
            const cell = document.createElement('div');
            const piece = document.createElement('div');
            divBoard.appendChild(cell);
            if(logicalBoard[row][column]===null){
                cell.classList.add("lightwood-square");
            }
            else{
                cell.setAttribute('id',`${row}${column}`);
                cell.classList.add("darkwood-square");
                piece.setAttribute('id',`${row}${column}`);
                cell.appendChild(piece);
                if(logicalBoard[row][column].isWhite === null){
                    piece.classList.add('none');
                }
                else{
                    if(logicalBoard[row][column].isWhite){
                        piece.classList.add('white-man');
                    }
                    if(!logicalBoard[row][column].isWhite){
                        piece.classList.add('black-man');
                    }
                    if(logicalBoard[row][column].isKing){
                        piece.classList.add('king');
                    }
                }
            }
        }
    }
    return board;                 
}

let visualBoard = createHtmlBoard();
const resignBtn = document.getElementById("resign-btn")
const drawBtn = document.getElementById("draw-btn")
const endModal = document.getElementById("end-modal")
const txtEndModal = document.getElementById("txt-end-modal")
const okEndBtn = document.getElementById("ok-btn")
const drawModal = document.getElementById("draw-modal")
const txtDrawModal = document.getElementById("txt-draw-modal")
const noDrawBtn = document.getElementById("no-btn")
const yesDrawBtn = document.getElementById("yes-btn")

document.getElementById('turn').style = isWhiteTurn ? 'background-Color : white; outline: 3px solid #dddddd; color: #dddddd;' : 'background-Color : #333; outline: 3px solid #000; color: #000;';

drawBtn.addEventListener("click", ()=>{
    if (pieceChosen?.classList.contains('clicked'))
        pieceChosen.classList.remove('clicked');
    endTurn();
    drawModal.className = "modal"
    txtDrawModal.innerHTML = (!isWhiteTurn?"WHITE":"BLACK") + " WANTS TO DRAW, DO YOU AGREE?"
})
resignBtn.addEventListener("click", ()=>{
    endModal.className = "modal"
    txtEndModal.innerHTML = isWhiteTurn?"WHITE RESIGNED, BLACK WINS!":"BLACK RESIGNED, WHITE WINS!"
})
okEndBtn.addEventListener("click",()=>{
    document.location.reload();
    endModal.className="none"
    
})
noDrawBtn.addEventListener("click",()=>{
    drawModal.className="none"
})
yesDrawBtn.addEventListener("click",()=>{
    drawModal.className="none"
    endModal.className = "modal"
    txtEndModal.innerHTML = "DRAW BY AGREEMENT."
})

visualBoard.addEventListener('click', (event) => { //first click - piece
    if(event.target.classList.contains('lightwood-square')) return false;
    pieceClickedId = event.target.attributes.id.value
    if (pieceClickedId === null || pieceClickedId === 'board' || event.target.classList.contains('darkwood-square')) return false;
    if (checkFirstClick()) {
        pieceChosen = event.target
        let prevCheckedPiece = document.querySelector('.clicked')
        if(prevCheckedPiece !== null){
            prevCheckedPiece.classList.remove('clicked');
        }
        pieceChosen.classList.add('clicked');
        canEat();
        console.log(piecesCanEatId);
        console.log("piecesCanEatId");
        console.log(locationPieceMustMove);
        console.log("locationPieceMustMove");
    }
    return false;
})
visualBoard.addEventListener('click', (event) => { //second click - square
    if(pieceChosen === null) return false;
    if (!event.target.classList.contains('darkwood-square')) return false;
    if (!event.target.firstChild.classList.contains('none')) return false;
    boxChosen = event.target.firstChild;
    if (!secondClick(boxChosen)) return false;
    endTurn();
    checkForWin();
    document.querySelector('.grid').remove();
    visualBoard = createHtmlBoard();
})