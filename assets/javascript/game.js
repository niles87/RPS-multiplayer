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

//
// database functions
//

// players node on value change listener
playerRef.on("value", function(playerSnap) {
  // Checking for a first player
  if (playerSnap.child("playerone").exists()) {
    $("#first-player").html(playerSnap.child("playerone").val().name);
    $("#player1wins").html(playerSnap.child("playerone").val().wins);
    $("#player1loses").html(playerSnap.child("playerone").val().loses);
    $("#player1ties").html(playerSnap.child("playerone").val().ties);
    firstPlayer = {
      name: playerSnap.child("playerone").val().name,
      loses: playerSnap.child("playerone").val().loses,
      ties: playerSnap.child("playerone").val().ties,
      wins: playerSnap.child("playerone").val().wins,
      choice: playerSnap.child("playerone").val().choice,
    };
  } else {
    firstPlayer = null;
  }
  // checking for a second player
  if (playerSnap.child("playertwo").exists()) {
    $("#second-player").html(playerSnap.child("playertwo").val().name);
    $("#player2wins").html(playerSnap.child("playertwo").val().wins);
    $("#player2loses").html(playerSnap.child("playertwo").val().loses);
    $("#player2ties").html(playerSnap.child("playertwo").val().ties);
    secondPlayer = {
      name: playerSnap.child("playertwo").val().name,
      loses: playerSnap.child("playertwo").val().loses,
      ties: playerSnap.child("playertwo").val().ties,
      wins: playerSnap.child("playertwo").val().wins,
      choice: playerSnap.child("playertwo").val().choice,
    };
  } else {
    secondPlayer = null;
  }

  // When both players are used hide the set-name form
  if (playerSnap.child("playerone").exists() && playerSnap.child("playertwo").exists()) {
    $(".set-name").hide();
  }
});

// turn
turnRef.on("value", function(turnSnapShot) {
  if (firstPlayer && secondPlayer) {
    turnNumber = turnSnapShot.val().turn;
    $(".turn").html("<h3>Turn: " + turnNumber + "</h3>");
  }
});

// chat area
chatRef.on("child_added", function(childSnapShot) {
  var chatValue = $("<p>" + `${childSnapShot.val().chatText}` + "</p>");
  $("#chat-arena").append(chatValue);
});

// results
resultsRef.on("value", function(resultSnap) {
  if (firstPlayer && secondPlayer) {
    $("#results").empty();
    $("#results").html(resultSnap.val().result);
  } else if (!firstPlayer && secondPlayer) {
    $("#results").empty();
    $("#results").html(resultSnap.val().result);
  } else if (firstPlayer && !secondPlayer) {
    $("#results").empty();
    $("#results").html(resultSnap.val().result);
  }
});

// child removed
playerRef.on("child_removed", function() {
  resultsRef.remove();
  turnRef.remove();
  chatRef.remove();
  $(".set-name").show();
});
// adding player objects
$("#name").on("click", function(event) {
  event.preventDefault();

  // adding first player
  if (
    firstPlayer === null &&
    $("#player-name")
      .val()
      .trim() !== ""
  ) {
    yourPlayerName = $("#player-name")
      .val()
      .trim();
    firstPlayer = {
      name: yourPlayerName,
      loses: 0,
      ties: 0,
      wins: 0,
      choice: "",
    };
    playerRef.child("/playerone").set(firstPlayer);
    $(".set-name").hide();
    if (secondPlayer === null) {
      var firstPlayerSet = `<p>Waiting for a second player</p>`;
      resultsRef.set({ result: firstPlayerSet });
    }
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
    yourPlayerName = $("#player-name")
      .val()
      .trim();
    var secondPlayer = {
      name: yourPlayerName,
      loses: 0,
      ties: 0,
      wins: 0,
      choice: "",
    };
    playerRef.child("/playertwo").set(secondPlayer);
    $(".set-name").hide();
    turnRef.set({ turn: 1 });
    var secondPlayerAdded = `<p>${firstPlayer.name}'s turn</p>`;
    resultsRef.set({ result: secondPlayerAdded });
    playerRef
      .child("/playertwo")
      .onDisconnect()
      .remove();
  }
  $("#player-name").val("");
});

// button click event for first player
$(".play1").on("click", function() {
  if (turnNumber === 1 && firstPlayer && secondPlayer && yourPlayerName === firstPlayer.name) {
    firstPlayer.choice = $(this).attr("value");
    playerRef.child("playerone").set(firstPlayer);
    turnRef.set({ turn: 2 });

    var waitingP = `<p>Waiting for ${secondPlayer.name} to go</p>`;
    resultsRef.set({ result: waitingP });
  }
});

// click event for second player
$(".play2").on("click", function() {
  if (turnNumber === 2 && firstPlayer && secondPlayer && yourPlayerName === secondPlayer.name) {
    secondPlayer.choice = $(this).attr("value");
    playerRef.child("playertwo").set(secondPlayer);
    compareChoices();
  }
});

// click event to add chat to database
$("#chat").on("click", function(event) {
  event.preventDefault();
  var chat = $("#chatbox")
    .val()
    .trim();

  chatRef.push({
    chatText: chat,
  });

  $("#chatbox").val("");
});

// functions for game results
function ifPlayersTie() {
  firstPlayer.ties += 1;
  playerRef.child("playerone").set(firstPlayer);
  secondPlayer.ties += 1;
  playerRef.child("playertwo").set(secondPlayer);
  var results = `<h2>It's a tie!</h2>`;
  resultsRef.set({ result: results });
}
function ifPlayerOneWins() {
  firstPlayer.wins += 1;
  playerRef.child("playerone").set(firstPlayer);
  secondPlayer.loses += 1;
  playerRef.child("playertwo").set(secondPlayer);
  var results = `<h2>${firstPlayer.name} won!</h2>`;
  resultsRef.set({ result: results });
}
function ifPlayerTwoWins() {
  firstPlayer.loses += 1;
  playerRef.child("playerone").set(firstPlayer);
  secondPlayer.wins += 1;
  playerRef.child("playertwo").set(secondPlayer);
  var results = `<h2>${secondPlayer.name} won!</h2>`;
  resultsRef.set({ result: results });
}

// main game logic
function compareChoices() {
  if (firstPlayer.choice === "r" && secondPlayer.choice === "r") {
    ifPlayersTie();
  } else if (firstPlayer.choice === "p" && secondPlayer.choice === "p") {
    ifPlayersTie();
  } else if (firstPlayer.choice === "s" && secondPlayer.choice === "s") {
    ifPlayersTie();
  } else if (firstPlayer.choice === "r" && secondPlayer.choice === "p") {
    ifPlayerTwoWins();
  } else if (firstPlayer.choice === "p" && secondPlayer.choice === "s") {
    ifPlayerTwoWins();
  } else if (firstPlayer.choice === "s" && secondPlayer.choice === "r") {
    ifPlayerTwoWins();
  } else if (firstPlayer.choice === "r" && secondPlayer.choice === "s") {
    ifPlayerOneWins();
  } else if (firstPlayer.choice === "p" && secondPlayer.choice === "r") {
    ifPlayerOneWins();
  } else if (firstPlayer.choice === "s" && secondPlayer.choice === "p") {
    ifPlayerOneWins();
  }
  turnRef.set({ turn: 1 });
}
