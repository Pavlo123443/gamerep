document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('board');
    const restartBtn = document.getElementById('restartBtn');
    const playerXScoreElem = document.getElementById('playerXScore');
    const playerOScoreElem = document.getElementById('playerOScore');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let playerXScore = 0;
    let playerOScore = 0;

    // Create the game board
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }

    // Event listener for cell click
    function handleCellClick(event) {
        const clickedCell = event.target;
        const index = clickedCell.getAttribute('data-index');

        if (gameBoard[index] === '' && gameActive) {
            gameBoard[index] = currentPlayer;
            clickedCell.textContent = currentPlayer;

            if (checkWin()) {
                updateScore();
                endGame();
            } else if (isBoardFull()) {
                endGame();
            } else {
                switchPlayer();
                if (currentPlayer === 'O') {
                    setTimeout(() => makeBotMove(), 500);
                }
            }
        }
    }

    // Event listener for restart button
    restartBtn.addEventListener('click', restartGame);

    // Check if the current player has won
    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c];
        });
    }

    // Check if the game board is full
    function isBoardFull() {
        return gameBoard.every(cell => cell !== '');
    }

   // Оновлення playerXScore та playerOScore при виграші гравців
function updateScore() {
    if (currentPlayer === 'X') {
        playerXScore++;
        playerXScoreElem.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreElem.textContent = playerOScore;
    }
}


    // Switch the current player
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    // End the game
    function endGame() {
        gameActive = false;
    }

    // Restart the game
function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
    });

    currentPlayer = 'X';
}


    // Smart Bot Move
    function makeBotMove() {
        const emptyCells = gameBoard.reduce((acc, value, index) => {
            if (value === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        let botMoveIndex;

        // Check if the bot can win on the next move
        for (const index of emptyCells) {
            const tempBoard = [...gameBoard];
            tempBoard[index] = 'O';
            if (checkWinForPlayer(tempBoard, 'O')) {
                botMoveIndex = index;
                break;
            }
        }

        // If the bot cannot win, check if the player can win and block them
        if (botMoveIndex === undefined) {
            for (const index of emptyCells) {
                const tempBoard = [...gameBoard];
                tempBoard[index] = 'X';
                if (checkWinForPlayer(tempBoard, 'X')) {
                    botMoveIndex = index;
                    break;
                }
            }
        }

        // If there is no opportunity to block or win, choose a random move
        if (botMoveIndex === undefined) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            botMoveIndex = emptyCells[randomIndex];
        }

        gameBoard[botMoveIndex] = 'O';

        const botMoveCell = document.querySelector(`.cell[data-index="${botMoveIndex}"]`);
        botMoveCell.textContent = 'O';

        if (checkWin()) {
            updateScore();
            endGame();
        } else if (isBoardFull()) {
            endGame();
        } else {
            switchPlayer();
        }
    }

    // Check if a player wins on the given board state
    function checkWinForPlayer(board, player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]              // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] === player && board[a] === board[b] && board[b] === board[c];
        });
    }
});
