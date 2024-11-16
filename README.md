# Multiplayer Board Game with Pixi.TS and Go

## Motivation
The primary goal of this project was not necessarily to ship a full-fledged online game but to explore and understand the various components that go into building one. The project serves as a learning exercise in both front-end and back-end development, with an emphasis on real-time multiplayer communication.

As the name suggests, this project was built using:
* PixiJS - For creating the game UI and rendering
* Webpack - For Typescript support
* Go - For managing the game state and player interactions
* WebSockets - For real-time communication between the front-end and back-end

## Getting Started

### Prerequisites
* Node.js (version 20.15.0)
* Go (version 1.22.4)

### Front-End
* Clone this repository
* Installl dependencies: `npm install`
* Build and run the front-end with application: `npm run build` and `npm run start`

This wil launch the front-end application on `http://localhost:4000`

### Server
* Navigate to the `server/` directory
* Build the Go application with `go build .`
* Run the produced executable

The server will be running and listening for connections on port `8080`

## Running the Game
Once both the front-end and back-end applications are running, open your browser to `http://localhost:4000`
and you will be prompted for a username. Click submit and you will be placed in a lobby where you can wait 
for other players to join.

Once all players have clicked 'Ready', the game will begin.

## Going Forward

I haven't decided yet if I want to continue this project and implement a full-fledged "Monopoly Clone", or
if I want to take my learnings from this and start something new and unique. Only time will tell.