import Connect4 from '../Model/connect4.js';
import View from '../View/boardView.js';

export default class Controller {
    constructor() {
        this.state = new Connect4();
        this.view = new View();
        this.view.initRenderBoard(this.state, this.handleClick.bind(this));
    }

    
    handleClick(colIndex) {
        const player = this.state.turn;
        const rowIndex = this.state.getRowIndex(this.state.board, colIndex);

        this.state.play(this.state, player, colIndex, rowIndex);
        this.state.winningIndexes = this.state.checkWin(this.state.board, colIndex, rowIndex);
        this.view.updateRender(this.state, colIndex);
    }
}

const controller = new Controller();
