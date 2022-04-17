import { CardefPool } from './pool';
import { Card, CardWithState, State, Player, Slot } from './models';
import { SideManager } from './side';
import { createInitialState, StateManager } from './state';
import { CardState, CardType } from './types';
import { DecisionManager, calculateNextDecision } from './decision';

export class Game {
    public readonly players: Player[];
    public readonly sideManagers: SideManager[];
    public readonly pool: CardefPool;
    private stateManager: StateManager;

    public constructor(player1: Player, player2: Player) {
        const state = createInitialState(player1, player2);
        if (player1.deckId === player2.deckId) {
            throw new Error('Mirror matches are not allowed');
        }
        this.players = [player1, player2];
        this.sideManagers = state.sides.map((side) => {
            return new SideManager(side);
        });
        this.stateManager = new StateManager(state);
        this.pool = CardefPool.getPool();
        this.startGame();
    }

    public getCopyOfStateWithOptions(): State {
        const copy: State = JSON.parse(JSON.stringify(this.stateManager.state));
        return copy;
    }

    public applyDecision(slots: Slot[]): void {
        const state = this.stateManager.state;
        const decisionManager = new DecisionManager(state.currentDeed);
        if (!decisionManager.isValidSelection(slots)) {
            throw new Error(
                `Invalid slots ${JSON.stringify(slots)} for ${JSON.stringify(
                    state
                )}`
            );
        }
        decisionManager.getCurrentDecision().selectedSlots = slots;
        const newDecision = calculateNextDecision(state);
        state.currentDeed.push(newDecision);
        return;
    }

    public startTurn() {
        const state = this.stateManager.state;
        state.currentDeed = [];
        const currentDecision = calculateNextDecision(this.stateManager.state);
        state.currentDeed = [currentDecision];
    }

    private startGame(): void {
        this.sideManagers.forEach((manager) => {
            this.startGameForSide(manager);
        });

        this.startTurn();
    }

    private startGameForSide(manager: SideManager): void {
        const pool = CardefPool.getPool();

        this.shuffleInPlace(manager.drawPile);

        while (manager.line.length < 2) {
            const card = manager.drawPile.pop();
            if (!card) {
                throw new Error('DrawPile empty!?');
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
