import { Decision, Slot, State } from './models';
import { CardefPool } from './pool';
import { StateManager } from './state';
import { CardType, Zone } from './types';

export function calculateTopLevelDecision(state: State): Decision {
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

export function getTopLevelSlot(state: State): Slot {
    const topLevelDecision = state.currentDeed.decisions[0];
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

export function calculateFollowupDecisionHand(state: State): Decision {
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
