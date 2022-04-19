import { Card, Decision, Player, Slot } from '../src/models';
import { Rules } from '../src/rules';
import { createInitialState, StateManager } from '../src/state';
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

        const rules = new Rules();
        const decisions: Decision = rules.calculateTopLevelDecision(
            stateManager.state
        );
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

describe('Rules.applyDecision', () => {
    it('throws if the last decision remains incomplete', () => {
        const state = createInitialState(sig, marla);
        const rules = new Rules();
        expect(() => rules.calculateNextDecision(state)).toThrowError();
    });
});
