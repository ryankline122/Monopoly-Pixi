import { startGame } from ".";
import { Actions } from "./constants/actions";
import { ClientRequest, InitialRequest } from "./dto/client-request";
import { PlayerInfo } from "./dto/player-info";
import { ServerResponse } from "./dto/server-response";
import { Player } from "./ui/player";

export class PregameLobby {
    private players: Set<Player>;
    private websocket: WebSocket;
    private username: string;

    public constructor(websocket: WebSocket, players: Set<Player>, username: string){
        this.websocket = websocket;
        this.players = players;
        this.username = username;
    }

    public async setupEventListeners() {
        this.setupButtonEvents();
        this.setupWindowEvents();
        await this.setupWebsocketEvents();
    }

    private addPlayers(newPlayers: PlayerInfo[]) {
        newPlayers.forEach((p) => {
            const player: Player = new Player(
                p.PlayerNumber,
                p.Username,
                p.Color, 
                p.X,
                p.Y,
            );
            this.players.add(player);
        });
    }

    private removeDisconnectedPlayers(connectedPlayers: PlayerInfo[]) {
        const currentPlayerNumbers: number[] = [];
        this.players.forEach((p) => { currentPlayerNumbers.push(p.getPlayerNumber());});

        const currentConnectedPlayerNumbers: number[] = [];
        connectedPlayers.forEach((p) => { currentConnectedPlayerNumbers.push(p.PlayerNumber);});

        const missingPlayers = currentPlayerNumbers.filter((n) => {
            return !currentConnectedPlayerNumbers.includes(n);
        });

        this.players.forEach((p) => {
            if (missingPlayers.includes(p.getPlayerNumber())) {
                console.log("Removed player: ", p.getUsername());
                this.players.delete(p);
            } 
        });
    }

    private getReadyStatus(connectedPlayers: PlayerInfo[]): boolean {
        let areAllPlayersReady = true;
        connectedPlayers.forEach((p) => {
            if (p.IsReady === false) {
                areAllPlayersReady = false;
            }
        });

        return areAllPlayersReady;
    }

    private updatePlayerList() {
        const playersList = document.getElementById("playersList") as HTMLUListElement;

        playersList.innerHTML = '';
        this.players.forEach(p => {
            playersList.insertAdjacentHTML('beforeend', `<li>${p.getUsername()}</li>`);
        });
    }

    private setupButtonEvents() {
        const readyBtn = document.getElementById("readyBtn") as HTMLButtonElement;
        readyBtn.addEventListener("click", async () => {
            console.log("CLicked");
            this.players.forEach((p) => {
                if (p.getUsername() === this.username) {
                    readyBtn.disabled = true;
                    
                    const req: ClientRequest = {
                        Action: Actions.Ready
                    };
                    this.websocket.send(JSON.stringify(req));
                }
            });
        });
    }

    private setupWindowEvents() {
        window.addEventListener('beforeunload', () => {
            if (this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.close(1000, 'Page closing');
            }
        });
    }

    private async setupWebsocketEvents() {
        const lobby = document.getElementById("lobby");

        this.websocket.onopen = () => {
            console.log('Connected to server');
            const req: InitialRequest = {
                Username: this.username
            };
            this.websocket.send(JSON.stringify(req));
        };

        this.websocket.onmessage = async (event) => {
            const response: ServerResponse = JSON.parse(event.data);
            console.log("Server response", response);

            if (response.Initial) {
                const playerInfo: PlayerInfo = response.Gamestate.Players[response.PlayerNumber - 1];
                this.addPlayers([playerInfo]);
            } else {
                const connectedPlayers: PlayerInfo[] = response.Gamestate.Players;
                const currentPlayerNumbers = new Set<number>();
                this.players.forEach((p) => { currentPlayerNumbers.add(p.getPlayerNumber());});
    
                if (connectedPlayers.length !== this.players.size) {
                    if (connectedPlayers.length > this.players.size) {
                        const newPlayers: PlayerInfo[] = response.Gamestate.Players.filter((p) => {
                            return !currentPlayerNumbers.has(p.PlayerNumber);
                        });
                        this.addPlayers(newPlayers);
                    } else if (connectedPlayers.length < this.players.size) {
                        this.removeDisconnectedPlayers(connectedPlayers);
                    } 
                } else if (!response.Active) { // Chage to isGameActive
                    const areAllPlayersReady = this.getReadyStatus(connectedPlayers);
                    console.log(areAllPlayersReady);
                    
                    if (areAllPlayersReady) {
                        lobby.hidden = true;
                        const req: ClientRequest = {
                            Action: Actions.Start
                        };
                        this.websocket.send(JSON.stringify(req));
                        await startGame(this.websocket, this.players);
                    }
                }
                this.updatePlayerList();
            }

            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            this.websocket.onclose = () => {
                console.log('Disconnected from server');
            };
        };
    }
}