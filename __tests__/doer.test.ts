import { doDeed } from '../src/doer';
import { Card, CardWithState, Deed, Player, State } from '../src/models';
import { SideManager } from '../src/side';
import { createInitialState, StateManager } from '../src/state';
import { CardNumber, CardState, DeedType, LineEnd } from '../src/types';

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

function createCardWithState(
    cardNumber: CardNumber,
    cardState: CardState
): CardWithState {
    const card = createCard(cardNumber);
    return {
        card,
        state: cardState,
    };
}

let state: State;
let stateManager: StateManager;
let mySideManager: SideManager;
let enemySideManager: SideManager;

beforeEach(() => {
    state = createInitialState(sig, marla);
    stateManager = new StateManager(state);
    mySideManager = stateManager.getMySideManager();
    enemySideManager = stateManager.getEnemySideManager();
});

describe('The deed doer', () => {
    it('Can play an action with no Play effects', () => {
        const nothingToSee = createCard('100');
        const hand = mySideManager.hand;
        hand.push(nothingToSee);

        const deed: Deed = {
            type: DeedType.PLAY,
            handIndex: 0,
            lineIndex: null,
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

    it('Can play a Relic with no Play effects to an empty arsenal', () => {
        const hypervator = createCard('058');
        const hand = mySideManager.hand;
        hand.push(hypervator);

        const deed: Deed = {
            type: DeedType.PLAY,
            handIndex: 0,
            lineIndex: null,
        };
        doDeed(state, deed);
        expect(hand.length).toEqual(0);
        expect(mySideManager.line.length).toEqual(0);
        expect(mySideManager.arsenal.length).toEqual(1);
        expect(mySideManager.discards.length).toEqual(0);
        expect(mySideManager.scored.length).toEqual(0);
        expect(mySideManager.drawPile.length).toEqual(17);

        const arsenal = mySideManager.arsenal;
        const cardWithState = arsenal[0];
        expect(cardWithState?.card).toEqual(hypervator);
        expect(cardWithState?.state).toEqual(CardState.DORMANT);

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

    it('Can play a Creature with no Play effects to the left side of a line', () => {
        const jater = createCard('002');
        const jaterDormant: CardWithState = {
            card: jater,
            state: CardState.MATURE,
        };
        const line = mySideManager.line;
        line.push(jaterDormant);

        const vix = createCard('001');
        const hand = mySideManager.hand;
        hand.push(vix);

        const deed: Deed = {
            type: DeedType.PLAY,
            handIndex: 0,
            lineIndex: LineEnd.LEFT,
        };
        doDeed(state, deed);
        expect(hand.length).toEqual(0);
        expect(mySideManager.line.length).toEqual(2);
        expect(mySideManager.arsenal.length).toEqual(0);
        expect(mySideManager.discards.length).toEqual(0);
        expect(mySideManager.scored.length).toEqual(0);
        expect(mySideManager.drawPile.length).toEqual(17);

        const vixWithState = line[0];
        expect(vixWithState?.card).toEqual(vix);
        expect(vixWithState?.state).toEqual(CardState.DORMANT);

        expect(line[1]).toEqual(jaterDormant);

        expect(state.turnState.turnFlags.canDiscard).toBeTruthy();
    });

    it('Can play a Creature with no Play effects to the right side of a line', () => {
        const jater = createCard('002');
        const jaterDormant: CardWithState = {
            card: jater,
            state: CardState.MATURE,
        };
        const line = mySideManager.line;
        line.push(jaterDormant);

        const vix = createCard('001');
        const hand = mySideManager.hand;
        hand.push(vix);

        const deed: Deed = {
            type: DeedType.PLAY,
            handIndex: 0,
            lineIndex: LineEnd.RIGHT,
        };
        doDeed(state, deed);
        expect(hand.length).toEqual(0);
        expect(mySideManager.line.length).toEqual(2);
        expect(mySideManager.arsenal.length).toEqual(0);
        expect(mySideManager.discards.length).toEqual(0);
        expect(mySideManager.scored.length).toEqual(0);
        expect(mySideManager.drawPile.length).toEqual(17);

        const rightCard = line[1];
        expect(rightCard?.card).toEqual(vix);
        expect(rightCard?.state).toEqual(CardState.DORMANT);

        expect(line[0]).toEqual(jaterDormant);

        expect(state.turnState.turnFlags.canDiscard).toBeTruthy();
    });

    it('Can fight and win', () => {
        const jaterDormant = createCardWithState('002', CardState.DORMANT);
        const enemyLine = enemySideManager.line;
        enemyLine.push(jaterDormant);

        const renegadeReady = createCardWithState('041', CardState.READY);
        const myLine = mySideManager.line;
        myLine.push(renegadeReady);

        const deed: Deed = {
            type: DeedType.FIGHT,
            handIndex: null,
            lineIndex: null,
            attackers: [0],
            defenders: [0],
        };

        doDeed(state, deed);
        expect(mySideManager.hand.length).toEqual(0);
        expect(mySideManager.line.length).toEqual(0);
        expect(mySideManager.arsenal.length).toEqual(0);
        expect(mySideManager.discards.length).toEqual(1);
        expect(mySideManager.scored.length).toEqual(1);
        expect(mySideManager.drawPile.length).toEqual(17);

        expect(enemySideManager.line.length).toEqual(0);
        expect(enemySideManager.discards.length).toEqual(0);
        expect(enemySideManager.scored.length).toEqual(0);
    });

    it('Can fight and lose', () => {
        const jaterReady = createCardWithState('002', CardState.READY);
        const myLine = mySideManager.line;
        myLine.push(jaterReady);

        const renegadeDormant = createCardWithState('041', CardState.DORMANT);
        const enemyLine = enemySideManager.line;
        enemyLine.push(renegadeDormant);

        const deed: Deed = {
            type: DeedType.FIGHT,
            handIndex: null,
            lineIndex: null,
            attackers: [0],
            defenders: [0],
        };

        doDeed(state, deed);
        expect(mySideManager.hand.length).toEqual(0);
        expect(mySideManager.line.length).toEqual(0);
        expect(mySideManager.arsenal.length).toEqual(0);
        expect(mySideManager.discards.length).toEqual(0);
        expect(mySideManager.scored.length).toEqual(0);
        expect(mySideManager.drawPile.length).toEqual(17);

        expect(enemySideManager.line.length).toEqual(0);
        expect(enemySideManager.discards.length).toEqual(1);
        expect(enemySideManager.scored.length).toEqual(1);
    });
});

describe('Individual card Play effects', () => {
    it('can play overcharge (an automatic play effect)', () => {
        const overcharge = createCard('086');
        const hand = mySideManager.hand;
        hand.push(overcharge);

        const deed: Deed = {
            type: DeedType.PLAY,
            handIndex: 0,
            lineIndex: null,
        };
        doDeed(state, deed);

        expect(hand.length).toEqual(2);
        expect(mySideManager.line.length).toEqual(0);
        expect(mySideManager.arsenal.length).toEqual(0);
        expect(mySideManager.discards.length).toEqual(0);
        expect(mySideManager.scored.length).toEqual(1);
        expect(mySideManager.drawPile.length).toEqual(15);

        const scored = mySideManager.scored;
        expect(scored[0]).toEqual(overcharge);
    });

    it('can play fast forward (an automatic play effect)', () => {
        const fastForward = createCard('074');
        const hand = mySideManager.hand;
        hand.push(fastForward);

        const myVix = createCardWithState('001', CardState.DORMANT);
        mySideManager.line.push(myVix);
        const enemyJater = createCardWithState('002', CardState.READY);
        enemySideManager.line.push(enemyJater);

        const deed: Deed = {
            type: DeedType.PLAY,
            handIndex: 0,
            lineIndex: null,
        };
        doDeed(state, deed);

        expect(hand.length).toEqual(0);
        expect(mySideManager.line.length).toEqual(1);
        expect(mySideManager.arsenal.length).toEqual(0);
        expect(mySideManager.discards.length).toEqual(0);
        expect(mySideManager.scored.length).toEqual(1);
        expect(mySideManager.drawPile.length).toEqual(17);

        const scored = mySideManager.scored;
        expect(scored[0]).toEqual(fastForward);

        expect(mySideManager.line[0]?.state).toEqual(CardState.MATURE);

        expect(enemySideManager.line.length).toEqual(1);
        expect(enemySideManager.line[0]?.state).toEqual(CardState.MATURE);
    });

    it.skip('can play direct deposit (a play effect with a simple choice)', () => {
        const directDeposit = createCard('063');
        const hand = mySideManager.hand;
        hand.push(directDeposit);

        const myVix = createCard('001');
        hand.push(myVix);
        const myJater = createCard('002');
        hand.push(myJater);

        const deed: Deed = {
            type: DeedType.PLAY,
            handIndex: 0,
            lineIndex: null,
        };
        doDeed(state, deed);
        fail();
    });
});
