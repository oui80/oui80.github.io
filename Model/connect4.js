export default class Connect4 {
    constructor(columns = 7, rows = 6) {
        this.columns = columns;
        this.rows = rows;
        this.board = this.createBoard();
        this.turn = 1;
        this.winningIndexes = null;
    }

    createBoard() {
        const board = [];
        for (let col = 0; col < this.columns; col++) {
            const column = [];
            for (let row = 0; row < this.rows; row++) {
                column.push(0);
            }
            board.push(column);
        }
        return board;
    }



    availableMoves(board) {
        let moves = [];
        for (let colIndex = 0; colIndex < board.length; colIndex++) {
            if (board[colIndex][0] === 0) {
                moves.push(colIndex);
            }
        }
        return moves;
    }

    getRowIndex(board, colIndex) {
        const col = board[colIndex];
        let rowIndex = 0
        while (rowIndex < col.length && col[rowIndex + 1] == 0) {
            rowIndex++
        }
        return rowIndex
    }


    play(state, player, colIndex, rowIndex) {
        let board = state.board
        let turn = state.turn;

        const moves = this.availableMoves(board);
        if (moves.includes(colIndex) && turn == player) {
            board[colIndex][rowIndex] = player;
            state.turn *= -1
        } else {
            // cannot play
        }
    }

    getNeighbors(board, colIndex, rowIndex) {
        const indexes = [
            (colIndex - 1, rowIndex - 1), (colIndex, rowIndex - 1), (colIndex + 1, rowIndex - 1),
            (colIndex - 1, rowIndex), (colIndex + 1, rowIndex),
            (colIndex - 1, rowIndex + 1), (colIndex, rowIndex + 1), (colIndex + 1, rowIndex + 1)
        ]

        const neighbors = []
        for (e in indexes) {
            if (e[0] >= 0 && e[0] < board.length && e[1] >= 0 && e[1] < board[0].length) {
                neighbors.push(board[e[0]][e[1]])
            }
        }

        return neighbors;
    }

    checkWin(board, colIndex, rowIndex) {
        const player = board[colIndex][rowIndex];
        const needed = 4;

        function countInDirection(dx, dy) {
            let count = 0;
            let x = colIndex + dx;
            let y = rowIndex + dy;

            const indexes = [];

            while (x >= 0 && x < board.length && y >= 0 && y < board[0].length && board[x][y] == player) {
                count++;
                indexes.push([x, y]);

                x += dx;
                y += dy;
            }

            return [count, indexes];
        }

        const directions = [
            [1, 0],  // horizontal
            [0, 1],  // vertical
            [1, 1],  // diagonale \
            [1, -1], // diagonale /
        ];


        const winningIndexes = [];

        for (const [dx, dy] of directions) {
            const [count, indexes] = countInDirection(dx, dy);
            const [countOpp, indexesOpp] = countInDirection(-dx, -dy);
            const total = 1 + count + countOpp;
            if (total >= needed) {
                // we concat the winning indexes
                indexes.push([colIndex, rowIndex]);
                indexes.push(...indexesOpp);
                winningIndexes.push(...indexes);
            }
        }

        return winningIndexes;
    }
}