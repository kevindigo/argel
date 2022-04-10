import { CardefPool } from './cards';
import { AvailableDeedsGenerator } from './deeds';
import {
    Card,
    CardWithState,
    GameState,
    Player,
    Side,
    TurnState,
} from './models';
import { createInitialSide, SideManager } from './side';
import { CardState, CardType } from './types';

export function createInitialGameState(
    player1: Player,
    player2: Player
): GameState {
    const sides: Side[] = [
        createInitialSide(player1),
        createInitialSide(player2),
    ];

    const turnState: TurnState = {
        myIndex: 0,
        turnFlags: {
            canDiscard: false,
        },
    };

    const state: GameState = {
        sides,
        turnState,
    };

    return state;
}

export class Game {
    public readonly players: Player[];
    public readonly sideManagers: SideManager[];
    public readonly pool: CardefPool;
    private _state: GameState;
    private availableDeedsGetter: AvailableDeedsGenerator;

    public constructor(state: GameState) {
        this._state = state;
        this.players = state.sides.map((side) => {
            return side.player;
        });
        this.sideManagers = state.sides.map((side) => {
            return new SideManager(side);
        });
        this.pool = new CardefPool();
        this.availableDeedsGetter = new AvailableDeedsGenerator();
    }

    public getCopyOfStateWithOptions(): GameState {
        const copy: GameState = JSON.parse(JSON.stringify(this._state));
        copy.options = Array.from(
            this.availableDeedsGetter.getAvailableDeeds(copy)
        );
        return copy;
    }

    public startGame(): void {
        this.sideManagers.forEach((manager) => {
            this.startGameForSide(manager);
        });
    }

    public getMyIndex(): number {
        return this._state.turnState.myIndex;
    }

    public getEnemyIndex(): number {
        return 1 - this.getMyIndex();
    }

    private startGameForSide(manager: SideManager): void {
        const pool = new CardefPool();

        this.shuffleInPlace(manager.drawPile);

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
        manager.side.flags.canFight = true;
        manager.side.flags.canPlayActions = true;
        manager.side.flags.isNextCardActive = false;
    }

    // This implements a "Durstenfeld shuffle"
    private shuffleInPlace(pile: Card[]): void {
        for (let i = pile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = pile[i] as Card;
            pile[i] = pile[j] as Card;
            pile[j] = temp;
        }
    }
}
