// Your web app's Firebase configuration
var firebaseConfig = {
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
firebase.initializeApp(firebaseConfig);

// initial global variables
var player1 = "";
var player2 = "";
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
