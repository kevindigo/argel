import { DeedManager } from './deed';
import { Decision, Slot, State } from './models';
import { CardefPool } from './pool';
import { StateManager } from './state';
import { CardType, Zone } from './types';

export class Rules {
    public calculateTopLevelDecision(state: State): Decision {
        const stateManager = new StateManager(state);
        const mySideManager = stateManager.getMySideManager();
        const hand = mySideManager.hand;
        // ToDo: Don't offer hand cards that can't be played or discarded
        const availableSlots = hand.map((card, index) => {
            const slot: Slot = {
                zone: Zone.MY_HAND,
                index,
            };
            return slot;
        });
        return {
            label: 'Play/discard/harvest/fight with which card?',
            availableSlots,
            selectedSlots: [],
        };
    }

    public calculateNextDecision(state: State): Decision {
        const deed = state.currentDeed;
        const deedManager = new DeedManager(deed);
        const mainCardSlot = deedManager.getTopLevelSlot();
        if (mainCardSlot.zone === Zone.MY_HAND) {
            return this.calculateFollowupDecisionHand(state);
        }

        throw new Error('calculateFollowup called for non-hand slot');
    }

    public calculateFollowupDecisionHand(state: State): Decision {
        const stateManager = new StateManager(state);
        const mainCard = stateManager.state.currentDeed.mainCard;
        if (!mainCard) {
            throw new Error('Cannot calculate followup with no main card');
        }
        const pool = CardefPool.getPool();
        const cardef = pool.lookup(mainCard.cardId);
        switch (cardef?.type) {
            case CardType.ACTION: {
                const scoredSlot: Slot = {
                    zone: Zone.MY_SCORED,
                    index: -1,
                };
                const decision: Decision = {
                    label: 'Play action',
                    availableSlots: [scoredSlot],
                    selectedSlots: [],
                };
                return decision;
            }
            case CardType.CREATURE: {
                const lineRight: Slot = {
                    zone: Zone.MY_LINE,
                    index: -1,
                };
                const decision: Decision = {
                    label: 'Play to line',
                    availableSlots: [lineRight],
                    selectedSlots: [],
                };
                if (stateManager.getMySideManager().line.length > 0) {
                    const lineLeft: Slot = {
                        zone: Zone.MY_LINE,
                        index: 0,
                    };
                    decision.availableSlots.unshift(lineLeft);
                }
                return decision;
            }
            case CardType.RELIC: {
                const arsenalRight: Slot = {
                    zone: Zone.MY_ARSENAL,
                    index: -1,
                };
                const decision: Decision = {
                    label: 'Play to arsenal',
                    availableSlots: [arsenalRight],
                    selectedSlots: [],
                };
                return decision;
            }
            default: {
                throw new Error(
                    `Followup requested for unknown card type ${JSON.stringify(
                        cardef
                    )}`
                );
            }
        }
    }

    public applyDecision(state: State, slots: Slot[]): void {
        const deedManager = new DeedManager(state.currentDeed);
        if (!deedManager.isValidSelection(slots)) {
            throw new Error(
                `Invalid slots ${JSON.stringify(slots)} for ${JSON.stringify(
                    state
                )}`
            );
        }
        deedManager.getCurrentDecision().selectedSlots = slots;

        const firstSlot = slots[0];
        const stateManager = new StateManager(state);
        const deed = state.currentDeed;
        if (deed.decisions.length === 1) {
            if (!firstSlot) {
                throw new Error(
                    `Unable to extract mainCard ${JSON.stringify(deed)}`
                );
            }
            deed.mainCard = stateManager.getCardAtSlot(firstSlot);
            deed.mainZone = firstSlot.zone;
        }

        if (deed.decisions.length === 2) {
            if (!firstSlot) {
                throw new Error(
                    `Unable to determine type ${JSON.stringify(deed)}`
                );
            }
            deed.type = deedManager.calculateType(
                deed.mainZone,
                firstSlot.zone
            );
        }

        const newDecision = this.calculateNextDecision(state);
        deed.decisions.push(newDecision);
    }
}
