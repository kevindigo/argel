import { getAvailableActions } from '../src/actions';
import { Card, CardWithState, GameState, Side } from '../src/models';
import { createEmptySide } from '../src/side';
import { ActionType, CardState } from '../src/types';

describe('getAvailableActions', () => {
    let state: GameState;
    let myIndex: number;
    let enemyIndex: number;

    beforeEach(() => {
        state = {
            sides: [createEmptySide(), createEmptySide()],
            turnState: {
                myIndex: 0,
                turnFlags: {
                    canDiscard: false,
                },
            },
        };
        myIndex = state.turnState.myIndex;
        enemyIndex = 1 - myIndex;
    });

    it('offers no actions if hand and line are empty', () => {
        const actions = getAvailableActions(state);
        expect(actions.size).toEqual(0);
    });

    it('offers to play 1 Creature in hand to an empty line', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        state.sides[myIndex]?.hand.push(vix);
        const actions = Array.from(getAvailableActions(state));
        expect(actions.length).toEqual(1);
        expect(actions[0]?.type).toEqual(ActionType.PLAY);
        expect(actions[0]?.handIndex).toEqual(0);
        expect(actions[0]?.lineIndex).toEqual(-1);
    });

    it('offers 2 ways to play 1 Creature in hand to a non-empty line', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        const dormantVix: CardWithState = {
            card: vix,
            state: CardState.DORMANT,
        };
        mySide.line.push(dormantVix);
        mySide.hand.push(vix);
        const actions = Array.from(getAvailableActions(state));
        expect(actions.length).toEqual(2);
    });

    it('offers to play 2 Creatures in hand to an empty line', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        mySide.hand.push(vix);
        mySide.hand.push(vix);
        const actions = Array.from(getAvailableActions(state));
        expect(actions.length).toEqual(2);
    });

    it('offers 2 ways to fight with 1 creature against a line of 2', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        const readyVix: CardWithState = {
            card: vix,
            state: CardState.READY,
        };
        mySide.line.push(readyVix);
        const enemySide = state.sides[enemyIndex] as Side;
        enemySide.line.push(readyVix);
        enemySide.line.push(readyVix);
        const actions = Array.from(getAvailableActions(state));
        expect(actions.length).toEqual(2);
    });

    it('offers to play 2 Actions in hand', () => {
        const duck: Card = {
            cardId: 'OmegaCodex-099',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        mySide.hand.push(duck);
        mySide.hand.push(duck);
        const actions = Array.from(getAvailableActions(state));
        expect(actions.length).toEqual(2);
    });

    it('offers to play 2 Relics in hand to a non-empty Relics', () => {
        const hypervator: Card = {
            cardId: 'OmegaCodex-058',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        const dormantHypervator: CardWithState = {
            card: hypervator,
            state: CardState.DORMANT,
        };
        mySide.relics.push(dormantHypervator);
        mySide.hand.push(hypervator);
        mySide.hand.push(hypervator);
        const actions = Array.from(getAvailableActions(state));
        expect(actions.length).toEqual(2);
        expect(actions[0]?.relicsIndex).toEqual(-1);
    });

    it('offers to harvest a mature Creature', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        const matureVix: CardWithState = {
            card: vix,
            state: CardState.MATURE,
        };
        mySide.line.push(matureVix);
        const actions = Array.from(getAvailableActions(state));
        expect(actions.length).toEqual(1);
    });

    it('offers to harvest a mature Relic', () => {
        const hypervator: Card = {
            cardId: 'OmegaCodex-058',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        const matureHypervator: CardWithState = {
            card: hypervator,
            state: CardState.MATURE,
        };
        mySide.relics.push(matureHypervator);
        const actions = Array.from(getAvailableActions(state));
        expect(actions.length).toEqual(1);
    });

    it('offers discard if a card has been played', () => {
        const hypervator: Card = {
            cardId: 'OmegaCodex-058',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        mySide.hand.push(hypervator);
        const beforePlaying = Array.from(getAvailableActions(state));
        expect(beforePlaying.length).toEqual(1);

        state.turnState.turnFlags.canDiscard = true;
        const afterPlaying = Array.from(getAvailableActions(state));
        expect(afterPlaying.length).toEqual(2);
    });
});
