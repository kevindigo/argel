import { Decision, Deed, Slot } from './models';
import { slotString } from './slot';
import { DeedType, Zone } from './types';

export class DeedManager {
    private deed: Deed;

    public constructor(deed: Deed) {
        this.deed = deed;
    }

    public startTurn(topLevelDecision: Decision): void {
        this.deed.type = undefined;
        this.deed.mainCard = undefined;
        this.deed.pendingDecision = topLevelDecision;
        this.deed.completedDecisions = [];
    }

    public isValidSelection(slots: Slot[]): boolean {
        if (slots.length !== 1) {
            return false;
        }
        const slot = slots[0];
        if (!slot) {
            return false;
        }
        const ss = slotString(slot);
        const decision = this.getCurrentDecision();
        const found = decision.availableSlots.find((availableSlot) => {
            return slotString(availableSlot) === ss;
        });
        return found ? true : false;
    }

    public getCurrentDecision(): Decision {
        return this.deed.pendingDecision;
    }

    public calculateType(from?: Zone, to?: Zone): DeedType {
        if (from === Zone.MY_HAND && to === Zone.MY_SCORED) {
            return DeedType.PLAY;
        }

        throw new Error(`Could not calculate type from ${from} to ${to}`);
    }

    public getTopLevelSlot(): Slot {
        const topLevelDecision = this.deed.completedDecisions[0];
        if (!topLevelDecision) {
            throw new Error('getTopLevelSlot called no completed decisions');
        }
        const slots = topLevelDecision.selectedSlots;
        if (slots.length === 0) {
            throw new Error(
                'getTopLevelSlot called with no top-level slot selected'
            );
        }
        if (slots.length > 1) {
            throw new Error(
                `getTopLevelSlot called with more than 1 top-level slot. Decision: ${JSON.stringify(
                    topLevelDecision
                )}`
            );
        }
        const mainCardSlot = slots[0] as Slot;
        return mainCardSlot;
    }
}
