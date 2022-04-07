import { CardefPool } from './cards';
import { lookupDeckList } from './decks';
import { DeckId } from './types';

export function showDeck(deckId: DeckId): void {
    const deckList = lookupDeckList(deckId);
    if (!deckList) {
        console.log(`Deck ${deckId} was not found`);
        return;
    }
    console.log(deckList.name);
    console.log(`${deckList.setId}: ${deckList.id}`);

    const pool = new CardefPool();

    deckList.cardIds.forEach((cardId) => {
        const cardef = pool.lookup(cardId);
        if (cardef) {
            console.log(`  ${cardId}: ${cardef.name}`);
        } else {
            console.log(`  --Card ${cardId} not found`);
        }
    });
}
