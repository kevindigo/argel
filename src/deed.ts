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
        this.deed.decisions = [];
        this.deed.decisions.push(topLevelDecision);
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
        for (let i = 0; i < this.deed.decisions.length; ++i) {
            const decision = this.deed.decisions[i] as Decision;
            if (decision.selectedSlots.length === 0) {
                return decision;
            }
        }

        throw new Error('No current decision');
    }

    public calculateType(from?: Zone, to?: Zone): DeedType {
        if (from === Zone.MY_HAND && to === Zone.MY_SCORED) {
            return DeedType.PLAY;
        }

        throw new Error(`Could not calculate type from ${from} to ${to}`);
    }
}
