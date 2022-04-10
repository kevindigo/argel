import { Card, Deed, State } from './models';
import { StateManager } from './state';

export function doDeed(state: State, deed: Deed): void {
    const stateManager = new StateManager(state);
    const mySideManager = stateManager.getMySideManager();

    const handIndex = deed.handIndex;
    if (handIndex !== null) {
        const card = mySideManager.hand[handIndex] as Card;
        mySideManager.hand.splice(handIndex, 1);
        mySideManager.scored.push(card);
    }
}
