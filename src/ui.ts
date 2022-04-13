import { CardefPool } from '../src/pool';
import { lookupDeckList } from './decks';
import { AvailableDeedsGenerator } from './deeds';
import { Deed, State } from './models';
import { StateManager } from './state';
import { DeckId } from './types';

function getDeedString(deed: Deed): string {
    const parts: string[] = [];
    parts.push(deed.type);
    parts.push(`${JSON.stringify(deed.from)}`);
    if (deed.lineIndex !== null) {
        parts.push(`ML${deed.lineIndex}`);
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

    const pool = CardefPool.getPool();

    deckList.cardIds.forEach((cardId) => {
        const cardef = pool.lookup(cardId);
        if (cardef) {
            console.log(`  ${cardId}: ${cardef.name}`);
        } else {
            console.log(`  --Card ${cardId} not found`);
        }
    });
}

export function showState(state: State): void {
    const stateManager = new StateManager(state);
    const sideManagers = [
        stateManager.getMySideManager(),
        stateManager.getEnemySideManager(),
    ];
    const pool = CardefPool.getPool();

    sideManagers.forEach((sm) => {
        const deckId = sm.side.player.deckId;
        console.log(`${sm.playerName()}: ${lookupDeckList(deckId)?.name}`);
        const lineCardNames = sm.line.map((cardWithState) => {
            const cardef = pool.lookup(cardWithState.card.cardId);
            return `${cardef?.name} (${cardef?.power})`;
        });
        console.log(`Line: ${lineCardNames.join(', ')}`);
        const handCardNames = sm.hand.map((cardWithState) => {
            const cardef = pool.lookup(cardWithState.cardId);
            return cardef?.name;
        });
        console.log(`Hand: ${handCardNames.join(', ')}`);
        console.log();
    });
    const mySideManager = stateManager.getMySideManager();
    console.log(`Active player: ${mySideManager.playerName()}`);
    const generator = new AvailableDeedsGenerator(stateManager, pool);
    const availableDeeds = generator.getAvailableDeeds();
    availableDeeds.forEach((deed) => {
        console.log(getDeedString(deed));
    });
    console.log();
}
