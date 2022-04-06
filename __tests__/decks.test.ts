import { lookupDeckList } from '../src/decks';

describe('The deck pool', () => {
    it('Can lookup a known decklist', () => {
        const deckList = lookupDeckList('679a6701-d7c3-494e-becb-04e9178aca30');
        expect(deckList).toBeDefined();
        expect(deckList?.contents.length).toEqual(17);
    });

    it('Cannot lookup a decklist for an unknown id', () => {
        expect(
            lookupDeckList('66666666-6666-6666-6666-66666666666')
        ).toBeUndefined();
    });
});
