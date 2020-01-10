import { config } from "./keys.js";
// Initialize Firebase
firebase.initializeApp(config);

// initial global variables
var player1;
var player2;
var playerOneWins = 0;
var playerOneLoses = 0;
var playerTwoWins = 0;
var playerTwoLoses = 0;
var chatArr = [];
var database = firebase.database();

database.ref().on(
  "value",
  function(data) {
    if (data.child("firstPlayerName").exists()) {
      player1 = data.val().firstPlayerName;
      console.log(player1);
      $("#first-player").text(player1);
    }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

$("#name").on("click", function(event) {
  event.preventDefault();
  var firstPlayer = $("#player-name")
    .val()
    .trim();
  console.log(firstPlayer);
  database.ref().set({
    firstPlayerName: firstPlayer,
  });

  $("#first-player").text(firstPlayer);
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
