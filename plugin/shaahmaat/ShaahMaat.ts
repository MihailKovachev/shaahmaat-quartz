import * as jsdom from "jsdom"

import { BoardOrientation, ShaahMaatBoardInfo } from './ShaahMaatBoardInfo';
import { ShaahMaatSettings } from './ShaahMaatSettings';

export const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ROWS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export default class ShaahMaatRenderer {

    public static createChessBoardElement(boardInfo: ShaahMaatBoardInfo, options: ShaahMaatSettings): HTMLElement {
        let board = boardInfo.board;
        
        let document = new jsdom.JSDOM().window.document;
        let chessboardDiv = document.createElement("div");
        chessboardDiv.classList.add("shaahmaat-chessboard");
        chessboardDiv.setAttribute("style", `width: ${boardInfo.size}px; height: ${boardInfo.size}px;`);

        let squaresWithPieces = new Array<{ row: number, column: number }>();

        for (let i = 0; i < 8; ++i) {
            let row = document.createElement("div");
            row.classList.add("shaahmaat-chessboard-row");

            // Generate the board
            for (let j = 0; j < 8; ++j) {

                let backgroundColor = (i + j) % 2 == 0 ? options.lightSquareColor : options.darkSquareColor;

                let columnCoord = boardInfo.orientation === BoardOrientation.White ? COLUMNS[j] : COLUMNS[7 - j];
                let rowCoord = boardInfo.orientation === BoardOrientation.White ? ROWS[7 - i] : ROWS[i];

                let square = document.createElement("div");
                square.classList.add("shaahmaat-chessboard-square");
                square.setAttribute("data-square-coordinates", `${columnCoord}${rowCoord}`);

                // Check if the square is highlighted
                let isSquareHighlighted = false;
                for (let sq of boardInfo.highlightedSquares) {
                    if (sq.charAt(0) === columnCoord && sq.charAt(1) == rowCoord) {
                        isSquareHighlighted = true;
                        break;
                    }
                }

                square.setAttribute("style", `--square-background-color: ${isSquareHighlighted ? options.highlightedSquareColor : backgroundColor}`);

                if (board !== null && board[i][j] !== null) {
                    squaresWithPieces.push({ row: i, column: j });
                }

                row.appendChild(square);
            }

            chessboardDiv.appendChild(row);
        }

        // No need to render pieces if the board does not have any
        if (board === null) {
            return chessboardDiv;
        }

        // Render the pieces
        for (let squareIndices of squaresWithPieces) {
            let color = board[squareIndices.row][squareIndices.column].color === 'w' ? "white" : "black";
            let piece = "";

            switch (board[squareIndices.row][squareIndices.column].type) {
                case 'b': {
                    piece = "bishop";
                    break;
                }
                case 'k': {
                    piece = "king";
                    break;
                }
                case 'n': {
                    piece = "knight";
                    break;
                }
                case 'p': {
                    piece = "pawn";
                    break;
                }
                case 'q': {
                    piece = "queen";
                    break;
                }
                case 'r': {
                    piece = "rook";
                    break;
                }
            }

            let square = chessboardDiv.querySelector("[data-square-coordinates='" + board[squareIndices.row][squareIndices.column].square + "']");

            square!.classList.add("shaahmaat-chess-piece");
            square!.classList.add(`${options.chessSet}-chess-set`);
            square!.classList.add(piece);
            square!.classList.add(color);
        }

        // Render arrows
        let arrowsSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        arrowsSvg.setAttribute("width", `${boardInfo.size}px`);
        arrowsSvg.setAttribute("height", `${boardInfo.size}px`)
        arrowsSvg.classList.add("shaahmaat-arrows");

        for (let annotation of boardInfo.arrows) {
            let fromDiv = chessboardDiv.querySelector("[data-square-coordinates='" + annotation.from + "']");
            let toDiv = chessboardDiv.querySelector("[data-square-coordinates='" + annotation.to + "']");

            let startX = undefined;
            let startY = undefined;
            let endX = undefined;
            let endY = undefined;

            let startColumn = undefined;
            let startRow = undefined;
            let endColumn = undefined;
            let endRow = undefined;

            switch (boardInfo.orientation) {
                case BoardOrientation.Black: {

                    startColumn = 7 - COLUMNS.findIndex((col) => col === fromDiv!.getAttribute("data-square-coordinates")!.charAt(0));
                    startRow = parseInt(fromDiv!.getAttribute("data-square-coordinates")!.charAt(1)) - 1;
                    endColumn = 7 - COLUMNS.findIndex((col) => col === toDiv!.getAttribute("data-square-coordinates")!.charAt(0));
                    endRow = parseInt(toDiv!.getAttribute("data-square-coordinates")!.charAt(1)) - 1;

                    break;
                }
                case BoardOrientation.White: {
                    startColumn = COLUMNS.findIndex((col) => col === fromDiv!.getAttribute("data-square-coordinates")!.charAt(0));
                    startRow = 8 - parseInt(fromDiv!.getAttribute("data-square-coordinates")!.charAt(1));
                    endColumn = COLUMNS.findIndex((col) => col === toDiv!.getAttribute("data-square-coordinates")!.charAt(0));
                    endRow = 8 - parseInt(toDiv!.getAttribute("data-square-coordinates")!.charAt(1));

                    break;
                }
            }

            let squareSide = boardInfo.size / 8;
            startX = startColumn * squareSide + squareSide / 2;
            startY = startRow * squareSide + squareSide / 2;
            endX = endColumn * squareSide + squareSide / 2;
            endY = endRow * squareSide + squareSide / 2;

            let arrowBodyGirth = squareSide / 6;
            let arrowHeadHeight = arrowBodyGirth * 3;
            let arrowHeadLength = arrowHeadHeight * 1.5;

            const h = (Math.sqrt(3) / 2) * arrowHeadLength;

            const arrowLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

            // Create a horizontal arrow pointing to the right and then rotate it appropriately
            const ax = startX;
            const ay = startY - arrowBodyGirth / 2;
            const bx = startX + arrowLength - arrowHeadLength / 2;
            const by = ay;
            const cx = bx;
            const cy = startY - arrowHeadHeight / 2;
            const dx = startX + arrowLength;
            const dy = startY;
            const ex = bx;
            const ey = startY + arrowHeadHeight / 2;
            const fx = bx;
            const fy = startY + arrowBodyGirth / 2;
            const gx = startX;
            const gy = fy;

            let arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            arrow.setAttribute("points", `${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy} ${ex},${ey} ${fx},${fy} ${gx},${gy}`);
            arrow.setAttribute("transform", `rotate(${Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)}, ${startX}, ${startY})`)
            arrow.setAttribute("fill", options.arrowColor);

            arrowsSvg.appendChild(arrow);
        }

        chessboardDiv.appendChild(arrowsSvg);

        return chessboardDiv;
    }
}