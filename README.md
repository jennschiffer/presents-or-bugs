# jenn's gift-giving game

a page where everyone who joins has the ability to bring me joy by giving gifts or bring me pain by adding to the weight that the social construct of time has on me


## what's going on

- a page with an emoji describing my state - happy, sad 
- for every client that joins, show their mouse cursor as a gift emoji
- clients can click to change their cursor from gift (good) to clock (bad)
- the more gifts, the happier the emoji state, the more clocks, the sadder

client side -
* connect
* on mousemove, send cursor state {x, y, emoji}
* on click, change cursor state {emoji}
* on message from server, update the page to show the current states of all the clients, as well as update the state of my happiness


server side -
* track not just count, but states of all the clients
* on message from client, broadcast the states of all the clients [hard part!] and the ratio of gifts:time


## ARE YOU REMIXING THIS?

i hope so - but it's important that you **update /public/client.js on line 8 to reflect your project index url**

## docs i used to learn

- [@fastify/websocket on npm](https://www.npmjs.com/package/@fastify/websocket)
- [ws on npm](https://www.npmjs.com/package/ws) (because that's what @fastify/websocket says it was built on)
- [mdn docs for WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## made [by j$](https://jennschiffer.com)
