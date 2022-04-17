import { DecisionManager, calculateNextDecision } from '../src/decision';
import { Game } from '../src/game';
import { Card, Decision, Player, Slot, State } from '../src/models';
import { createEmptySide, SideManager } from '../src/side';
import { StateManager } from '../src/state';
import { Zone } from '../src/types';

const sig: Player = {
    name: 'Sig',
    deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
};
const marla: Player = {
    name: 'Marla',
    deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
};

describe('Top-level decisions', () => {
    let state: State;
    let stateManager: StateManager;

    beforeEach(() => {
        state = {
            sides: [createEmptySide(), createEmptySide()],
            turnState: {
                myIndex: 0,
                turnFlags: {
                    canDiscard: false,
                },
            },
            availableDeeds: [],
            currentDeed: [],
        };
        stateManager = new StateManager(state);
        // const pool = CardefPool.getPool();
    });

    it('should offer all playable hand cards', () => {
        const mySideManager = stateManager.getMySideManager();
        const hand = mySideManager.hand;
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const jater: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };

        hand.push(vix);
        hand.push(jater);

        const decisions: Decision = calculateNextDecision(state);
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

describe('DecisionManager.isValidSelection', () => {
    let deed: Decision[];
    let decisionManager: DecisionManager;

    beforeEach(() => {
        deed = [
            {
                label: 'n/a',
                availableSlots: [],
                selectedSlots: [],
            },
        ];
        decisionManager = new DecisionManager(deed);
    });

    it('returns false if no slots were selected', () => {
        expect(decisionManager.isValidSelection([])).toBeFalsy();
    });

    it('returns false if more than one slot was selected', () => {
        const slot1: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 0,
        };
        const slot2: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 2,
        };
        deed[0]?.availableSlots.push(slot1);
        deed[0]?.availableSlots.push(slot2);
        const selected: Slot[] = [
            JSON.parse(JSON.stringify(slot1)),
            JSON.parse(JSON.stringify(slot2)),
        ];
        expect(decisionManager.isValidSelection(selected)).toBeFalsy();
    });

    it('returns true if a valid slot was selected', () => {
        const selectedSlot: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 2,
        };
        const otherSlot: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 0,
        };
        deed[0]?.availableSlots.push(otherSlot);
        deed[0]?.availableSlots.push(selectedSlot);
        const copyOfSlot = JSON.parse(JSON.stringify(selectedSlot));
        expect(decisionManager.isValidSelection([copyOfSlot])).toBeTruthy();
    });

    it('returns true if a valid slot was selected', () => {
        const slot: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 0,
        };
        deed[0]?.availableSlots.push(slot);
        const selected: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 2,
        };
        expect(decisionManager.isValidSelection([selected])).toBeFalsy();
    });
});

describe('DecisionManager.getCurrentDecision', () => {
    let deed: Decision[];
    let decisionManager: DecisionManager;

    beforeEach(() => {
        deed = [];
        decisionManager = new DecisionManager(deed);
    });

    it('knows when the top-level decision has been made', () => {
        const slot: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 0,
        };
        deed.push({
            label: 'top-level',
            availableSlots: [slot],
            selectedSlots: [slot],
        });
        deed.push({
            label: 'follow-up',
            availableSlots: [slot],
            selectedSlots: [],
        });
        const decision = decisionManager.getCurrentDecision();
        expect(decision.selectedSlots.length).toEqual(0);
    });
});

describe('calculateNextDecision', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game(sig, marla);
    });

    it('Follow-up for playing actions only offers scored', () => {
        const mySideManager = game.sideManagers[0] as SideManager;
        const nothingToSeeHere: Card = {
            deckId: 'bogus',
            cardId: 'OmegaCodex-100',
        };
        while (mySideManager.hand.length) {
            mySideManager.hand.pop();
        }
        mySideManager.hand.push(nothingToSeeHere);
        while (mySideManager.line.length) {
            mySideManager.line.pop();
        }
        game.startTurn();

        {
            const state = game.getCopyOfStateWithOptions();
            expect(state.sides[0]?.hand.length).toEqual(1);
            expect(state.sides[0]?.line.length).toEqual(0);

            const stateManager = new StateManager(state);
            const topLevelDecision = stateManager.getCurrentDecision();
            expect(topLevelDecision.availableSlots.length).toEqual(1);
            const topLevelSlot = topLevelDecision.availableSlots[0] as Slot;
            game.applyDecision([topLevelSlot]);
        }

        {
            const state = game.getCopyOfStateWithOptions();
            const stateManager = new StateManager(state);
            const followUp = stateManager.getCurrentDecision();
            expect(followUp.availableSlots.length).toEqual(1);
            const dest = followUp.availableSlots[0] as Slot;
            expect(dest.zone).toEqual(Zone.MY_SCORED);
            expect(dest.index).toEqual(-1);
        }
    });

    it('throws if the last decision remains incomplete', () => {
        const state = game.getCopyOfStateWithOptions();
        expect(() => calculateNextDecision(state)).toThrowError();
    });
});
