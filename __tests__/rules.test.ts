import { Card, Decision, Slot } from '../src/models';
import { calculateTopLevelDecision } from '../src/rules';
import { StateManager } from '../src/state';
import { CardId, Facing, Zone } from '../src/types';

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

        const decisions: Decision = calculateTopLevelDecision(
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
