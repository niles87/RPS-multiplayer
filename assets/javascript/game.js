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
const connectionsRef = database.ref("connections");
const connectedRef = database.ref(".info/connected");
const playerRef = database.ref("players");

// global variables
var firstPlayer = null;
var secondPlayer = null;
var turnNumber = 1;

//
// database functions
//

connectedRef.on("value", function(snap) {
  if (snap.val()) {
    var connections = connectionsRef.push(true);

    connections.onDisconnect().remove();
  }
});

// player one added
database.ref("/players/playerone").on(
  "value",
  function(p1SnapShot) {
    console.log(p1SnapShot.val());
    $("#first-player").html(p1SnapShot.val().name);
    $("#player1wins").html(p1SnapShot.val().wins);
    $("#player1loses").html(p1SnapShot.val().loses);
    $("#player1ties").html(p1SnapShot.val().ties);
    firstPlayer = {
      name: p1SnapShot.val().name,
      loses: p1SnapShot.val().loses,
      ties: p1SnapShot.val().ties,
      wins: p1SnapShot.val().wins,
      choice: p1SnapShot.val().choice,
    };
    console.log(firstPlayer);
    if (p1SnapShot.val() !== null) {
      var waitingP = `<p>Waiting for a second player</p>`;
      $("#results").append(waitingP);
    }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

// player two added
database.ref("/players/playertwo").on(
  "value",
  function(p2SnapShot) {
    $("#second-player").html(p2SnapShot.val().name);
    $("#player2wins").html(p2SnapShot.val().wins);
    $("#player2loses").html(p2SnapShot.val().loses);
    $("#player2ties").html(p2SnapShot.val().ties);
    secondPlayer = {
      name: p2SnapShot.val().name,
      loses: p2SnapShot.val().loses,
      ties: p2SnapShot.val().ties,
      wins: p2SnapShot.val().wins,
      choice: p2SnapShot.val().choice,
    };
    console.log(secondPlayer);
    if (p2SnapShot.val() !== null) {
      $("#results").empty();
      var waitingP = `<p>Waiting for player 1 to go</p>`;
      $("#results").append(waitingP);
    }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

// turn
turnRef.on("value", function(turnSnapShot) {
  turnNumber = turnSnapShot.val().turn;
  $(".turn").html("<h3>Turn: " + turnSnapShot.val().turn + "</h3>");
});

// chat area
chatRef.on("child_added", function(childSnapShot) {
  var chatValue = $("<p>" + `${childSnapShot.val().chatText}` + "</p>");
  $("#chat-arena").append(chatValue);
});

// adding player objects
$("#name").on("click", function(event) {
  event.preventDefault();
  if (
    firstPlayer === null &&
    $("#player-name")
      .val()
      .trim() !== ""
  ) {
    firstPlayer = {
      name: $("#player-name")
        .val()
        .trim(),
      loses: 0,
      ties: 0,
      wins: 0,
      choice: "",
    };
    playerRef.child("/playerone/").set(firstPlayer);
    $(".login").hide();
  } else if (
    firstPlayer.name !== null &&
    $("#player-name")
      .val()
      .trim() !== ""
  ) {
    secondPlayer = {
      name: $("#player-name")
        .val()
        .trim(),
      loses: 0,
      ties: 0,
      wins: 0,
      choice: "",
    };
    playerRef.child("/playertwo/").set(secondPlayer);
    $(".login").hide();
    turnRef.set({ turn: turnNumber });
  }
  $("#player-name").val("");
});

$(".play1").on("click", function() {
  if (turnNumber === 1) {
    firstPlayer.choice = $(this).attr("value");

    turnNumber = 2;
    turnRef.set({ turn: turnNumber });
    $("#results").empty();
    var waitingP = `<p>Waiting for ${secondPlayer.name} to go</p>`;
    $("#results").append(waitingP);
  }
});

$(".play2").on("click", function() {
  if (turnNumber === 2) {
    secondPlayer.choice = $(this).attr("value");

    compareChoices();
  }
});

// click event listener on chat button to add chat to database
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

function compareChoices() {
  if (firstPlayer.choice === "r" && secondPlayer.choice === "r") {
    $("#results").empty();
    var results = `<h2>It's a tie!</h2>`;
    $("#results").append(results);
    firstPlayer.ties += 1;
    secondPlayer.ties += 1;
    playerRef.child("playerone").set(firstPlayer);
    playerRef.child("playertwo").set(secondPlayer);
    turnNumber = 1;
    turnRef.set({ turn: turnNumber });
  } else if (firstPlayer.choice === "p" && secondPlayer.choice === "p") {
    $("#results").empty();
    var results = `<h2>It's a tie!</h2>`;
    $("#results").append(results);
    firstPlayer.ties += 1;
    secondPlayer.ties += 1;
    playerRef.child("playerone").set(firstPlayer);
    playerRef.child("playertwo").set(secondPlayer);
    turnNumber = 1;
    turnRef.set({ turn: turnNumber });
  } else if (firstPlayer.choice === "s" && secondPlayer.choice === "s") {
    $("#results").empty();
    var results = `<h2>It's a tie!</h2>`;
    $("#results").append(results);
    firstPlayer.ties += 1;
    secondPlayer.ties += 1;
    playerRef.child("playerone").set(firstPlayer);
    playerRef.child("playertwo").set(secondPlayer);
    turnNumber = 1;
    turnRef.set({ turn: turnNumber });
  } else if (firstPlayer.choice === "r" && secondPlayer.choice === "p") {
    $("#results").empty();
    var results = `<h2>${secondPlayer.name} won!</h2>`;
    $("#results").append(results);
    firstPlayer.loses += 1;
    secondPlayer.wins += 1;
    playerRef.child("playerone").set(firstPlayer);
    playerRef.child("playertwo").set(secondPlayer);
    turnNumber = 1;
    turnRef.set({ turn: turnNumber });
  } else if (firstPlayer.choice === "p" && secondPlayer.choice === "s") {
    $("#results").empty();
    var results = `<h2>${secondPlayer.name} won!</h2>`;
    $("#results").append(results);
    firstPlayer.loses += 1;
    secondPlayer.wins += 1;
    playerRef.child("playerone").set(firstPlayer);
    playerRef.child("playertwo").set(secondPlayer);
    turnNumber = 1;
    turnRef.set({ turn: turnNumber });
  } else if (firstPlayer.choice === "s" && secondPlayer.choice === "r") {
    $("#results").empty();
    var results = `<h2>${secondPlayer.name} won!</h2>`;
    $("#results").append(results);
    firstPlayer.loses += 1;
    secondPlayer.wins += 1;
    playerRef.child("playerone").set(firstPlayer);
    playerRef.child("playertwo").set(secondPlayer);
    turnNumber = 1;
    turnRef.set({ turn: turnNumber });
  } else if (firstPlayer.choice === "r" && secondPlayer.choice === "s") {
    $("#results").empty();
    var results = `<h2>${firstPlayer.name} won!</h2>`;
    $("#results").append(results);
    firstPlayer.wins += 1;
    secondPlayer.loses += 1;
    playerRef.child("playerone").set(firstPlayer);
    playerRef.child("playertwo").set(secondPlayer);
    turnNumber = 1;
    turnRef.set({ turn: turnNumber });
  } else if (firstPlayer.choice === "p" && secondPlayer.choice === "r") {
    $("#results").empty();
    var results = `<h2>${firstPlayer.name} won!</h2>`;
    $("#results").append(results);
    firstPlayer.wins += 1;
    secondPlayer.loses += 1;
    playerRef.child("playerone").set(firstPlayer);
    playerRef.child("playertwo").set(secondPlayer);
    turnNumber = 1;
    turnRef.set({ turn: turnNumber });
  } else if (firstPlayer.choice === "s" && secondPlayer.choice === "p") {
    $("#results").empty();
    var results = `<h2>${firstPlayer.name} won!</h2>`;
    $("#results").append(results);
    firstPlayer.wins += 1;
    secondPlayer.loses += 1;
    playerRef.child("playerone").set(firstPlayer);
    playerRef.child("playertwo").set(secondPlayer);
    turnNumber = 1;
    turnRef.set({ turn: turnNumber });
  }
}
