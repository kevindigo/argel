import { CardefPool } from '../src/cards';
import { lookupDeckList } from '../src/decks';
import { initializeSide } from '../src/game';
import { CardState, CardType } from '../src/types';

describe('A game', () => {
    const pool = new CardefPool();

    it('can initialize a side', () => {
        const player = {
            name: 'Kevin',
            deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
        };
        const deckList = lookupDeckList(player.deckId);
        const setId = deckList?.setId;
        const sideManager = initializeSide(player);
        expect(sideManager.playerName()).toEqual(player.name);
        expect(sideManager.hand.length).toEqual(3);
        expect(sideManager.line.length).toEqual(2);
        sideManager.line.forEach((cardWithState) => {
            expect(cardWithState.state).toEqual(CardState.READY);
            const fullId = `${setId}-${cardWithState.card.id}`;
            const cardef = pool.lookup(fullId);
            expect(cardef?.type).toEqual(CardType.CREATURE);
        });
    });
});
