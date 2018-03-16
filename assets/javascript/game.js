$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDUYB3ANeZZMigkte6Ejy3czp7PZ_-9KqM",
        authDomain: "rps-multiplayer-25ff5.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-25ff5.firebaseio.com",
        projectId: "rps-multiplayer-25ff5",
        storageBucket: "",
        messagingSenderId: "63570648137"
    };
    firebase.initializeApp(config);

    //Saves firebase database to variable database
    var database = firebase.database();

    var players = {
        1: {
            name: "Waiting for Player 1",
            wins: 0,
            losses: 0,
            selection: ''
        },
        2: {
            name: "Waiting for Player 2",
            wins: 0,
            losses: 0,
            selection: ''
        },
    }

    var turn = 0;

    var chat = {};

    //Starts game:

    //On page load and anytime database is updated
    database.ref().on("value", function (snapshot) {
        //checks if both players are saved
        if (snapshot.child("players").exists()) {
            players[1] = snapshot.val().players[1];
            if (snapshot.val().players[2].name !== "Waiting for Player 2") {
                players = snapshot.val().players;
                turn = snapshot.val().turn;
                $("#player-1-name").html(`<h3>${players[1].name}</h3>`)
                $("#player-2-name").html(`<h3>${players[2].name}</h3>`)
                $("#player-1-score").html(`<h3>Wins: ${players[1].wins} Losses: ${players[1].losses}</h3>`)
                $("#player-2-score").html(`<h3>Wins: ${players[2].wins} Losses: ${players[2].losses}</h3>`)
                console.log("both!")
                playGame();
            }

            //checks if only player1 is saved
            else if (snapshot.child("players/1").exists()) {
                console.log(snapshot.val().players[1].name)
                console.log("player1 exists")
                //sets local object equal to firebase value
                players[1] = snapshot.val().players[1];
                console.log(players)
                $("#player-name").remove();
                $("#start-button").remove();
                $("#player-start").prepend('<input type = "text" id = "player-name2" placeholder= "Name"><input type="submit" value="Play!" id= "start-button2">')
                $("#player-1-name").html(`<h3>${players[1].name}</h3>`)

                //Saves to player2 
                $("#start-button2").on("click", function (event) {
                    event.preventDefault()
                    players[2].name = $("#player-name2").val();
                    console.log(players)
                    //Saves player 2 to firebase
                    turn = 1;
                    database.ref().set({
                        players: players,
                        turn: turn,
                        chat: chat
                    })
                    $("#game-interface").attr('player2', 'two')
                    $("#player-start").remove();
                    $("#game-messages").append("Welcome " + players[2].name + "! You are Player 2")

                })
            }
        }

        //If no players are saved in firebase
        else {
            console.log("player1 does not exist")
            $("#start-button").on("click", function (event) {
                event.preventDefault()
                players[1].name = $("#player-name").val();
                database.ref().set({
                    players: players
                })
                $("#game-interface").attr('player1', 'one')
                $("#player-start").remove();
                $("#game-messages").append("Welcome " + players[1].name + "! You are Player 1")
            })
        }



    });

    function playGame() {
        console.log('r p s!')
        $("#game-messages").empty();

        //Player1 turn

        if (turn === 1) {
            console.log("player 1 turn")
            $("#player-2-choices").empty();
            $("#game-messages").html('<h3>Waiting on Player 1</h3>')
            //Only fire's on Player1's screen
            if ($("#game-interface").attr("player1")) {
                $("#player-1-choices").html('<h3 class = "choice1">Rock</h3> <h3 class = "choice1">Paper</h3> <h3 class = "choice1">Scissors</h3>')
                $(document).on("click", ".choice1", function () {
                    players[1].selection = $(this).text();
                    console.log(players[1].selection)
                    turn = 2
                    console.log(turn)
                    database.ref().set({
                        players: players,
                        turn: turn,
                        chat: chat
                    })

                })
            }
        }

        //Player 2 turn
        if (turn === 2) {
            $("#player-1-choices").empty();
            $("#game-messages").html('<h3>Waiting on Player 2</h3>')
            console.log("player 2 turn")
            //Only fire's on Player2's screen
            if ($("#game-interface").attr("player2")) {
                $("#player-2-choices").html('<h3 class = "choice2">Rock</h3> <h3 class = "choice2">Paper</h3> <h3 class = "choice2">Scissors</h3>')
                $(document).on("click", ".choice2", function () {
                    players[2].selection = $(this).text();
                    console.log(players[2].selection)
                    turn = 3
                    database.ref().set({
                        players: players,
                        turn: turn,
                        chat: chat
                    })
                })
            }
        }


        //Conditions that decide who wins (only after both players have selected a choice)!
        if (turn === 3) {
            if (players[1].selection === "Rock" && players[2].selection === "Scissors") {
                console.log("player1 wins")
                playerOneWins();
                setTimeout(nextRound, 4000);

            }
            if (players[1].selection === "Paper" && players[2].selection === "Rock") {
                console.log("player1 wins")
                playerOneWins();
                setTimeout(nextRound, 4000);
            }
            if (players[1].selection === "Scissors" && players[2].selection === "Paper") {
                console.log("player1 wins")
                playerOneWins();
                setTimeout(nextRound, 4000);
            }
            if (players[1].selection === "Rock" && players[2].selection === "Paper") {
                console.log("player2 wins")
                playerTwoWins();
                setTimeout(nextRound, 4000);
            }
            if (players[1].selection === "Paper" && players[2].selection === "Scissors") {
                console.log("player2 wins")
                playerTwoWins();
                setTimeout(nextRound, 4000);
            }
            if (players[1].selection === "Scissors" && players[2].selection === "Rock") {
                console.log("player2 wins")
                playerTwoWins();
                setTimeout(nextRound, 4000);
            }
            if (players[1].selection === players[2].selection) {
                console.log("TIED!")
                $("#fill").html('<h3>Tie Game!</h3>')
                setTimeout(nextRound, 4000);
            }
        }
    }

    function nextRound() {
        $("#fill").empty();
        turn = 1
        database.ref().set({
            players: players,
            turn: turn
        })
    }

    function playerOneWins() {
        $("#fill").html(`<h3>${players[1].name} wins!`);
        players[1].wins++;
        players[2].losses++;
    }

    function playerTwoWins() {
        $("#fill").html(`<h3>${players[2].name} wins!`);
        players[2].wins++;
        players[1].losses++;
    }

    //Chat Box
    function enableChat() {
        var message = "";
        $("#send-button").on("click", function (event) {
            event.preventDefault()
            console.log('chatted')
            if ($("#game-interface").attr('player1')) {
                message = $("#message-type").val();
                database.ref().child('chat').push({
                    user: players[1].name,
                    message: message
                });
            }
            if ($("#game-interface").attr('player2')) {

                console.log('chatted')
                message = $("#message-type").val();
                database.ref().child('chat').push({
                    user: players[2].name,
                    message: message
                });
            }
            $("#message-type").val('');
        });
    }

    enableChat();

    //if player2 sends message

    // Updates chatbox .on("child_added"
    database.ref().child('chat').orderByChild("dateAdded").on("child_added", function (snapshot) {

        $("#message-display").append(`<p><span class="user">${snapshot.val().user}:</span> ${snapshot.val().message}</p>`);


        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});

