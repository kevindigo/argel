import { CardefPool } from './cards';
import { createDeck, lookupDeckList } from './decks';
import { CardWithState, Player, Side } from './models';
import { CardState, CardType } from './types';

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
}

export function initializeSide(player: Player): SideManager {
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
        relics: [],
    };

    const manager = new SideManager(side);
    const pool = new CardefPool();

    // TODO: Shuffle (which will break my tests)

    while (manager.line.length < 2) {
        const card = manager.drawPile.pop();
        if (!card) {
            throw new Error('Drawdeck empty!?');
        }
        const cardef = pool.lookup(card.cardId);
        if (cardef?.type === CardType.CREATURE) {
            const readyCard: CardWithState = {
                card,
                state: CardState.READY,
            };
            manager.line.push(readyCard);
        } else {
            manager.discards.push(card);
        }
    }

    manager.draw(3);

    return manager;
}
