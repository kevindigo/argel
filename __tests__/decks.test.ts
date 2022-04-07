import { createDeck, lookupDeckList } from '../src/decks';

const SAMPLE_DECK_ID = '679a6701-d7c3-494e-becb-04e9178aca30';

describe('The deck pool', () => {
    it('Can lookup a known decklist', () => {
        const deckList = lookupDeckList(SAMPLE_DECK_ID);
        expect(deckList).toBeDefined();
        expect(deckList?.contents.length).toEqual(17);
    });

    it('Cannot lookup a decklist for an unknown id', () => {
        expect(
            lookupDeckList('66666666-6666-6666-6666-66666666666')
        ).toBeUndefined();
    });

    it('can create a deck', () => {
        const deckList = lookupDeckList(SAMPLE_DECK_ID);
        if (!deckList) {
            throw new Error('Sample deck not found!?');
        }
        const deck = createDeck(deckList);
        expect(deck.length).toEqual(17);
    });
});
