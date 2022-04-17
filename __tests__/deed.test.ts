import { DeedManager } from '../src/deed';
import { Deed, Slot } from '../src/models';
import { Zone } from '../src/types';

describe('DeedManager.isValidSelection', () => {
    let deed: Deed;
    let decisionManager: DeedManager;

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
        decisionManager = new DeedManager(deed);
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
        deed.decisions[0]?.availableSlots.push(slot1);
        deed.decisions[0]?.availableSlots.push(slot2);
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
        deed.decisions[0]?.availableSlots.push(otherSlot);
        deed.decisions[0]?.availableSlots.push(selectedSlot);
        const copyOfSlot = JSON.parse(JSON.stringify(selectedSlot));
        expect(decisionManager.isValidSelection([copyOfSlot])).toBeTruthy();
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
        expect(decisionManager.isValidSelection([selected])).toBeFalsy();
    });
});

describe('DeedManager.getCurrentDecision', () => {
    let deed: Deed;
    let decisionManager: DeedManager;

    beforeEach(() => {
        deed = { decisions: [] };
        decisionManager = new DeedManager(deed);
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
        const decision = decisionManager.getCurrentDecision();
        expect(decision.selectedSlots.length).toEqual(0);
    });
});
