class TicTacToe {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameOver = false;
    this.cells = document.querySelectorAll('.cell');
    this.status = document.querySelector('.status');
    this.restartBtn = document.getElementById('restartBtn');
    
    this.init();
  }
  
  init() {
    this.cells.forEach(cell => {
      cell.addEventListener('click', () => this.handleCellClick(cell));
    });
    

    this.restartBtn.addEventListener('click', () => this.restartGame());
    
    this.updateStatus();
  }
  
  handleCellClick(cell) {
    const index = parseInt(cell.getAttribute('data-index'));
    
    if (this.board[index] !== null || this.gameOver) {
      return;
    }
    

    this.board[index] = this.currentPlayer;
    cell.textContent = this.currentPlayer;
    cell.classList.add(this.currentPlayer.toLowerCase());
    
    if (this.checkWinner()) {
      this.status.textContent = `Победил: ${this.currentPlayer}!`;
      this.gameOver = true;
      return;
    }
    
    if (this.isBoardFull()) {
      this.status.textContent = 'Ничья!';
      this.gameOver = true;
      return;
    }
    

    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.updateStatus();
  }
  
  checkWinner() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6] 
    ];
    
    return winningCombinations.some(combination => {
      const [a, b, c] = combination;
      return (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      );
    });
  }
  
  isBoardFull() {
    return this.board.every(cell => cell !== null);
  }
  
  updateStatus() {
    if (!this.gameOver) {
      this.status.textContent = `Ход: ${this.currentPlayer}`;
    }
  }
  
  restartGame() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameOver = false;
    

    this.cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('x', 'o');
    });
    
    this.updateStatus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TicTacToe();
});
