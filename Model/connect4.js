export default class Connect4 {
    constructor(columns = 7, rows = 6) {
        this.id = Date.now();
        this.columns = columns;
        this.rows = rows;
        this.board = this.createBoard();
        this.turn = 1;
        this.winningIndexes = null;
        this.movesPlayed = [];
        this.isEnded = 0;
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
            state.turn *= -1;
            state.movesPlayed.push(colIndex);
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

        // arrow function to use this context
        const countInDirection = (dx, dy) => {
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

                this.isEnded = player;
                this.saveGame();
                console.log(`Player ${player} wins!`);
            }
        }

        return winningIndexes;
    }

    saveGame() {
        try {

            const gameState = {
                id: this.id,
                date: new Date().toISOString(),
                room: this.room ?? null,
                moves: this.movesPlayed.slice(),
                winner: this.isEnded,
                columns: this.columns,
                rows: this.rows
            };

            // post to the api
            fetch('http://localhost:3000/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameState)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Game saved successfully:', data);
                })
                .catch(error => {
                    console.error('Error saving game:', error);
                });

        } catch (e) {
            console.warn('Impossible de sauvegarder la partie :', e);
        }
    }

    async loadGame(id) {
        try {
            // fetch from the api
            const response = await fetch(`http://localhost:3000/api/games/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const gameData = await response.json();
            return gameData;

        } catch (e) {
            console.warn('Impossible de charger la partie :', e);
            return null;
        }
    }
}