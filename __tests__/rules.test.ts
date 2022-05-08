import { DeedManager } from '../src/deed';
import { Card, Decision, Deed, Player, Slot } from '../src/models';
import { Rules } from '../src/rules';
import { createInitialState, StateManager } from '../src/state';
import { CardId, DeedType, Facing, Zone } from '../src/types';

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
    let deed: Deed;
    let deedManager: DeedManager;
    const rules = new Rules();

    it('should throw if the selection was not available', () => {
        const state = createInitialState(sig, marla);
        const slot: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 0,
        };
        state.currentDeed.pendingDecision = {
            label: 'top-level',
            availableSlots: [],
            selectedSlots: [],
        };
        expect(() => rules.applyDecision(state, [slot])).toThrowError();
    });

    it('throws if the last decision remains incomplete', () => {
        const state = createInitialState(sig, marla);
        expect(() => rules.calculateNextDecision(state)).toThrowError();
    });

    beforeEach(() => {
        deed = {
            pendingDecision: {
                label: 'n/a',
                availableSlots: [],
                selectedSlots: [],
            },
            completedDecisions: [],
        };
        deedManager = new DeedManager(deed);
    });

    it('should correctly apply a decision', () => {
        const slot: Slot = {
            zone: Zone.MY_HAND,
            index: 0,
        };
        const state = StateManager.createWithEmptyState().state;
        const stateManager = new StateManager(state);
        const hand = stateManager.getMySideManager().hand;
        const card: Card = {
            cardId: 'OmegaCodex-100',
            deckId: 'anydeck',
            facing: Facing.READY,
        };
        hand.push(card);
        deed = state.currentDeed;
        deedManager = new DeedManager(deed);
        const decision: Decision = {
            label: 'irrelevant',
            availableSlots: [slot],
            selectedSlots: [],
        };
        deedManager.startTurn(decision);
        rules.applyDecision(state, [slot]);
        expect(deed.completedDecisions.length).toEqual(1);
        expect(deed.completedDecisions[0]?.selectedSlots).toEqual([slot]);
        expect(deed.completedDecisions[0]?.label).toEqual(decision.label);

        expect(deed.mainCard).toEqual(card);
        expect(deed.mainZone).toEqual(Zone.MY_HAND);
    });

    it('knows when we chose a hand action', () => {
        const slot: Slot = {
            zone: Zone.MY_HAND,
            index: 0,
        };
        const state = StateManager.createWithEmptyState().state;
        const stateManager = new StateManager(state);
        const hand = stateManager.getMySideManager().hand;
        const card: Card = {
            cardId: 'OmegaCodex-100',
            deckId: 'anydeck',
            facing: Facing.READY,
        };
        hand.push(card);
        deed = state.currentDeed;
        deedManager = new DeedManager(deed);
        const topLevelDecision: Decision = {
            label: 'top-level',
            availableSlots: [slot],
            selectedSlots: [],
        };
        deedManager.startTurn(topLevelDecision);
        rules.applyDecision(state, [slot]);
        const decision = deedManager.getCurrentDecision();
        const scored: Slot = {
            zone: Zone.MY_SCORED,
            index: -1,
        };
        expect(decision.availableSlots).toEqual([scored]);
        rules.applyDecision(state, decision.availableSlots);
        expect(deed.type).toEqual(DeedType.PLAY);
    });
});
