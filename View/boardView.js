
export default class View {
    constructor() {}

    initRenderBoard(state, handleClick) {
        const gameBoard = document.getElementById("game-board");
        const board = state.board;
        for (let colIndex = 0; colIndex < board.length; colIndex++) {
            const colDiv = document.createElement("div");
            colDiv.classList.add("column");
            colDiv.setAttribute("id", colIndex);
            colDiv.addEventListener("click", () => handleClick(colIndex));
            gameBoard.appendChild(colDiv);
            for (let rowIndex = 0; rowIndex < board[colIndex].length; rowIndex++) {
                const cellDiv = document.createElement("div");
                cellDiv.classList.add("cell");
                cellDiv.setAttribute("id", `${colIndex}-${rowIndex}`);
                const coin = document.createElement("div");
                coin.classList.add("coin")
                cellDiv.appendChild(coin)
                if (board[colIndex][rowIndex] === 1) {
                    const player = document.createElement("div");
                    player.classList.add("coin", "player1");
                    coin.appendChild(player);
                } else if (board[colIndex][rowIndex] === -1) {
                    const player = document.createElement("div");
                    player.classList.add("coin", "player2");
                    coin.appendChild(player);
                }
                colDiv.appendChild(cellDiv);
            }
        }
    }


    updateRender(state, colIndex) {
        const board = state.board;
        for (let rowIndex = 0; rowIndex < board[colIndex].length; rowIndex++) {
            const cellDiv = document.getElementById(`${colIndex}-${rowIndex}`);
            const coin = cellDiv.querySelector(".coin");
            coin.innerHTML = "";
            if (board[colIndex][rowIndex] === 1) {
                const player = document.createElement("div");
                player.classList.add("coin", "player1");
                coin.appendChild(player);
            } else if (board[colIndex][rowIndex] === -1) {
                const player = document.createElement("div");
                player.classList.add("coin", "player2");
                coin.appendChild(player);
            }
        }

        const winningIndexes = state.winningIndexes;
        if (winningIndexes) {
            for (const [winCol, winRow] of winningIndexes) {
                const cellDiv = document.getElementById(`${winCol}-${winRow}`);
                const coin = cellDiv.querySelector(".coin");
                coin.classList.add("winning-coin");
            }
        }
    }
}