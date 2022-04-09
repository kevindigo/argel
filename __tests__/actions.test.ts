import { getAvailableActions } from '../src/actions';
import { Game } from '../src/game';
import { Card, CardWithState, GameState, Side } from '../src/models';
import { createEmptySide } from '../src/side';
import { ActionType, CardState } from '../src/types';

describe('getAvailableActions', () => {
    let state: GameState;
    let game: Game;
    let activePlayerIndex: number;
    let oppPlayerIndex: number;

    beforeEach(() => {
        state = {
            sides: [createEmptySide(), createEmptySide()],
            turnState: {
                activePlayerIndex: 0,
            },
        };
        game = new Game(state);
        activePlayerIndex = state.turnState.activePlayerIndex;
        oppPlayerIndex = 1 - activePlayerIndex;
    });

    it('offers no actions if hand and line are empty', () => {
        const actions = getAvailableActions(game);
        expect(actions.size).toEqual(0);
    });

    it('offers to play 1 Creature in hand to an empty line', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        state.sides[activePlayerIndex]?.hand.push(vix);
        const actions = Array.from(getAvailableActions(game));
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
        const mySide = state.sides[activePlayerIndex] as Side;
        const dormantVix: CardWithState = {
            card: vix,
            state: CardState.DORMANT,
        };
        mySide.line.push(dormantVix);
        mySide.hand.push(vix);
        const actions = Array.from(getAvailableActions(game));
        expect(actions.length).toEqual(2);
    });

    it('offers to play 2 Creatures in hand to an empty line', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const mySide = state.sides[activePlayerIndex] as Side;
        mySide.hand.push(vix);
        mySide.hand.push(vix);
        const actions = Array.from(getAvailableActions(game));
        expect(actions.length).toEqual(2);
    });

    it('offers 2 ways to attack with 1 creature against a line of 2', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const mySide = state.sides[activePlayerIndex] as Side;
        const readyVix: CardWithState = {
            card: vix,
            state: CardState.READY,
        };
        mySide.line.push(readyVix);
        const oppSide = state.sides[oppPlayerIndex] as Side;
        oppSide.line.push(readyVix);
        oppSide.line.push(readyVix);
        const actions = Array.from(getAvailableActions(game));
        expect(actions.length).toEqual(2);
    });

    it('offers to play 2 Actions in hand', () => {
        const duck: Card = {
            cardId: 'OmegaCodex-099',
            deckId: 'bogus',
        };
        const mySide = state.sides[activePlayerIndex] as Side;
        mySide.hand.push(duck);
        mySide.hand.push(duck);
        const actions = Array.from(getAvailableActions(game));
        expect(actions.length).toEqual(2);
    });

    it('offers to play 2 Relics in hand to a non-empty Relics', () => {
        const hypervator: Card = {
            cardId: 'OmegaCodex-058',
            deckId: 'bogus',
        };
        const mySide = state.sides[activePlayerIndex] as Side;
        const dormantHypervator: CardWithState = {
            card: hypervator,
            state: CardState.DORMANT,
        };
        mySide.relics.push(dormantHypervator);
        mySide.hand.push(hypervator);
        mySide.hand.push(hypervator);
        const actions = Array.from(getAvailableActions(game));
        expect(actions.length).toEqual(2);
        expect(actions[0]?.relicsIndex).toEqual(-1);
    });

    it('offers to harvest a mature Creature', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const mySide = state.sides[activePlayerIndex] as Side;
        const matureVix: CardWithState = {
            card: vix,
            state: CardState.MATURE,
        };
        mySide.line.push(matureVix);
        const actions = Array.from(getAvailableActions(game));
        expect(actions.length).toEqual(1);
    });

    it('offers to harvest a mature Relic', () => {
        const hypervator: Card = {
            cardId: 'OmegaCodex-058',
            deckId: 'bogus',
        };
        const mySide = state.sides[activePlayerIndex] as Side;
        const matureHypervator: CardWithState = {
            card: hypervator,
            state: CardState.MATURE,
        };
        mySide.relics.push(matureHypervator);
        const actions = Array.from(getAvailableActions(game));
        expect(actions.length).toEqual(1);
    });
});
