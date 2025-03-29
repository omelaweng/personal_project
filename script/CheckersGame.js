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

                if (row < 2 && (row + col) % 2 !== 0) {
                    const piece = createPiece("red");
                    cell.appendChild(piece);
                } else if (row > 5 && (row + col) % 2 !== 0) {
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
        const rowDiff = targetRow - startRow;
        const colDiff = Math.abs(targetCol - startCol);

        if (selectedPiece.classList.contains("king")) {
            if (isValidKingMove(startRow, startCol, targetRow, targetCol)) {
                capturePiecesAlongPath(startRow, startCol, targetRow, targetCol);
                targetCell.appendChild(selectedPiece);
                checkKing(targetCell, selectedPiece);
                switchTurn();
            }
        } else {
            const direction = selectedPiece.dataset.color === "red" ? 1 : -1;
            if (rowDiff === direction && colDiff === 1 && !targetCell.querySelector(".piece") && !hasMandatoryJump()) {
                targetCell.appendChild(selectedPiece);
                checkKing(targetCell, selectedPiece);
                switchTurn();
            } else if (Math.abs(rowDiff) === 2 && colDiff === 2) {
                const middleRow = (targetRow + startRow) / 2;
                const middleCol = (targetCol + startCol) / 2;
                const middleCell = document.querySelector(`.cell[data-row='${middleRow}'][data-col='${middleCol}']`);
                const middlePiece = middleCell?.querySelector(".piece");

                if (middlePiece && middlePiece.dataset.color !== currentPlayer) {
                    middleCell.removeChild(middlePiece);
                    targetCell.appendChild(selectedPiece);
                    checkKing(targetCell, selectedPiece);
                    switchTurn();
                }
            }
        }

        selectedPiece.classList.remove("selected");
        selectedPiece = null;
    }

    function isValidKingMove(startRow, startCol, targetRow, targetCol) {
        const rowDiff = Math.abs(targetRow - startRow);
        const colDiff = Math.abs(targetCol - startCol);
        return rowDiff === colDiff;
    }

    function capturePiecesAlongPath(startRow, startCol, targetRow, targetCol) {
        const rowStep = targetRow > startRow ? 1 : -1;
        const colStep = targetCol > startCol ? 1 : -1;
        let row = startRow + rowStep;
        let col = startCol + colStep;

        while (row !== targetRow && col !== targetCol) {
            const middleCell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            const middlePiece = middleCell?.querySelector(".piece");
            if (middlePiece && middlePiece.dataset.color !== currentPlayer) {
                middleCell.removeChild(middlePiece);
            }
            row += rowStep;
            col += colStep;
        }
    }

    function hasMandatoryJump() {
        const pieces = document.querySelectorAll(`.piece.${currentPlayer}`);
        for (let piece of pieces) {
            const cell = piece.parentElement;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const directions = piece.classList.contains("king")
                ? [[1, -1], [1, 1], [-1, -1], [-1, 1]]
                : (currentPlayer === "red" ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]]);
            for (let [rowDir, colDir] of directions) {
                const middleRow = row + rowDir;
                const middleCol = col + colDir;
                const targetRow = row + rowDir * 2;
                const targetCol = col + colDir * 2;
                const middleCell = document.querySelector(`.cell[data-row='${middleRow}'][data-col='${middleCol}']`);
                const targetCell = document.querySelector(`.cell[data-row='${targetRow}'][data-col='${targetCol}']`);
                if (middleCell && targetCell && !targetCell.querySelector(".piece")) {
                    const middlePiece = middleCell.querySelector(".piece");
                    if (middlePiece && middlePiece.dataset.color !== currentPlayer) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function checkKing(cell, piece) {
        const row = parseInt(cell.dataset.row);
        if ((piece.dataset.color === "red" && row === 7) || (piece.dataset.color === "blue" && row === 0)) {
            piece.classList.add("king");
            piece.innerText = "K";
        }
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
