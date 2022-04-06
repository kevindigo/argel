import { lookupCardTemplate } from './cards';
import { lookupDeck } from './decks';
import { DeckId } from './types';

export function showDeck(deckId: DeckId): void {
    const deck = lookupDeck(deckId);
    if (!deck) {
        console.log(`Deck ${deckId} was not found`);
        return;
    }
    console.log(deck.name);
    console.log(`${deck.set}: ${deck.id}`);
    deck.contents.forEach((cardId) => {
        const card = lookupCardTemplate(cardId);
        if (card) {
            console.log(`  ${card.name}`);
        } else {
            console.log(`  --Card ${cardId} not found`);
        }
    });
}
