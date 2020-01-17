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
const playerRef = database.ref("players");
const turnRef = database.ref("turn");

// global variables
var firstPlayer = null;
var secondPlayer = null;
var player1Choice = "";
var player2Choice = "";
var turnNumber = 1;

//
// database functions
//

// player one added
database.ref("/players/playerone").on("value", function(p1SnapShot) {
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
    choice: "",
  };
});

// player two added
database.ref("/players/playertwo").on("value", function(p2SnapShot) {
  $("#second-player").html(p2SnapShot.val().name);
  $("#player2wins").html(p2SnapShot.val().wins);
  $("#player2loses").html(p2SnapShot.val().loses);
  $("#player2ties").html(p2SnapShot.val().ties);
  secondPlayer = {
    name: p2SnapShot.val().name,
    loses: p2SnapShot.val().loses,
    ties: p2SnapShot.val().ties,
    wins: p2SnapShot.val().wins,
    choice: "",
  };
});

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
    };
    playerRef.child("/playerone/").set(firstPlayer);
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
    };
    playerRef.child("/playertwo/").set(secondPlayer);
  }
  $("#player-name").val("");
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
