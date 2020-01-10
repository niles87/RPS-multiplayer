import { config } from "./keys.js";
// Initialize Firebase
firebase.initializeApp(config);

// initial global variables
var isTherePlayer1 = false;
var didPlayerOnePick = false;
var didPlayerTwoPick = false;
var player1;
var player2;
var playerOneWins = 0;
var playerOneLoses = 0;
var playerTwoWins = 0;
var playerTwoLoses = 0;
var chatArr = [];
var database = firebase.database();

database.ref("playerone").on(
  "value",
  function(data) {
    console.log("on value change for playerone is working");
    if (data.child("firstPlayerName").exists()) {
      player1 = data.val().firstPlayerName;
      console.log("--below is player one--");
      console.log(player1);
      $("#first-player").text(player1);
      isTherePlayer1 = true;
    }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);
database.ref("playertwo").on(
  "value",
  function(data) {
    if (data.child("secondPlayerName").exists()) {
      player2 = data.val().secondPlayerName;
      console.log("--below is player two--");
      console.log(player2);
      $("#second-player").text(player2);
      $("#name-input").hide();
    }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

$("#name").on("click", function(event) {
  event.preventDefault();
  if (isTherePlayer1 === false) {
    isTherePlayer1 = true;
    var firstPlayer = $("#player-name")
      .val()
      .trim();
    console.log(firstPlayer);
    database.ref("playerone").set({
      firstPlayerName: firstPlayer,
    });

    $("#first-player").text(firstPlayer);
    $("#name-input").hide();
    var waitingFor = $("<p>Waiting for another player</p>");
    $("#choices").append(waitingFor);
  } else {
    var secondPlayer = $("#player-name")
      .val()
      .trim();
    console.log(secondPlayer);
    database.ref("playertwo").set({
      secondPlayerName: secondPlayer,
    });
    $("#second-player").text(secondPlayer);
    $("#name-input").hide();
    $("#choices").empty();
    startGame();
  }
  $("#player-name").val("");
});

$("#chat").on("click", function(event) {
  event.preventDefault();
  var chat = $("#chatbox")
    .val()
    .trim();
  chatArr.push(chat);
  console.log(chatArr);
  var chatValue = $("<p>" + `${chat}` + "</p>");
  $("#chat-arena").append(chatValue);
  $("#chatbox").val("");
});

function startGame() {
  var choices = `
  <p id="rock">ROCK</p>
  <p id="paper">PAPER</p>
  <p id="scissors">SCISSORS</p>
  `;
  $("#choices").append(choices);
}

function checkIfPlayerPickedAnElement() {
  if (!didPlayerOnePick) {
    var status = `<p class="status">Waiting for player 1</p>`;
    $(".login").append(status);
  } else if (!didPlayerTwoPick) {
    status = `<p class="status">Waiting for player 2</p>`;
    $(".login").append(status);
  }
}
