import { OMEGA_CODEX } from './constants';
import { Card } from './models';
import { CardNumber, DeckId, SetId } from './types';

export interface DeckList {
    id: DeckId;
    setId: SetId;
    name: string;
    contents: CardNumber[]; // 17 cards
}

const marlaDeck: DeckList = {
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

const sigDeck: DeckList = {
    id: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
    setId: OMEGA_CODEX,
    name: 'Sigriðr the Frequent',
    contents: [
        '010',
        '010',
        '026',
        '027',
        '034',
        '036',
        '039',
        '048',
        '050',
        '051',
        '053',
        '054',
        '058',
        '066',
        '066',
        '067',
        '070',
    ],
};

export function lookupDeckList(deckId: DeckId): DeckList | undefined {
    if (deckId === marlaDeck.id) {
        return marlaDeck;
    }

    if (deckId === sigDeck.id) {
        return sigDeck;
    }

    return undefined;
}

export function createDeck(deckList: DeckList): Card[] {
    const deck: Card[] = deckList.contents.map((cardId) => {
        return {
            deckId: deckList.id,
            cardId,
        };
    });

    return deck;
}
