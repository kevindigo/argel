import { doDeed } from '../src/doer';
import { Card, Deed, Player } from '../src/models';
import { createInitialState, StateManager } from '../src/state';
import { DeedType } from '../src/types';

const sig: Player = {
    name: 'Sig',
    deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
};
const marla: Player = {
    name: 'Marla',
    deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
};

describe('The deed doer', () => {
    it('Can play an action with no effects', () => {
        const state = createInitialState(sig, marla);
        const stateManager = new StateManager(state);
        const mySideManager = stateManager.getMySideManager();
        const nothingToSee: Card = {
            cardId: 'OmegaCodex-100',
            deckId: 'Whatever',
        };
        const hand = mySideManager.hand;
        hand.push(nothingToSee);

        const deed: Deed = {
            type: DeedType.PLAY,
            handIndex: 0,
            lineIndex: null,
            arsenalIndex: null,
        };
        doDeed(state, deed);
        expect(hand.length).toEqual(0);
        const scored = mySideManager.scored;
        expect(scored.length).toEqual(1);
        expect(scored[0]).toEqual(nothingToSee);
    });
});
