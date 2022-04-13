import { createDeck, lookupDeckList } from './decks';
import { Card, Player, Side, Slot } from './models';

export class SideManager {
    private _side: Side;

    public constructor(side: Side) {
        this._side = side;
    }

    public draw(count = 1): void {
        if (count > 1) {
            this.draw(count - 1);
        }

        const card = this.side.drawPile.pop();
        if (!card) {
            // TODO: Need to handle an empty deck
            throw new Error('Need to shuffle!');
        }

        this.side.hand.push(card);
    }

    public playerName(): string {
        return this.side.player.name;
    }

    public get side() {
        return this._side;
    }

    public get drawPile() {
        return this.side.drawPile;
    }

    public get hand() {
        return this.side.hand;
    }

    public get discards() {
        return this.side.discards;
    }

    public get line() {
        return this.side.line;
    }

    public get arsenal() {
        return this.side.arsenal;
    }

    public get scored() {
        return this.side.scored;
    }

    public removeFromLine(slots: Slot[]): Card[] {
        // ToDo: Ensure all slots are in the same zone
        const indexes = slots.map((slot) => {
            return slot.index;
        });
        indexes.sort().reverse();
        const cards = indexes.map((index) => {
            const cardWithState = this.line.splice(index, 1).pop();
            if (!cardWithState) {
                throw new Error(
                    `failed to remove ${JSON.stringify(
                        slots
                    )} from ${JSON.stringify(this.line)}`
                );
            }
            return cardWithState.card;
        });
        return cards;
    }
}

export function createInitialSide(player: Player): Side {
    const deckList = lookupDeckList(player.deckId);
    if (!deckList) {
        throw new Error('Sample deck not found!?');
    }
    const deck = createDeck(deckList);

    const side: Side = {
        player,
        drawPile: deck,
        hand: [],
        scored: [],
        discards: [],
        line: [],
        arsenal: [],
        flags: {
            canFight: false,
            canPlayActions: false,
            isNextCardActive: false,
        },
    };

    return side;
}

export function createEmptySide(): Side {
    return {
        player: {
            name: 'n/a',
            deckId: 'bogus',
        },
        discards: [],
        drawPile: [],
        flags: {
            canFight: true,
            canPlayActions: true,
            isNextCardActive: false,
        },
        hand: [],
        line: [],
        arsenal: [],
        scored: [],
    };
}
