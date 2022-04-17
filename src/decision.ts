import { Decision, Slot, State } from './models';
import { CardefPool } from './pool';
import { slotString } from './slot';
import { StateManager } from './state';
import { CardType, Zone } from './types';

function calculateTopLevelDecision(state: State): Decision {
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

function getTopLevelSlot(state: State): Slot {
    const topLevelDecision = state.currentDeed[0];
    if (!topLevelDecision) {
        throw new Error(
            'calculateFollowup called without a top-level decision'
        );
    }
    const slots = topLevelDecision.selectedSlots;
    if (slots.length === 0) {
        throw new Error(
            'calculateFollowup called with no top-level slot selected'
        );
    }
    if (slots.length > 1) {
        throw new Error(
            `calculateFollowup called with more than 1 top-level slot. Decision: ${JSON.stringify(
                topLevelDecision
            )}`
        );
    }
    const mainCardSlot = slots[0] as Slot;
    return mainCardSlot;
}

function calculateFollowupDecisionHand(state: State): Decision {
    const stateManager = new StateManager(state);
    const mainCardSlot = getTopLevelSlot(state);
    const mainCard = stateManager.getCardAtSlot(mainCardSlot);
    const pool = CardefPool.getPool();
    const cardef = pool.lookup(mainCard.cardId);
    switch (cardef?.type) {
        case CardType.ACTION: {
            const scoredSlot: Slot = {
                zone: Zone.MY_SCORED,
                index: -1,
            };
            const decision: Decision = {
                label: 'Play',
                availableSlots: [scoredSlot],
                selectedSlots: [],
            };
            return decision;
        }
        case CardType.CREATURE: {
            throw new Error('Followup for creature not available yet');
        }
        case CardType.RELIC: {
            throw new Error('Followup for relic not available yet');
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

function calculateFollowupDecision(state: State): Decision {
    const mainCardSlot = getTopLevelSlot(state);
    if (mainCardSlot.zone === Zone.MY_HAND) {
        return calculateFollowupDecisionHand(state);
    }

    throw new Error('calculateFollowup called for non-hand slot');
}

export function calculateNextDecision(state: State): Decision {
    if (state.currentDeed.length === 0) {
        return calculateTopLevelDecision(state);
    }

    const stateManager = new StateManager(state);
    const latestDecision: Decision = stateManager.getLastDecision();
    if (latestDecision.selectedSlots.length !== 0) {
        return calculateFollowupDecision(state);
    }
    throw new Error('Followups are not yet supported');
}

export class DecisionManager {
    private deed;

    public constructor(deed: Decision[]) {
        this.deed = deed;
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
        for (let i = 0; i < this.deed.length; ++i) {
            const decision = this.deed[i] as Decision;
            if (decision.selectedSlots.length === 0) {
                return decision;
            }
        }

        throw new Error('No current decision');
    }
}