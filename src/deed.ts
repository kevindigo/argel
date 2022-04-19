import { Decision, Deed, Slot, State } from './models';
import { slotString } from './slot';
import { StateManager } from './state';
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

    public applyDecision(state: State, slots: Slot[]): void {
        if (!this.isValidSelection(slots)) {
            throw new Error(
                `Invalid slots ${JSON.stringify(slots)} for ${JSON.stringify(
                    state
                )}`
            );
        }
        this.getCurrentDecision().selectedSlots = slots;

        const firstSlot = slots[0];
        const stateManager = new StateManager(state);
        if (this.deed.decisions.length === 1) {
            if (!firstSlot) {
                throw new Error(
                    `Unable to extract mainCard ${JSON.stringify(this.deed)}`
                );
            }
            this.deed.mainCard = stateManager.getCardAtSlot(firstSlot);
            this.deed.mainZone = firstSlot.zone;
        }

        if (this.deed.decisions.length === 2) {
            if (!firstSlot) {
                throw new Error(
                    `Unable to determine type ${JSON.stringify(this.deed)}`
                );
            }
            this.deed.type = this.calculateType(
                this.deed.mainZone,
                firstSlot.zone
            );
        }

        const newDecision = stateManager.calculateNextDecision();
        this.deed.decisions.push(newDecision);
    }

    private calculateType(from?: Zone, to?: Zone): DeedType {
        if (from === Zone.MY_HAND && to === Zone.MY_SCORED) {
            return DeedType.PLAY;
        }

        throw new Error(`Could not calculate type from ${from} to ${to}`);
    }
}
