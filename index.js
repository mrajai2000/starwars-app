//read input
//make API request with input
//parse received output from server into presentable string
//present output to user
//return to read input
const { io } = require("socket.io-client");
const socket = io('http://localhost:3000');


//thought about input cleansing but that should probably be handled by the server 
//anyway...client code isn't reliable for security
socket.on("connect", () => {
  console.log("Connected!");
  //console.log(socket.id);
  poseQuestion();
});

socket.on("disconnect", () => {
  console.log("Disconnected!");
  //console.log(socket.id);
  readline.close();
});

socket.on("connect_error", (err) => {
  console.log(`Something has gone wrong connecting to the server - connect_error due to ${err.message}`);
  console.log("Please try again later.");
  process.exit();
});

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

function poseQuestion() {
  readline.question(`What character would you like to search for?`, chara => {
    console.log(`Searching for ${chara}...`);
    socket.emit("search", { query: chara });
  })
}

socket.on("search", (message) => {

  if (message.resultCount == -1) {
    console.log("ERR: No valid matches found.");
    poseQuestion();
  }
  else {
    console.log("(" + message.page + "/" + message.resultCount + ") " + message.name + " - " + "[" + message.films + "]");

    if (message.page == message.resultCount) {
      poseQuestion();
    }
  }
}
)