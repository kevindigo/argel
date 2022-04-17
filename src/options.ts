import { Deed, Slot, State } from './models';
import { StateManager } from './state';
import { DeedType, Zone } from './types';

function getAllHandSlots(stateManager: StateManager): Slot[] {
    const hand = stateManager.getMySideManager().hand;
    return hand.map((handCard, index) => {
        const slot: Slot = {
            zone: Zone.MY_HAND,
            index,
        };
        return slot;
    });
}

export function getNextOptionsForDeed(
    readonlyState: State,
    deed: Deed
): Slot[] {
    const state = JSON.parse(JSON.stringify(readonlyState));
    const stateManager = new StateManager(state);
    switch (deed.type) {
        case DeedType.PLAY: {
            const playedCardSlot = deed.from[deed.from.length - 1];
            if (!playedCardSlot) {
                throw new Error(
                    `getNextOptionsForDeed no slot: ${JSON.stringify(deed)}`
                );
            }
            const playedCard = stateManager.getCardAtSlot(playedCardSlot);
            if (!playedCard) {
                throw new Error(
                    `getNextOptionsForDeed no playedCard ${JSON.stringify(
                        playedCard
                    )}`
                );
            }
            const cardId = playedCard.cardId;
            stateManager
                .getMySideManager()
                .hand.splice(playedCardSlot.index, 1);
            if (cardId === 'OmegaCodex-063') {
                const allHandSlots = getAllHandSlots(stateManager);
                return allHandSlots;
            }
            break;
        }
    }
    return [];
}
