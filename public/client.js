/* CLIENT SIDE WEBSOCKET */
let clientId;

const choices = ['🎁', '🪳']
let emojiChoice = 0
const jennStateContainer = document.querySelector('#jenn-state')

// lets create the websocket
// IMPORTANT: you need to update this if you remix the project
const socket = new WebSocket("wss://presents-or-bugs.glitch.me");

// socket opens
socket.onopen = (event) => {
  console.log("connected to websocket");
};

// message from server received
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // if clientId sent, set that so we ignore its state
  if (data.clientId) {
    clientId = data.clientId;
  }
  
  if (data.jennmoji) {
    jennStateContainer.innerHTML = data.jennmoji
  }

  // if clientStates sent, traverse and show them on screen
  if (data.clientStates) {
    showClientStates(data.clientStates);
  }
};

// render clientState data into fun cursors on screen
const showClientStates = (clients) => {
  
  document.querySelectorAll('span').forEach(span => span.remove())
  
  for (let id in clients) {
    // ignore our state in this object
    if (clientId !== id) {
      // create span node and set the position
      const cursor = document.createElement("span");
      cursor.innerHTML = choices[clients[id].emojiChoice];
      document.body.appendChild(cursor);
      cursor.style.position = "absolute";
      cursor.style.left = `${clients[id].x}px`;
      cursor.style.top = `${clients[id].y}px`;
      // should add id so we can first check if that node exists and then set it's position. currently, we're just drawing
    }
  }
};

// send event on mouse/touch move
const sendEventOnMove = (e) => {
  socket.send(JSON.stringify({ x: e.pageX, y: e.pageY, emojiChoice }));
}

// on click, change cursor
window.addEventListener("click", (e) => {
  emojiChoice = emojiChoice ? 0 : 1
  sendEventOnMove(e)
})

// on mouse/touch moves, send cursor state to server
window.addEventListener("mousemove", sendEventOnMove);
window.addEventListener("touchmove", sendEventOnMove);
