const path = require("path");

// set up initial count and id tracker
let clientIdTracker = 0;

// we'll keep track of all the clients' states
let clientStates = {};

// jenn's emotional state options
const choices = {
  happy: '😚',
  distressed: '😫'
}
let jennmoji = choices.happy

// keep track of *my* emotions
// - my emoji, based on the ratio of presents to roaches
// broadcast that to all clients 

// set up fastify app
const fastify = require("fastify")();
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// set up websocket server
function handle(conn, req) {
  conn.pipe(conn);
}
fastify.register(require("@fastify/websocket"), {
  handle,
  options: { maxPayload: 1048576 },
});

// helper function to broadcast a message to all clients
const broadcastToAllClients = (message) => {
  fastify.websocketServer.clients.forEach(function each(client) {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};

// we want to handle http requests too
fastify.register(async function () {
  fastify.route({
    method: "GET",
    url: "/",
    handler: (req, reply) => {
      // send index with the emoji and socket count
      reply.view("/views/index.html");
    },
    wsHandler: (conn, req) => {
      // connection has been opened
      // set unique id and add to client states
      const clientId = clientIdTracker;
      clientIdTracker++;
      clientStates[clientId] = {
        x: 0,
        y: 0,
        emojiChoice: 0
      };

      // when client sends state, save and broadcast to everyone
      conn.socket.on("message", (message) => {
        const state = JSON.parse(message);

        if ("x" in state && "y" in state && "emojiChoice" in state) {
          clientStates[clientId] = state
          
          // goal: set jennmoji
          // add the sum of all emojiChoice
          // divide it by the total count of clients 
          // if the ratio is > 50%, send distressed, else happy
          const objectSize = Object.keys(clientStates).length
          let emojiStateSum = 0
          for (let id in clientStates) {
            emojiStateSum = emojiStateSum + clientStates[id].emojiChoice 
          }
          const stateRatio = emojiStateSum / objectSize
          
          jennmoji = ( stateRatio > .5 ) ? choices.distressed : choices.happy
          
          broadcastToAllClients(JSON.stringify({ clientStates, jennmoji }));
        }
      });

      // when client closes connection, remove that client from clientStates and broadcast
      conn.socket.on("close", () => {
        delete clientStates[clientId];
        broadcastToAllClients(JSON.stringify({ clientStates, jennmoji }));
      });
    },
  });
});

// server go brrrrrr
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
