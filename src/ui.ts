import { CardefPool } from './cards';
import { lookupDeckList } from './decks';
import { Game } from './game';
import { Deed } from './models';
import { DeckId } from './types';

function getDeedString(deed: Deed): string {
    const parts: string[] = [];
    parts.push(deed.type);
    if (deed.handIndex != null) {
        parts.push(`MH${deed.handIndex}`);
    }
    if (deed.lineIndex !== null) {
        parts.push(`ML${deed.lineIndex}`);
    }
    if (deed.relicsIndex !== null) {
        parts.push(`MR${deed.relicsIndex}`);
    }
    if (deed.attackers) {
        parts.push(`F${deed.attackers}`);
    }
    if (deed.defenders) {
        parts.push(`D${deed.defenders}`);
    }
    return parts.join(' ');
}

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
        const lineCardNames = sm.line.map((cardWithState) => {
            const cardef = game.pool.lookup(cardWithState.card.cardId);
            return `${cardef?.name} (${cardef?.power})`;
        });
        console.log(`Line: ${lineCardNames.join(', ')}`);
        const handCardNames = sm.hand.map((cardWithState) => {
            const cardef = game.pool.lookup(cardWithState.cardId);
            return cardef?.name;
        });
        console.log(`Hand: ${handCardNames.join(', ')}`);
        console.log();
    });
    const myIndex = game.getMyIndex();
    console.log(`Active player: ${sideManagers[myIndex]?.playerName()}`);
    const availableDeeds = game.getCopyOfStateWithOptions().options || [];
    availableDeeds.forEach((deed) => {
        console.log(getDeedString(deed));
    });
    console.log();
}
