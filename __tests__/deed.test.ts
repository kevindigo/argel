import { DeedManager } from '../src/deed';
import { Deed, Slot, State } from '../src/models';
import { createEmptySide } from '../src/side';
import { Facing, Zone } from '../src/types';

describe('DeedManager.startTurn', () => {
    it('Should clear existing data', () => {
        const deed: Deed = {
            mainCard: {
                cardId: 'whatever',
                deckId: 'anything',
                facing: Facing.READY,
            },
            decisions: [
                {
                    label: 'Should get removed',
                    availableSlots: [],
                    selectedSlots: [],
                },
                {
                    label: 'Should also get removed',
                    availableSlots: [],
                    selectedSlots: [],
                },
            ],
        };
        const deedManager = new DeedManager(deed);
        const state: State = {
            sides: [createEmptySide(), createEmptySide()],
            activeSideIndex: 0,
            currentDeed: deed,
        };
        expect(state.currentDeed.decisions.length).toEqual(2);
        deedManager.startTurn(state);
        expect(state.currentDeed.mainCard).toBeUndefined();
        expect(state.currentDeed.type).toBeUndefined();
        console.log(JSON.stringify(state.currentDeed.decisions));
        expect(state.currentDeed.decisions.length).toEqual(1);
    });
});

describe('DeedManager.isValidSelection', () => {
    let deed: Deed;
    let deedManager: DeedManager;

    beforeEach(() => {
        deed = {
            decisions: [
                {
                    label: 'n/a',
                    availableSlots: [],
                    selectedSlots: [],
                },
            ],
        };
        deedManager = new DeedManager(deed);
    });

    it('returns false if no slots were selected', () => {
        expect(deedManager.isValidSelection([])).toBeFalsy();
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
        deed.decisions[0]?.availableSlots.push(slot1);
        deed.decisions[0]?.availableSlots.push(slot2);
        const selected: Slot[] = [
            JSON.parse(JSON.stringify(slot1)),
            JSON.parse(JSON.stringify(slot2)),
        ];
        expect(deedManager.isValidSelection(selected)).toBeFalsy();
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
        deed.decisions[0]?.availableSlots.push(otherSlot);
        deed.decisions[0]?.availableSlots.push(selectedSlot);
        const copyOfSlot = JSON.parse(JSON.stringify(selectedSlot));
        expect(deedManager.isValidSelection([copyOfSlot])).toBeTruthy();
    });

    it('returns true if a valid slot was selected', () => {
        const slot: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 0,
        };
        deed.decisions[0]?.availableSlots.push(slot);
        const selected: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 2,
        };
        expect(deedManager.isValidSelection([selected])).toBeFalsy();
    });
});

describe('DeedManager.getCurrentDecision', () => {
    let deed: Deed;
    let deedManager: DeedManager;

    beforeEach(() => {
        deed = { decisions: [] };
        deedManager = new DeedManager(deed);
    });

    it('knows when the top-level decision has been made', () => {
        const slot: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 0,
        };
        deed.decisions.push({
            label: 'top-level',
            availableSlots: [slot],
            selectedSlots: [slot],
        });
        deed.decisions.push({
            label: 'follow-up',
            availableSlots: [slot],
            selectedSlots: [],
        });
        const decision = deedManager.getCurrentDecision();
        expect(decision.selectedSlots.length).toEqual(0);
    });
});
