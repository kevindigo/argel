import { lookupCardef } from './cards';
import { lookupDeckList } from './decks';
import { DeckId } from './types';

export function showDeck(deckId: DeckId): void {
    const deckList = lookupDeckList(deckId);
    if (!deckList) {
        console.log(`Deck ${deckId} was not found`);
        return;
    }
    console.log(deckList.name);
    console.log(`${deckList.set}: ${deckList.id}`);
    deckList.contents.forEach((cardId) => {
        const cardef = lookupCardef(cardId);
        if (cardef) {
            console.log(`  ${cardef.name}`);
        } else {
            console.log(`  --Card ${cardId} not found`);
        }
    });
}
