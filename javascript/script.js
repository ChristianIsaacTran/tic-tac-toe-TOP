
/*IIFE to represent the Tic-Tac-Toe gameboard itself
We only need one gameboard, not multiple gameboards, so we 
use a module.
*/
const gameBoard = (function() {
    const board = []; //Board will be private to prevent direct modification
    const boardRow = 3;
    const boardCol = 3;

    const getBoard = () => board;

    //Create a default board setup. A normal tic-tac-toe is a 3 by 3 board
    const initBoard = () => {
        for(let i = 0; i < boardRow; i++){
            board[i] = []; //Add a row for each index
            for(let j = 0; j < boardCol; j++){
                board[i].push(""); //For each row, add an empty string to represent the columns
            }
        }
    };

    //Used to display the current board in the console
    const displayCurrentBoard = () => {
        for(let i = 0; i < board.length; i++){
            console.log(board[i]); //Print each row to display the board
        }
    };

    //The gameboard should allow the person to add a player token to the board by marking the chosen space
    //The gameboard should have the index, and the current player since the player object will have their token
    const markSpace = (row, column, playerToken) => {
        board[row][column] = playerToken;
    };
    

    return {getBoard, initBoard, markSpace, displayCurrentBoard};
})();


/*Since there is only 1 game, with 1 board, with 1 display, 
I guess the game runner that will control the game itself 
will also be an IIFE, because I only want one instance of it (I think...).
*/
const gameRunner = (function (playerName1 = "player 1", playerName2 = "player 2") {
    //This is actually playing the game, so in this case I am creating 2 players from the given names
    const player1 = { name: playerName1, token: "X"};
    const player2 = { name: playerName2, token: "O"};

    let currentPlayerTurn = player1; //By default make the start the game have player 1 go first

    const getCurrentPlayer = () => currentPlayerTurn;

    //Displays whose turn it is and renders the CURRENT board
    const displayTurnMessage = () => {
        console.log(`The current turn is: ${getCurrentPlayer().name}`);
        gameBoard.displayCurrentBoard();
    };

    

    //Swap the currentplayerTurn to the other player 
    const swapPlayerTurn = () => {
        if (currentPlayerTurn === player1){
            currentPlayerTurn = player2;
        }
        else{
            currentPlayerTurn = player1;
        }
    }

    //When a player plays a turn, they mark the board with their token, then switch turns, then re-render the board display to display player selection
    const playTurn = (row, column) => {
        gameBoard.markSpace(row, column, getCurrentPlayer().token);
        swapPlayerTurn();
        displayTurnMessage();
    };

    

    gameBoard.initBoard(); //Initialize new game board at the start of the game
    displayTurnMessage(); //Initial turn 0 display when the game first starts

    return {playTurn};

})();


/*IIFE displaycontroller to constrol the DOM elements/rendering
Same thing with the gameboard, we only really need one display
controller to manipulate our DOM so we can make this a module as
well.
*/
const displayControl = (function (){

})();


