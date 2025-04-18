
/*IIFE to represent the Tic-Tac-Toe gameboard itself
We only need one gameboard, not multiple gameboards, so we 
use a module.
*/
const gameBoard = (function () {
    const board = []; //Board will be private to prevent direct modification
    const boardRow = 3;
    const boardCol = 3;

    const getBoard = () => board;

    //Create a default board setup. A normal tic-tac-toe is a 3 by 3 board
    const initBoard = () => {
        for (let i = 0; i < boardRow; i++) {
            board[i] = []; //Add a row for each index
            for (let j = 0; j < boardCol; j++) {
                board[i].push("-"); //For each row, add an empty string to represent the columns
            }
        }
    };

    //The gameboard should allow the person to add a player token to the board by marking the chosen space
    //The gameboard should have the index, and the current player since the player object will have their token
    const markSpace = (row, column, playerToken) => {
        board[row][column] = playerToken;
    };

    //Reset the board 
    const resetBoard = () => {
        for (let i = 0; i < boardRow; i++) {
            board.pop();
        }
        initBoard(); //Reinitializeboard
    };


    return { getBoard, initBoard, markSpace, resetBoard };
})();


/*Since there is only 1 game, with 1 board, with 1 display, 
I guess the game runner that will control the game itself 
will also be an IIFE, because I only want one instance of it (I think...).
*/
const gameRunner = (function () {
    //This is actually playing the game, so in this case I am creating 2 players from the given names
    const player1 = { name: "player 1", token: "X" };
    const player2 = { name: "player 2", token: "O" };

    const board = gameBoard.getBoard();

    let currentPlayerTurn = player1; //By default make the start the game have player 1 go first

    const getCurrentPlayer = () => currentPlayerTurn;

    const setPlayerName = (playerName1, playerName2) => {
        player1.name = playerName1;
        player2.name = playerName2;
    };

    //Swap the currentplayerTurn to the other player 
    const swapPlayerTurn = () => {
        if (currentPlayerTurn === player1) {
            currentPlayerTurn = player2;
        }
        else {
            currentPlayerTurn = player1;
        }
    };

    const resetAll = () => {
        player1.name = "player 1";
        player2.name = "player 2";
        gameBoard.resetBoard();
        currentPlayerTurn = player1;
    };

    //When a player plays a turn, they mark the board with their token, then switch turns, then re-render the board display to display player selection
    const playTurn = (row, column) => {
        if (!checkSpaceAvail(row, column)) { //If the space is unavailable, stop execution
            return alert("SPACE NOT AVAILABLE. PLEASE TRY AGAIN");
        }
        gameBoard.markSpace(row, column, getCurrentPlayer().token);
        if (checkWin(getCurrentPlayer().token)) { //Check if we have a winner and display message, also stop execution
            return "win";
        }
        if (checkTie(getCurrentPlayer.token)) { //Check if we have a tie, display message and stop execution.
            return "tie";
        }

        swapPlayerTurn();
    };

    //Check for if the space is available for marking or not 
    const checkSpaceAvail = (row, column) => {
        if (board[row][column] === "-") {
            return true; //If the space is empty, return true
        }
        else {
            return false; //If the space is occupied, return false
        }
    };

    //Check for a win condition
    const checkWin = (playerToken) => {

        //Check each row for a win
        for (let i = 0; i < board.length; i++) {
            if (board[i].every((currentVal) => currentVal === playerToken)) {
                return true;
            }
        }

        //Check each column for a win 
        const tempColArr = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                tempColArr.push(board[j][i]);
            }
            if (tempColArr.every((currentVal) => currentVal === playerToken)) {
                return true;
            }
            tempColArr.splice(0, 3);
        }

        //Check each diagonal for a win
        const tempTopDownArr = [];
        const tempBottomUpArr = [];
        let bottomUpCounter = 2;
        for (let i = 0; i < board.length; i++) {
            tempTopDownArr.push(board[i][i]);
            tempBottomUpArr.push(board[i][bottomUpCounter]);
            bottomUpCounter -= 1;
        }

        if (tempTopDownArr.every((currentVal) => currentVal === playerToken)) {
            return true;
        }

        if (tempBottomUpArr.every((currentVal) => currentVal === playerToken)) {
            return true;
        }

    };

    //Check if all the spaces are filled, that means it is a tie because our win condition above would've dictated if there was a winner or not already.
    const checkTie = () => {
        for (let i = 0; i < board.length; i++) {
            if (board[i].includes("-")) {
                return false;
            }
        }
        return true;
    }


    gameBoard.initBoard(); //Initialize new game board at the start of the game

    return { playTurn, getCurrentPlayer, setPlayerName, resetAll };

})();




/*IIFE displaycontroller to constrol the DOM elements/rendering
Same thing with the gameboard, we only really need one display
controller to manipulate our DOM so we can make this a module as
well.
*/
const displayControl = (function () {
    const gameBoardDiv = document.createElement("div");
    gameBoardDiv.setAttribute("class", "main-board");
    const body = document.querySelector("body");
    const board = gameBoard.getBoard();
    let gameNotStarted = true;
    const startDialog = document.querySelector(".start-dialog");
    const form = document.querySelector("form");
    const gameAnnouncer = document.querySelector(".game-announcer");

    //Reads the current display of the board and makes buttons on them, added it to the gameBoardDiv and added that to the body 
    const renderGameBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                const buttonContainer = document.createElement("div");
                const createButton = document.createElement("button");
                createButton.setAttribute("data-row", `${i}`); //Add data-attribute to pass to playTurn method in event handler
                createButton.setAttribute("data-column", `${j}`);
                buttonContainer.setAttribute("data-row", `${i}`); //Add data-attribute to button-container for styling purposes
                buttonContainer.setAttribute("data-column", `${j}`);
                createButton.setAttribute("class", "game-button");
                createButton.setAttribute("type", "button");
                createButton.textContent = board[i][j];
                createButton.addEventListener("click", gameButtonEventHandler);
                buttonContainer.setAttribute("class", "button-container")
                buttonContainer.appendChild(createButton);
                gameBoardDiv.appendChild(buttonContainer);
            }
        }

        body.appendChild(gameBoardDiv);
    };

    //Used to disable the buttons if the board render is the initial startup. This is so that the user HAS to press the start button to start the game.
    //Will only activate once per game
    const checkGameNotStarted = () => {
        const buttonList = document.querySelectorAll(".game-button");
        if (gameNotStarted) {
            for (button of buttonList) {
                button.setAttribute("disabled", "");
            }
        }
        else {
            for (button of buttonList) {
                button.removeAttribute("disabled");
            }
        }
    };

    //Add a destroy function to destroy the previous display
    const destroyCurrentDisplay = () => {
        const buttonList = document.querySelectorAll(".button-container");
        for (button of buttonList) {
            button.remove();
        }
    };  

    //Reset EVERYTHING and re-render after remaking game board.
    function resetButtonEventHandler() {
        gameRunner.resetAll();
        const start = document.querySelector(".start-button");
        start.removeAttribute("disabled");
        form.reset();
        gameAnnouncer.textContent = "Welcome to the game! Click start to get started.";
        destroyCurrentDisplay();
        renderGameBoard();
        gameNotStarted = true;
        checkGameNotStarted();
        this.remove();
    }

    //Create reset button when game is over
    const createResetButton = () => {
        const createReset = document.createElement("button");
        const messengerDiv = document.querySelector(".messenger");
        createReset.setAttribute("type", "button");
        createReset.textContent = "Reset";
        createReset.addEventListener("click", resetButtonEventHandler);
        messengerDiv.appendChild(createReset);
    };

    //Add an event listener handler function that uses the game logic that we programmed earlier
    /*
    1.play turn when button is clicked
    2.destroy the current board to display the new one
    3.re-render the visual board with the new values and display
    */
    function gameButtonEventHandler() {
        let turnResult = gameRunner.playTurn(this.getAttribute("data-row"), this.getAttribute("data-column"));
        if (turnResult === "win") { //Display Message of win and end the game
            createResetButton();
            gameAnnouncer.textContent = `WE HAVE A WINNER: ${gameRunner.getCurrentPlayer().name}`;
            destroyCurrentDisplay();
            renderGameBoard();
            gameNotStarted = true;
            checkGameNotStarted();
            return;
        }
        else if (turnResult === "tie") { //Display message of tie and end the game
            createResetButton();
            gameAnnouncer.textContent = `Too bad, It's a tie! No one wins.`;
            destroyCurrentDisplay();
            renderGameBoard();
            gameNotStarted = true;
            checkGameNotStarted();
            return;
        }
        gameAnnouncer.textContent = `The current turn is: ${gameRunner.getCurrentPlayer().name}`;
        destroyCurrentDisplay();
        renderGameBoard();
    }

    //When the start button is clicked, bring up the dialog window and have the player define 2 names. Then re-enable the buttons for play
    function startButtonEventHandler() {
        gameNotStarted = false;
        checkGameNotStarted() //to reactivate the buttons if the game HAS started
        startDialog.showModal();
        this.setAttribute("disabled", "");
    }

    const setStartButtonEvent = () => {
        const start = document.querySelector(".start-button");
        start.addEventListener("click", startButtonEventHandler);
    };

    //When cancel button is clicked, close modal
    const setCancelButtonEvent = () => {
        const cancel = document.querySelector(".cancel-button");
        const start = document.querySelector(".start-button");
        cancel.addEventListener("click", function () {
            start.removeAttribute("disabled");
            gameNotStarted = true;
            checkGameNotStarted(); //Turn all buttons back off
            form.reset();
            startDialog.close();
        });
    }

    //When submit button is clicked, preventDefault 
    function submitButtonEventHandler(event) {
        event.preventDefault();
        const formData = new FormData(form);
        if (formData.get("playerName1") === "" || formData.get("playerName2") === "") {
            return alert("Please fill out both player names.");
        }
        gameRunner.setPlayerName(formData.get("playerName1"), formData.get("playerName2"));
        gameAnnouncer.textContent = `The current turn is: ${gameRunner.getCurrentPlayer().name}`;
        startDialog.close();
    }

    const setSubmitButtonEvent = () => {
        const submit = document.querySelector(".submit-button");
        submit.addEventListener("click", submitButtonEventHandler);
    }


    //Initial render when game starts
    renderGameBoard();

    //Checks if the game has been "started". Upon game startup, the game is considered not started by default.
    checkGameNotStarted();

    //Set the option button events
    setStartButtonEvent();
    setSubmitButtonEvent();
    setCancelButtonEvent();

})();
