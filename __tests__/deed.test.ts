import { DeedManager } from '../src/deed';
import { Decision, Deed, Slot, State } from '../src/models';
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
            pendingDecision: {
                label: 'old pending',
                availableSlots: [],
                selectedSlots: [],
            },
            completedDecisions: [
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
        expect(state.currentDeed.completedDecisions.length).toEqual(2);
        const topLevelDecision: Decision = {
            label: 'irrelevant',
            availableSlots: [],
            selectedSlots: [],
        };
        deedManager.startTurn(topLevelDecision);
        expect(deed.mainCard).toBeUndefined();
        expect(deed.type).toBeUndefined();
        expect(deed.pendingDecision.availableSlots.length).toEqual(0);
        expect(deed.completedDecisions.length).toEqual(0);
        expect(deed.mainCard).toBeUndefined();
        expect(deed.mainZone).toBeUndefined();
    });
});

describe('DeedManager.isValidSelection', () => {
    let deed: Deed;
    let deedManager: DeedManager;

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
        deed.pendingDecision.availableSlots.push(slot1);
        deed.pendingDecision.availableSlots.push(slot2);
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
        deed.pendingDecision.availableSlots.push(otherSlot);
        deed.pendingDecision.availableSlots.push(selectedSlot);
        const copyOfSlot = JSON.parse(JSON.stringify(selectedSlot));
        expect(deedManager.isValidSelection([copyOfSlot])).toBeTruthy();
    });

    it('returns true if a valid slot was selected', () => {
        const slot: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 0,
        };
        deed.pendingDecision.availableSlots.push(slot);
        const selected: Slot = {
            zone: Zone.ENEMY_ARSENAL,
            index: 2,
        };
        expect(deedManager.isValidSelection([selected])).toBeFalsy();
    });
});
