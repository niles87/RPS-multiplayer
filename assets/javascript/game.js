import { config } from "./keys.js";
// Initialize Firebase
firebase.initializeApp(config);

// initial global variables
var isTherePlayer1 = false;
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
      $(".login").hide();
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
      $(".login").hide();
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
    $(".login").hide();
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
    $(".login").hide();
    $("#choices").empty();
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
