import { calculateNextDecision } from '../src/decision';
import { Game } from '../src/game';
import { Card, Decision, Player, Slot } from '../src/models';
import { SideManager } from '../src/side';
import { StateManager } from '../src/state';
import { CardId, Facing, Zone } from '../src/types';

const sig: Player = {
    name: 'Sig',
    deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
};
const marla: Player = {
    name: 'Marla',
    deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
};

function createBogusReadyCard(cardId: CardId): Card {
    return {
        cardId,
        deckId: 'bogus',
        facing: Facing.READY,
    };
}

describe('Top-level decisions', () => {
    let stateManager: StateManager;

    beforeEach(() => {
        stateManager = StateManager.createWithEmptyState();
        // const pool = CardefPool.getPool();
    });

    it('should offer all playable hand cards', () => {
        const mySideManager = stateManager.getMySideManager();
        const hand = mySideManager.hand;
        const vix: Card = createBogusReadyCard('OmegaCodex-001');
        const jater: Card = createBogusReadyCard('OmegaCodex-001');

        hand.push(vix);
        hand.push(jater);

        const decisions: Decision = calculateNextDecision(stateManager.state);
        expect(decisions.availableSlots.length).toEqual(2);
        const playVix: Slot = {
            zone: Zone.MY_HAND,
            index: 0,
        };
        expect(decisions.availableSlots).toContainEqual(playVix);
        const playJater: Slot = {
            zone: Zone.MY_HAND,
            index: 1,
        };
        expect(decisions.availableSlots).toContainEqual(playJater);
    });
});

describe('calculateNextDecision', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game(sig, marla);
    });

    it('Follow-up for playing actions only offers scored', () => {
        const mySideManager = game.sideManagers[0] as SideManager;
        const nothingToSee = createBogusReadyCard('OmegaCodex-100');
        while (mySideManager.hand.length) {
            mySideManager.hand.pop();
        }
        mySideManager.hand.push(nothingToSee);
        while (mySideManager.line.length) {
            mySideManager.line.pop();
        }
        game.startTurn();

        {
            const state = game.getCopyOfState();
            expect(state.sides[0]?.hand.length).toEqual(1);
            expect(state.sides[0]?.line.length).toEqual(0);

            const stateManager = new StateManager(state);
            const topLevelDecision = stateManager.getCurrentDecision();
            expect(topLevelDecision.availableSlots.length).toEqual(1);
            const topLevelSlot = topLevelDecision.availableSlots[0] as Slot;
            game.applyDecision([topLevelSlot]);
        }

        {
            const state = game.getCopyOfState();
            const stateManager = new StateManager(state);
            const followUp = stateManager.getCurrentDecision();
            expect(followUp.availableSlots.length).toEqual(1);
            const dest = followUp.availableSlots[0] as Slot;
            expect(dest.zone).toEqual(Zone.MY_SCORED);
            expect(dest.index).toEqual(-1);
        }
    });

    it('throws if the last decision remains incomplete', () => {
        const state = game.getCopyOfState();
        expect(() => calculateNextDecision(state)).toThrowError();
    });
});
