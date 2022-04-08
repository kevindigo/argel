import { CardefPool } from './cards';
import { lookupDeckList } from './decks';
import { Game } from './game';
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

export function showGameState(game: Game): void {
    const sideManagers = game.sideManagers;
    sideManagers.forEach((sm) => {
        const deckId = sm.side.player.deckId;
        console.log(`${sm.playerName()}: ${lookupDeckList(deckId)?.name}`);
        const cardNames = sm.line.map((cardWithState) => {
            const cardef = game.pool.lookup(cardWithState.card.cardId);
            return `${cardef?.name} (${cardef?.power})`;
        });
        console.log(cardNames.join(', '));
        console.log();
    });
    const activePlayerIndex = game.state.turnState.activePlayerIndex;
    console.log(
        `Active player: ${sideManagers[activePlayerIndex]?.playerName()}`
    );
    console.log();
}
