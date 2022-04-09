import { CardefPool } from './cards';
import { CardWithState, GameState, Player } from './models';
import { initializeSide, SideManager } from './side';
import { CardState, CardType } from './types';

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
            },
        };
    }

    public get state(): GameState {
        return JSON.parse(JSON.stringify(this._state));
    }

    public startGame(): GameState {
        this.sideManagers.forEach((manager) => {
            this.startGameForSide(manager);
        });

        return this.state;
    }

    private startGameForSide(manager: SideManager): void {
        const pool = new CardefPool();

        // TODO: Shuffle (which will break my tests)

        while (manager.line.length < 2) {
            const card = manager.drawPile.pop();
            if (!card) {
                throw new Error('Drawdeck empty!?');
            }
            const cardef = pool.lookup(card.cardId);
            if (cardef?.type === CardType.CREATURE) {
                const readyCard: CardWithState = {
                    card,
                    state: CardState.READY,
                };
                manager.line.push(readyCard);
            } else {
                manager.discards.push(card);
            }
        }

        manager.draw(3);

        // Should be at the start of each turn
        manager.side.flags.canAttack = true;
        manager.side.flags.canPlayActions = true;
        manager.side.flags.isNextCardActive = false;
    }
}
