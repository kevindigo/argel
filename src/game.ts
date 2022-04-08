import { CardefPool } from './cards';
import { GameState, Player } from './models';
import { initializeSide, SideManager } from './side';

export class Game {
    public readonly players: Player[];
    public readonly sideManagers: SideManager[];
    public readonly pool: CardefPool;
    private _state: GameState;

    public constructor(player1: Player, player2: Player) {
        this.players = [player1, player2];
        this.sideManagers = [initializeSide(player1), initializeSide(player2)];
        this.pool = new CardefPool();
        const sides = this.sideManagers.map((sm) => {
            return sm.side;
        });
        this._state = {
            sides,
            turnState: {
                activePlayerIndex: 0,
                flags: new Map(),
            },
        };
    }

    public get state(): GameState {
        return JSON.parse(JSON.stringify(this._state));
    }
}
