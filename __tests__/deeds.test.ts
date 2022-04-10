import { AvailableDeedsGenerator } from '../src/deeds';
import { Card, CardWithState, State, Side } from '../src/models';
import { CardefPool } from '../src/pool';
import { createEmptySide } from '../src/side';
import { StateManager } from '../src/state';
import { DeedType, CardState } from '../src/types';

describe('getAvailableDeeds', () => {
    let state: State;
    let stateManager: StateManager;
    let myIndex: number;
    let enemyIndex: number;
    let availableDeedsGetter: AvailableDeedsGenerator;

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
        stateManager = new StateManager(state);
        const pool = CardefPool.getPool();
        availableDeedsGetter = new AvailableDeedsGenerator(stateManager, pool);
        myIndex = state.turnState.myIndex;
        enemyIndex = 1 - myIndex;
    });

    it('offers no deeds if hand and line are empty', () => {
        const deeds = availableDeedsGetter.getAvailableDeeds();
        expect(deeds.size).toEqual(0);
    });

    it('offers to play 1 Creature in hand to an empty line', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        state.sides[myIndex]?.hand.push(vix);
        const deeds = Array.from(availableDeedsGetter.getAvailableDeeds());
        expect(deeds.length).toEqual(1);
        expect(deeds[0]?.type).toEqual(DeedType.PLAY);
        expect(deeds[0]?.handIndex).toEqual(0);
        expect(deeds[0]?.lineIndex).toEqual(-1);
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
        const deeds = Array.from(availableDeedsGetter.getAvailableDeeds());
        expect(deeds.length).toEqual(2);
    });

    it('offers to play 2 Creatures in hand to an empty line', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        mySide.hand.push(vix);
        mySide.hand.push(vix);
        const deeds = Array.from(availableDeedsGetter.getAvailableDeeds());
        expect(deeds.length).toEqual(2);
    });

    it('does not offer fight if my Creature is Dormant', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        const readyVix: CardWithState = {
            card: vix,
            state: CardState.DORMANT,
        };
        mySide.line.push(readyVix);
        const deeds = Array.from(availableDeedsGetter.getAvailableDeeds());
        expect(deeds.length).toEqual(0);
    });

    it('does not offer fight if there are no targets', () => {
        const vix: Card = {
            cardId: 'OmegaCodex-001',
            deckId: 'bogus',
        };
        const readyVix: CardWithState = {
            card: vix,
            state: CardState.DORMANT,
        };

        const mySideManager = stateManager.getMySideManager();

        mySideManager.line.push(readyVix);
        const deeds = Array.from(availableDeedsGetter.getAvailableDeeds());
        expect(deeds.length).toEqual(0);
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
        const deeds = Array.from(availableDeedsGetter.getAvailableDeeds());
        expect(deeds.length).toEqual(2);
    });

    it('offers to play 2 Deeds in hand', () => {
        const duck: Card = {
            cardId: 'OmegaCodex-099',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        mySide.hand.push(duck);
        mySide.hand.push(duck);
        const deeds = Array.from(availableDeedsGetter.getAvailableDeeds());
        expect(deeds.length).toEqual(2);
    });

    it('offers to play 2 Relics in hand to a non-empty Arsenal', () => {
        const hypervator: Card = {
            cardId: 'OmegaCodex-058',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        const dormantHypervator: CardWithState = {
            card: hypervator,
            state: CardState.DORMANT,
        };
        mySide.arsenal.push(dormantHypervator);
        mySide.hand.push(hypervator);
        mySide.hand.push(hypervator);
        const deeds = Array.from(availableDeedsGetter.getAvailableDeeds());
        expect(deeds.length).toEqual(2);
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
        const deeds = Array.from(availableDeedsGetter.getAvailableDeeds());
        expect(deeds.length).toEqual(1);
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
        mySide.arsenal.push(matureHypervator);
        const deeds = Array.from(availableDeedsGetter.getAvailableDeeds());
        expect(deeds.length).toEqual(1);
    });

    it('offers discard if a card has been played', () => {
        const hypervator: Card = {
            cardId: 'OmegaCodex-058',
            deckId: 'bogus',
        };
        const mySide = state.sides[myIndex] as Side;
        mySide.hand.push(hypervator);
        const beforePlaying = Array.from(
            availableDeedsGetter.getAvailableDeeds()
        );
        expect(beforePlaying.length).toEqual(1);

        state.turnState.turnFlags.canDiscard = true;
        const afterPlaying = Array.from(
            availableDeedsGetter.getAvailableDeeds()
        );
        expect(afterPlaying.length).toEqual(2);
    });
});
