// Firebase config
var config = {
  apiKey: "AIzaSyDB75Vy1rhvgCXROeXxbWEAZPQtvWEmyzg",
  authDomain: "rockpaperscissorsduel.firebaseapp.com",
  databaseURL: "https://rockpaperscissorsduel.firebaseio.com",
  projectId: "rockpaperscissorsduel",
  storageBucket: "rockpaperscissorsduel.appspot.com",
  messagingSenderId: "114611548615",
  appId: "1:114611548615:web:7ed324223b2e21faa729e2",
  measurementId: "G-43T9VGQG7N",
};
// Initialize Firebase
firebase.initializeApp(config);

// firebase database reference
const database = firebase.database();
const chatRef = database.ref("chat");
const turnRef = database.ref("turn");
const playerRef = database.ref("players");
const resultsRef = database.ref("results");

// // global variables
var firstPlayer = null;
var secondPlayer = null;
var turnNumber;

var yourPlayerName;

/*
//
// database functions
//
*/

// players node on value change listener
playerRef.on("value", function(playerSnap) {
  // Checking for a player one then saving their values
  if (playerSnap.child("playerone").exists()) {
    firstPlayer = {
      name: playerSnap.child("playerone").val().name,
      losses: playerSnap.child("playerone").val().losses,
      ties: playerSnap.child("playerone").val().ties,
      wins: playerSnap.child("playerone").val().wins,
      choice: playerSnap.child("playerone").val().choice,
    };
    // update player 1s area
    $("#first-player").html(playerSnap.child("playerone").val().name);
    $("#player1wins").html(playerSnap.child("playerone").val().wins);
    $("#player1losses").html(playerSnap.child("playerone").val().losses);
    $("#player1ties").html(playerSnap.child("playerone").val().ties);
  } else {
    firstPlayer = null;
  }
  // checking for a second player then saving their values
  if (playerSnap.child("playertwo").exists()) {
    secondPlayer = {
      name: playerSnap.child("playertwo").val().name,
      losses: playerSnap.child("playertwo").val().losses,
      ties: playerSnap.child("playertwo").val().ties,
      wins: playerSnap.child("playertwo").val().wins,
      choice: playerSnap.child("playertwo").val().choice,
    };
    // update player 2s area
    $("#second-player").html(playerSnap.child("playertwo").val().name);
    $("#player2wins").html(playerSnap.child("playertwo").val().wins);
    $("#player2losses").html(playerSnap.child("playertwo").val().losses);
    $("#player2ties").html(playerSnap.child("playertwo").val().ties);
  } else {
    secondPlayer = null;
  }
  // When both players exist hide the set-name form
  if (playerSnap.child("playerone").exists() && playerSnap.child("playertwo").exists()) {
    $(".set-name").hide();
  }
  // if there is no player two
  else if (
    playerSnap.child("playerone").exists() &&
    !playerSnap.child("playertwo").exists() &&
    yourPlayerName
  ) {
    $("#results").html(`<h2>Waiting for a second player</h2>`);
  }
  // if there is no player one
  else if (
    playerSnap.child("playertwo").exists() &&
    !playerSnap.child("playerone").exists() &&
    yourPlayerName
  ) {
    $("#results").html(`<h2>Waiting for a second player</h2>`);
  }
});

// on a single users browser refresh or closed
playerRef.on("child_removed", function(removedSnap) {
  childRemoved();
  var disconnected = $(
    "<p id='disconnect'>" + `${removedSnap.val().name}` + " has left the game.</p>"
  );
  $("#chat-arena").prepend(disconnected);
});

// turn database value listener
turnRef.on("value", function(turnSnapShot) {
  if (turnSnapShot.val()) {
    turnNumber = turnSnapShot.val().turn;
    var turn = `<h3>Turn: ${turnNumber}</h3>`;
    $("#turn").html(turn);
  }
});

// when a child is added to the chat node
chatRef.on("child_added", function(childSnapShot) {
  var chatValue = $(
    "<p><span id='" +
      `${childSnapShot.val().userNumber}` +
      "'>" +
      `${childSnapShot.val().user}` +
      "</span>: " +
      `${childSnapShot.val().chatText}` +
      "</p>"
  );
  $("#chat-arena").prepend(chatValue);
});

// when a result is added to the results node
resultsRef.on("value", function(resultSnap) {
  if (resultSnap.val()) {
    if (firstPlayer && secondPlayer) {
      $("#results").empty();
      $("#results").html(resultSnap.val().result);
    }
  }
});

/**
 *
 * Button event functions
 *
 */

// form submit events to add players to database
$("#name").on("click", function(event) {
  event.preventDefault();

  // adding first player
  if (
    firstPlayer === null &&
    $("#player-name")
      .val()
      .trim() !== ""
  ) {
    // sets the first players name in browser
    yourPlayerName = $("#player-name")
      .val()
      .trim();
    // creates the player object
    firstPlayer = {
      name: yourPlayerName,
      losses: 0,
      ties: 0,
      wins: 0,
      choice: "",
    };
    // saves firstPlayer to the playerone node
    playerRef.child("/playerone").set(firstPlayer);
    $(".set-name").hide();
    // saves the turn number to the database, need this line of code for a player one disconnect
    turnRef.set({ turn: 1 });

    // on player disconnect removes playerone node
    playerRef
      .child("/playerone")
      .onDisconnect()
      .remove();
  }

  // adding second player
  else if (
    firstPlayer.name !== null &&
    $("#player-name")
      .val()
      .trim() !== ""
  ) {
    // sets second players name in their browser
    yourPlayerName = $("#player-name")
      .val()
      .trim();
    // creates secondPlayer object
    secondPlayer = {
      name: yourPlayerName,
      losses: 0,
      ties: 0,
      wins: 0,
      choice: "",
    };
    // saves secondplayer to the playertwo node
    playerRef.child("/playertwo").set(secondPlayer);
    $(".set-name").hide();
    turnRef.set({ turn: 1 });
    var secondPlayerAdded = `<h2>${firstPlayer.name}'s turn.</h2>`;
    resultsRef.set({ result: secondPlayerAdded });

    // on secondplayer disconnect removes the playertwo node
    playerRef
      .child("/playertwo")
      .onDisconnect()
      .remove();
  }
  // after user submit clears input box
  $("#player-name").val("");
});

// click event for first player
$(".play1").on("click", function() {
  if (turnNumber === 1 && firstPlayer && secondPlayer && yourPlayerName === firstPlayer.name) {
    firstPlayer.choice = $(this).attr("value");
    // saves firstplayers choice into the database
    playerRef.child("playerone").set(firstPlayer);
    turnRef.set({ turn: 2 });

    var waitingP = `<h2>Waiting for ${secondPlayer.name} to choose.</h2>`;
    resultsRef.set({ result: waitingP });
  }
});

// click event for second player
$(".play2").on("click", function() {
  if (turnNumber === 2 && firstPlayer && secondPlayer && yourPlayerName === secondPlayer.name) {
    secondPlayer.choice = $(this).attr("value");
    // saves secondPlayers choice to the database
    playerRef.child("playertwo").set(secondPlayer);
    compareChoices();
  }
});

// click event to add chat to database
$("#chat").on("click", function(event) {
  event.preventDefault();

  if (yourPlayerName === firstPlayer.name) {
    var chat = $("#chatbox")
      .val()
      .trim();

    chatRef.push({
      user: yourPlayerName,
      chatText: chat,
      userNumber: "user1",
    });
  } else if (yourPlayerName === secondPlayer.name) {
    var chat = $("#chatbox")
      .val()
      .trim();

    chatRef.push({
      user: yourPlayerName,
      chatText: chat,
      userNumber: "user2",
    });
  }

  // after user submit, clears the input box for next message
  $("#chatbox").val("");
});

/*
 * Functions for when game is ready to play
 */

// functions for game logic
function resultsWinLoseHandler(winner, loser) {
  winner.wins += 1;
  loser.losses += 1;
  if (winner === firstPlayer) {
    var results = `<h2>${winner.name} won!</h2>`;
    playerRef.child("playerone").set(winner);
    resultsRef.set({ result: results });
    playerRef.child("playertwo").set(loser);
  } else if (winner === secondPlayer) {
    var results = `<h2>${winner.name} won!</h2>`;
    playerRef.child("playerone").set(loser);
    resultsRef.set({ result: results });
    playerRef.child("playertwo").set(winner);
  }
}

function resultsTieHandler() {
  firstPlayer.ties += 1;
  playerRef.child("playerone").set(firstPlayer);
  secondPlayer.ties += 1;
  playerRef.child("playertwo").set(secondPlayer);
  var results = `<h2>It's a tie!</h2>`;
  resultsRef.set({ result: results });
}

// main game logic
function compareChoices() {
  if (firstPlayer.choice === "r" && secondPlayer.choice === "r") {
    resultsTieHandler();
  } else if (firstPlayer.choice === "p" && secondPlayer.choice === "p") {
    resultsTieHandler();
  } else if (firstPlayer.choice === "s" && secondPlayer.choice === "s") {
    resultsTieHandler();
  } else if (firstPlayer.choice === "r" && secondPlayer.choice === "p") {
    resultsWinLoseHandler(secondPlayer, firstPlayer);
  } else if (firstPlayer.choice === "p" && secondPlayer.choice === "s") {
    resultsWinLoseHandler(secondPlayer, firstPlayer);
  } else if (firstPlayer.choice === "s" && secondPlayer.choice === "r") {
    resultsWinLoseHandler(secondPlayer, firstPlayer);
  } else if (firstPlayer.choice === "r" && secondPlayer.choice === "s") {
    resultsWinLoseHandler(firstPlayer, secondPlayer);
  } else if (firstPlayer.choice === "p" && secondPlayer.choice === "r") {
    resultsWinLoseHandler(firstPlayer, secondPlayer);
  } else if (firstPlayer.choice === "s" && secondPlayer.choice === "p") {
    resultsWinLoseHandler(firstPlayer, secondPlayer);
  }

  // after choices compared sets turn to one to start game action over
  turnRef.set({ turn: 1 });
}

/* added this function to get proper results when a player disconnects,
 * needed to space out the node removals so they would actually occur */
function childRemoved() {
  database.ref("/results").remove();
  $("#turn").empty();
  database.ref("/turn").remove();
  $("#results").empty();
  database.ref("/chat").remove();
  if (!secondPlayer) {
    $(".set-name").hide();
  } else if (!firstPlayer) {
    $(".set-name").hide();
  }
}
