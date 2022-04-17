import { calculateNextDecision } from '../src/decision';
import { Game } from '../src/game';
import { Card, Decision, Player, Slot, State } from '../src/models';
import { createEmptySide, SideManager } from '../src/side';
import { StateManager } from '../src/state';
import { Facing, Zone } from '../src/types';

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
            activeSideIndex: 0,
            sides: [createEmptySide(), createEmptySide()],
            currentDeed: { decisions: [] },
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
            facing: Facing.READY,
        };
        const jater: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
            facing: Facing.READY,
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
            facing: Facing.READY,
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
