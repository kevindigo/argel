import { Card, Deed, Player, State } from '../src/models';
import { getNextOptionsForDeed } from '../src/options';
import { SideManager } from '../src/side';
import { createInitialState, StateManager } from '../src/state';
import { CardNumber, DeedType, Zone } from '../src/types';

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

// function createCardWithState(
//     cardNumber: CardNumber,
//     cardState: CardState
// ): CardWithState {
//     const card = createCard(cardNumber);
//     return {
//         card,
//         state: cardState,
//     };
// }

let state: State;
let stateManager: StateManager;
let mySideManager: SideManager;
// let enemySideManager: SideManager;

beforeEach(() => {
    state = createInitialState(sig, marla);
    stateManager = new StateManager(state);
    mySideManager = stateManager.getMySideManager();
    // enemySideManager = stateManager.getEnemySideManager();
});

describe('getNextOptionsForDeed', () => {
    it('Knows not to provide options for automatic/no effects', () => {
        const directDeposit = createCard('063');
        const hand = mySideManager.hand;
        hand.push(directDeposit);
        const deed: Deed = {
            type: DeedType.PLAY,
            from: [{ zone: Zone.MY_HAND, index: 0 }],
            to: [],
            choices: [],
        };
        const options = getNextOptionsForDeed(state, deed);
        expect(options).toEqual([]);
    });

    it('Direct Deposit knows to ask for a hand slot', () => {
        const directDeposit = createCard('063');
        const hand = mySideManager.hand;
        hand.push(directDeposit);
        const myVix = createCard('001');
        hand.push(myVix);
        const myJater = createCard('002');
        hand.push(myJater);

        const deed: Deed = {
            type: DeedType.PLAY,
            from: [{ zone: Zone.MY_HAND, index: 0 }],
            to: [],
            choices: [[{ zone: Zone.MY_HAND, index: 0 }]],
        };
        const options = getNextOptionsForDeed(state, deed);
        expect(options.length).toEqual(2);
    });
});
