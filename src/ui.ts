import { getAvailableActions } from './actions';
import { CardefPool } from './cards';
import { lookupDeckList } from './decks';
import { Game } from './game';
import { Action } from './models';
import { DeckId } from './types';

function getActionString(action: Action): string {
    const parts: string[] = [];
    parts.push(action.type);
    if (action.handIndex != null) {
        parts.push(`MH${action.handIndex}`);
    }
    if (action.lineIndex !== null) {
        parts.push(`ML${action.lineIndex}`);
    }
    if (action.relicsIndex !== null) {
        parts.push(`MR${action.relicsIndex}`);
    }
    if (action.attackers) {
        parts.push(`A${action.attackers}`);
    }
    if (action.defenders) {
        parts.push(`D${action.defenders}`);
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
    const activePlayerIndex = game.getActivePlayerIndex();
    console.log(
        `Active player: ${sideManagers[activePlayerIndex]?.playerName()}`
    );
    const availableActions = getAvailableActions(game);
    availableActions.forEach((action) => {
        console.log(getActionString(action));
    });
    console.log();
}
