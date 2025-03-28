// script.js

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    let selectedPiece = null;
    let currentPlayer = "red";

    function createBoard() {
        board.innerHTML = "";
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.classList.add((row + col) % 2 === 0 ? "white" : "black");
                cell.dataset.row = row;
                cell.dataset.col = col;

                if (row < 3 && (row + col) % 2 !== 0) {
                    const piece = createPiece("red");
                    cell.appendChild(piece);
                } else if (row > 4 && (row + col) % 2 !== 0) {
                    const piece = createPiece("blue");
                    cell.appendChild(piece);
                }

                cell.addEventListener("click", onCellClick);
                board.appendChild(cell);
            }
        }
    }

    function createPiece(color) {
        const piece = document.createElement("div");
        piece.classList.add("piece", color);
        piece.dataset.color = color;
        piece.draggable = true;
        return piece;
    }

    function onCellClick(event) {
        const cell = event.currentTarget;
        const piece = cell.querySelector(".piece");

        if (selectedPiece) {
            movePiece(cell);
        } else if (piece && piece.dataset.color === currentPlayer) {
            selectedPiece = piece;
            piece.classList.add("selected");
        }
    }

    function movePiece(targetCell) {
        const targetRow = parseInt(targetCell.dataset.row);
        const targetCol = parseInt(targetCell.dataset.col);
        const startRow = parseInt(selectedPiece.parentElement.dataset.row);
        const startCol = parseInt(selectedPiece.parentElement.dataset.col);

        const rowDiff = Math.abs(targetRow - startRow);
        const colDiff = Math.abs(targetCol - startCol);

        if (rowDiff === 1 && colDiff === 1 && !targetCell.querySelector(".piece")) {
            targetCell.appendChild(selectedPiece);
            switchTurn();
        } else if (rowDiff === 2 && colDiff === 2) {
            const middleRow = (targetRow + startRow) / 2;
            const middleCol = (targetCol + startCol) / 2;
            const middleCell = document.querySelector(`.cell[data-row='${middleRow}'][data-col='${middleCol}']`);
            const middlePiece = middleCell.querySelector(".piece");
            
            if (middlePiece && middlePiece.dataset.color !== currentPlayer) {
                middleCell.removeChild(middlePiece);
                targetCell.appendChild(selectedPiece);
                switchTurn();
            }
        }

        selectedPiece.classList.remove("selected");
        selectedPiece = null;
    }

    function switchTurn() {
        currentPlayer = currentPlayer === "red" ? "blue" : "red";
    }

    document.getElementById("restart").addEventListener("click", () => {
        createBoard();
        currentPlayer = "red";
    });

    createBoard();
});
