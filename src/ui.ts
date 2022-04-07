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

    deckList.contents.forEach((cardNumber) => {
        const fullId = `${deckList.setId}-${cardNumber}`;
        const cardef = pool.lookup(fullId);
        if (cardef) {
            console.log(`  ${fullId}: ${cardef.name}`);
        } else {
            console.log(`  --Card ${cardNumber} not found`);
        }
    });
}
