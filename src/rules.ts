import { Decision, Slot, State } from './models';
import { StateManager } from './state';
import { Zone } from './types';

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
