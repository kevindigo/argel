import { CardefPool } from '../src/pool';
import { lookupDeckList } from './decks';
import { State } from './models';
import { StateManager } from './state';
import { DeckId } from './types';

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
        const handCardNames = sm.hand.map((card) => {
            const cardef = pool.lookup(card.cardId);
            return cardef?.name;
        });
        console.log(`  Hand: ${handCardNames.join(', ')}`);

        const lineCardNames = sm.line.map((card) => {
            const cardef = pool.lookup(card.cardId);
            return `${cardef?.name} (${cardef?.power})`;
        });
        console.log(`  Line: ${lineCardNames.join(', ')}`);

        const arsenalCardNames = sm.arsenal.map((card) => {
            const cardef = pool.lookup(card.cardId);
            return cardef?.name;
        });
        console.log(`  Arsenal: ${arsenalCardNames.join(', ')}`);

        console.log();
    });
    const mySideManager = stateManager.getMySideManager();
    console.log(`Active player: ${mySideManager.playerName()}`);
    console.log(`currentDeed: ${JSON.stringify(state.currentDeed)}`);
    console.log();
}
