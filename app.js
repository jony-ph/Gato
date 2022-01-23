// Selectores
const btnStart = document.querySelector('#btn-start');
const btnRestart = document.querySelector('#btn-restart');
const boxMessage = document.querySelector('#box-message');
const board = document.querySelectorAll('.cells');

// Variables/constantes
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
let gameState = ['', '', '', '', '', '', '', '', ''];
let userFigure;
let iaFigure;
let playerTurn;

eventListeners();

// Eventos
function eventListeners() {
    btnStart.addEventListener('click', startGame);
    btnRestart.addEventListener('click', restartGame);
}

// Clases
class UI {

    insertMessage(message) {

        boxMessage.style.display = "inherit";
        boxMessage.textContent = message;
        
        setTimeout(() => {
            boxMessage.style.display = 'none';
        }, 3000);

    }

    insertFigure(position, figure, player) {

        position.textContent = figure;

        if ( player === 'user' ) {
            position.classList.add('user');
        } else {
            position.classList.add('ia');
        }

        position.classList.add('style');
    }
    
}

// Instancias
const ui = new UI();

// Funciones
function startGame(event) {

    event.preventDefault();

    if ( !validationFigures() ){
        return;
    }

    btnStart.remove();
    playerTurn = whoGoesFirst();

    if ( playerTurn === 'user' ) {
        ui.insertMessage("Comienza jugador 1");
    } else {
        ui.insertMessage("Comienza jugador 2");
    }

    board.forEach( cell => { cell.addEventListener('click', handlerClick) });

}

function validationFigures() {

    userFigure = prompt("Elige tu figura (X/O):");

    if ( userFigure === '' || userFigure === null || (userFigure != 'X' && userFigure != 'O' && userFigure != 'x' && userFigure != 'o') ) {
        alert('Solo puedes elegir "X" ó "O"');  
        return false;
    }  

    userFigure = userFigure.toUpperCase();
    iaFigure = userFigure === 'X' ? 'O' : 'X';

    return true;

}

function whoGoesFirst() {
    const players = ['user', 'ia'];
    const randomNumber = Math.floor(Math.random() * (2 - 0)) + 0;

    return players[randomNumber];
}

function handlerClick(event) {
    
    const selectedCell = event.target;
    const clickedCellIndex = parseInt( selectedCell.getAttribute('cell-index') );

    if( gameState[clickedCellIndex] !== '' ) {
        return;
    }

    if( playerTurn === 'user' ) {
        ui.insertFigure(selectedCell, userFigure, playerTurn);
        gameState[clickedCellIndex] = userFigure;
        playerTurn = 'ia';
    } else {
        ui.insertFigure(selectedCell, iaFigure, playerTurn);
        gameState[clickedCellIndex] = iaFigure;
        playerTurn = 'user';
    }

    checkGame();

}

function checkGame() {

    let winner = '';

    winningConditions.forEach( condition => {

        const [first, second, third] = condition;

        if( gameState[first] === 'X' && gameState[second] === 'X' && gameState[third] === 'X' ) {
            winner = 'X';
        } else if( gameState[first] === 'O' && gameState[second] === 'O' && gameState[third] === 'O' ) {
            winner = 'O';
        } 

    });

    if( winner !== '' ) {
        showWinner(winner);
        showButtonRestart();
    }

    if ( !gameState.includes('') ) {
        ui.insertMessage('Empate');
        showButtonRestart();
    }

}

function showButtonRestart() {
    setTimeout(() => { btnRestart.style.display = 'inline'; }, 3300);
}

function showWinner(winner) {
    board.forEach( cell => { cell.removeEventListener('click', handlerClick) }); 
    const winnerMessage = winner === userFigure ? 'Jugador 1 gana' : 'Jugador 2 gana';
    
    ui.insertMessage( winnerMessage );
}

function restartGame(event) {
    event.preventDefault();
    window.location.reload();
}
