import {
    calculateFollowupDecision,
    calculateTopLevelDecision,
} from './decision';
import { Decision, Deed, Slot, State } from './models';
import { slotString } from './slot';
import { StateManager } from './state';

export class DeedManager {
    private deed: Deed;

    public constructor(deed: Deed) {
        this.deed = deed;
    }

    public startTurn(state: State): void {
        this.deed.type = undefined;
        this.deed.mainCard = undefined;
        this.deed.decisions = [];
        this.deed.decisions.push(this.calculateNextDecision(state));
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

    public applyDecision(state: State, slots: Slot[]): void {
        if (!this.isValidSelection(slots)) {
            throw new Error(
                `Invalid slots ${JSON.stringify(slots)} for ${JSON.stringify(
                    state
                )}`
            );
        }
        this.getCurrentDecision().selectedSlots = slots;
        const newDecision = this.calculateNextDecision(state);
        state.currentDeed.decisions.push(newDecision);
    }

    public calculateNextDecision(state: State): Decision {
        if (state.currentDeed.decisions.length === 0) {
            return calculateTopLevelDecision(state);
        }

        const stateManager = new StateManager(state);
        const latestDecision: Decision = stateManager.getLastDecision();
        if (latestDecision.selectedSlots.length !== 0) {
            return calculateFollowupDecision(state);
        }
        throw new Error('Followups are not yet supported');
    }
}
