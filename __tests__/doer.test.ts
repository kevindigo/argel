import { doDeed } from '../src/doer';
import { Card, Deed, Player, State } from '../src/models';
import { SideManager } from '../src/side';
import { createInitialState, StateManager } from '../src/state';
import { CardNumber, CardState, DeedType } from '../src/types';

const sig: Player = {
    name: 'Sig',
    deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
};
const marla: Player = {
    name: 'Marla',
    deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
};

function createCard(cardNumber: CardNumber): Card {
    return {
        cardId: `OmegaCodex-${cardNumber}`,
        deckId: 'Whatever',
    };
}

describe('The deed doer', () => {
    let state: State;
    let stateManager: StateManager;
    let mySideManager: SideManager;

    beforeEach(() => {
        state = createInitialState(sig, marla);
        stateManager = new StateManager(state);
        mySideManager = stateManager.getMySideManager();
    });

    it('Can play an action with no Play effects', () => {
        const nothingToSee = createCard('100');
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
        expect(mySideManager.line.length).toEqual(0);
        expect(mySideManager.arsenal.length).toEqual(0);
        expect(mySideManager.discards.length).toEqual(0);
        expect(mySideManager.scored.length).toEqual(1);
        expect(mySideManager.drawPile.length).toEqual(17);

        const scored = mySideManager.scored;
        expect(scored[0]).toEqual(nothingToSee);

        expect(state.turnState.turnFlags.canDiscard).toBeTruthy();
    });

    it('Can play a Creature with no Play effects to an empty line', () => {
        const vix = createCard('001');
        const hand = mySideManager.hand;
        hand.push(vix);

        const deed: Deed = {
            type: DeedType.PLAY,
            handIndex: 0,
            lineIndex: 0,
            arsenalIndex: null,
        };
        doDeed(state, deed);
        expect(hand.length).toEqual(0);
        expect(mySideManager.line.length).toEqual(1);
        expect(mySideManager.arsenal.length).toEqual(0);
        expect(mySideManager.discards.length).toEqual(0);
        expect(mySideManager.scored.length).toEqual(0);
        expect(mySideManager.drawPile.length).toEqual(17);

        const line = mySideManager.line;
        const cardWithState = line[0];
        expect(cardWithState?.card).toEqual(vix);
        expect(cardWithState?.state).toEqual(CardState.DORMANT);

        expect(state.turnState.turnFlags.canDiscard).toBeTruthy();
    });
});
