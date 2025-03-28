// script.js

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    let selectedPiece = null;

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
        } else if (piece) {
            selectedPiece = piece;
            piece.classList.add("selected");
        }
    }

    function movePiece(targetCell) {
        if (!targetCell.querySelector(".piece") && targetCell.classList.contains("black")) {
            targetCell.appendChild(selectedPiece);
        }
        selectedPiece.classList.remove("selected");
        selectedPiece = null;
    }

    document.getElementById("restart").addEventListener("click", () => {
        createBoard();
    });

    createBoard();
});
