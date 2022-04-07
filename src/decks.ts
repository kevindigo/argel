import { OMEGA_CODEX } from './constants';
import { Card, DeckList } from './models';
import { DeckId } from './types';

const sampleDeck1: DeckList = {
    id: '679a6701-d7c3-494e-becb-04e9178aca30',
    setId: OMEGA_CODEX,
    name: 'Marla "Buff" Grafani',
    contents: [
        '002',
        '026',
        '029',
        '030',
        '038',
        '041',
        '044',
        '044',
        '048',
        '058',
        '071',
        '076',
        '077',
        '084',
        '088',
        '089',
        '099',
    ],
};

export function lookupDeckList(deckId: DeckId): DeckList | undefined {
    if (deckId === sampleDeck1.id) {
        return sampleDeck1;
    }

    return undefined;
}

export function createDeck(deckList: DeckList): Card[] {
    const deck: Card[] = deckList.contents.map((cardId) => {
        return {
            deckId: deckList.id,
            id: cardId,
        };
    });

    return deck;
}
