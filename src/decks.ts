import { OMEGA_CODEX } from './constants';
import { Card } from './models';
import { CardId, CardNumber, DeckId, SetId } from './types';

export class DeckList {
    private _id: DeckId;
    private _setId: SetId;
    private _name: string;
    private cardNumbers: CardNumber[]; // 17 cards

    public constructor(
        id: DeckId,
        setId: SetId,
        name: string,
        cardNumbers: CardNumber[]
    ) {
        this._id = id;
        this._setId = setId;
        this._name = name;
        this.cardNumbers = cardNumbers;
    }

    public get id(): DeckId {
        return this._id;
    }

    public get setId(): SetId {
        return this._setId;
    }

    public get name(): string {
        return this._name;
    }

    public get cardIds(): CardId[] {
        return this.cardNumbers.map((cardNumber) => {
            return `${this.setId}-${cardNumber}`;
        });
    }
}

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
    const deck: Card[] = deckList.cardIds.map((cardId) => {
        return {
            deckId: deckList.id,
            cardId,
        };
    });

    return deck;
}

const marlaDeck = new DeckList(
    '679a6701-d7c3-494e-becb-04e9178aca30',
    OMEGA_CODEX,
    'Marla "Buff" Grafani',
    [
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
    ]
);

const sigDeck = new DeckList(
    '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
    OMEGA_CODEX,
    'Sigriðr the Frequent',
    [
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
    ]
);
