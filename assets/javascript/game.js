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
            selection: '',
        },
        2: {
            name: "Waiting for Player 2",
            wins: 0,
            losses: 0,
            selection: '',
        },
    }

    var turn = 0;

    var chat = {};

    var disconnected = false

    //Starts game:

    //On page load and anytime database is updated
    database.ref().on("value", function (snapshot) {
        //checks if both players are saved
        if (snapshot.child("players/2").exists() && snapshot.child("players/1").exists()) {
            players = snapshot.val().players;
            turn = snapshot.val().turn;
            $("#game-interface").show();
            $("#player-1-name").html(`<h4>${players[1].name}</h4>`)
            $("#player-2-name").html(`<h4>${players[2].name}</h4>`)
            $("#player-1-score").html(`<p>Wins: ${players[1].wins} Losses: ${players[1].losses}</p>`)
            $("#player-2-score").html(`<p>Wins: ${players[2].wins} Losses: ${players[2].losses}</p>`)
            console.log("both!")
            playGame();
        }

        //Checks if only player2 is saved
        else if (!snapshot.child("players/1").exists() && snapshot.child("players/2").exists()) {
            console.log("Player2 exists; player1 does not exist")
            if ($("#game-interface").attr('player2')) {
                $("#game-messages").append('<h4>Waiting on Player 1 to connnect</h4> <div class="progress"><div class="indeterminate"></div></div>')
            }
            //sets local object equal to firebase value
            players[2] = snapshot.val().players[2];
            $("#start-button").on("click", function (event) {
                $("#game-interface").attr('player1', 'one')
                event.preventDefault()
                players[1].name = $("#player-name").val();
                turn = 1;
                database.ref().set({
                    players: players,
                    turn: turn,
                    chat: chat,
                    disconnected: disconnected
                })
                $("#player-start").remove();
                $("#game-messages").append("Welcome " + players[1].name + "! You are Player 1")
            })
        }

        //checks if only player1 is saved
        else if (snapshot.child("players/1").exists()) {
            console.log(snapshot.val().players[1].name)
            console.log("player1 exists")
            if ($("#game-interface").attr('player1')) {
                console.log("player1 exists, waiting on 2")
                $("#game-messages").append('<h4>Waiting on Player 2 to connnect</h4>  <div class="progress"><div class="indeterminate"></div></div> ')
            }
            //sets local object equal to firebase value
            players[1] = snapshot.val().players[1];
            console.log(players)
            $("#player-name").remove();
            $("#start-button").remove();
            $("#player-start").prepend('<input type = "text" id = "player-name2" placeholder= "Name"><button class="btn waves-effect waves-light cyan lighten-2" type="submit" id="start-button2">Play!</button>')
            $("#player-1-name").html(`<h3>${players[1].name}</h3>`)

            //Saves to player2 
            $("#start-button2").on("click", function (event) {
                event.preventDefault()
                $("#game-interface").show();
                $("#game-interface").attr('player2', 'two')
                players[2].name = $("#player-name2").val();
                console.log(players)
                //Saves player 2 to firebase
                turn = 1;
                database.ref().set({
                    players: players,
                    turn: turn,
                    chat: chat,
                    disconnected: disconnected
                })
                $("#player-start").remove();
                $("#game-messages").append("Welcome " + players[2].name + "! You are Player 2")

            })

        }
        //If no players are saved in firebase
        else {
            console.log("player1 does not exist")
            $("#game-interface").hide()
            $("#start-button").on("click", function (event) {
                event.preventDefault()
                $("#game-interface").show();
                players[1].name = $("#player-name").val();
                database.ref().set({
                    players: { 1: players[1] },
                })
                $("#game-interface").attr('player1', 'one')
                $("#player-start").remove();
                $("#game-messages").append("Welcome " + players[1].name + "! You are Player 1")
                $("#game-messages").append('<h4>Waiting on Player 2 to connnect</h4>  <div class="progress"><div class="indeterminate"></div></div> ')
            })
        }

        //If a player disconnects
        if ($("#game-interface").attr('player1')) {
            //firebase.database().ref("players/2").onDisconnect().update({connected: false})
            var p1 = firebase.database().ref("players/1");
            p1.onDisconnect().remove();
            var c1 = firebase.database().ref("chat");
            c1.onDisconnect().remove();
            var d1 = firebase.database().ref("disconnected")
            d1.onDisconnect().set('true');
        }

        if ($("#game-interface").attr('player2')) {
            // firebase.database().ref("players/2").onDisconnect().update({connected: false})
            var p2 = firebase.database().ref("players/2");
            p2.onDisconnect().remove();
            var c1 = firebase.database().ref("chat");
            c1.onDisconnect().remove();
            var d1 = firebase.database().ref("disconnected")
            d1.onDisconnect().set('true');
        }

        //messages on disconnect
        if (snapshot.child('disconnected').exists()) {
            if (snapshot.val().disconnected == 'true') {
                if ($("#game-interface").attr("player1")) {
                    $("#message-display").append(`<p><span class="disconnect">${players[2].name} disconnected</span></p>`);
                }
                if ($("#game-interface").attr("player2")) {
                    $("#message-display").append(`<p><span class="disconnect">${players[1].name} disconnected</span></p>`);
                }
            }
        }

    });

    function playGame() {
        $("#game-messages").empty();

        //Player1 turn

        if (turn === 1) {
            console.log("player 1 turn")
            $("#game-messages").html("<h3>" + players[1].name + "'s turn!</h3>")
            //Only fire's on Player1's screen
            if ($("#game-interface").attr("player1")) {
                console.log("you are player1")
                $("#player-1-choices").html('<p class = "btn btn-large pulse choice1 cyan lighten-2">Rock</p> <p class = " btn btn-large pulse choice1 cyan lighten-2">Paper</p> <p class = "btn btn-large pulse choice1 cyan lighten-2">Scissors</p>')
                $(document).on("click", ".choice1", function () {
                    players[1].selection = $(this).text();
                    console.log(players[1].selection)
                    $("#player-1-choices").html(`<p class = "btn btn-large cyan lighten-2">${players[1].selection}</p>`)
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
            $("#game-messages").html("<h3>" + players[2].name + "'s turn!</h3>")
            console.log("player 2 turn")
            //Only fire's on Player2's screen
            if ($("#game-interface").attr("player2")) {
                $("#player-2-choices").html('<p class = "btn btn-large pulse choice2 cyan lighten-2">Rock</p> <p class = "btn btn-large pulse choice2 cyan lighten-2">Paper</p> <p class = "btn btn-large pulse choice2 cyan lighten-2">Scissors</p>')
                $(document).on("click", ".choice2", function () {
                    players[2].selection = $(this).text();
                    console.log(players[2].selection)
                    $("#player-2-choices").html(`<p class = "btn btn-large cyan lighten-2">${players[2].selection}</p>`)
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
                $("#game-messages").html('<h3>Tie Game!</h3>')
                $("#player-1-choices").html(`<p class = "btn btn-large cyan lighten-2">${players[1].selection}</p>`)
                $("#player-2-choices").html(`<p class = "btn btn-large cyan lighten-2">${players[2].selection}</p>`)
                setTimeout(nextRound, 4000);
            }
        }
    }

    function nextRound() {
        turn = 1
        database.ref().set({
            players: players,
            turn: turn
        })
    }

    function playerOneWins() {
        $("#game-messages").html(`<h3>${players[1].name} wins!`);
        $("#player-1-choices").html(`<p class = "btn btn-large cyan lighten-2">${players[1].selection}</p>`)
        $("#player-2-choices").html(`<p class = "btn btn-large cyan lighten-2">${players[2].selection}</p>`)
        players[1].wins++;
        players[2].losses++;
    }

    function playerTwoWins() {
        $("#game-messages").html(`<h3>${players[2].name} wins!`);
        $("#player-1-choices").html(`<p class = "btn btn-large cyan lighten-2">${players[1].selection}</p>`)
        $("#player-2-choices").html(`<p class = "btn btn-large cyan lighten-2">${players[2].selection}</p>`)
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


    // Updates chatbox .on("child_added"
    database.ref().child('chat').orderByChild("dateAdded").on("child_added", function (snapshot) {
        console.log(snapshot.val())
        $("#message-display").append(`<p><span class="user">${snapshot.val().user}:</span> ${snapshot.val().message}</p>`);
        $('#message-display').scrollTop($('#message-display')[0].scrollHeight)


        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


});



