import { CardefPool } from '../src/pool';
import { createInitialSide, SideManager } from '../src/side';
import { CardState, CardType } from '../src/types';

describe('Sides', () => {
    const pool = new CardefPool();

    it('can be initialized', () => {
        const player = {
            name: 'Kevin',
            deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
        };
        const sideManager = new SideManager(createInitialSide(player));
        expect(sideManager.playerName()).toEqual(player.name);
        expect(sideManager.hand.length).toEqual(0);
        expect(sideManager.line.length).toEqual(0);
        expect(sideManager.discards.length).toEqual(0);
        expect(sideManager.drawPile.length).toEqual(17);
        sideManager.line.forEach((cardWithState) => {
            expect(cardWithState.state).toEqual(CardState.READY);
            const cardef = pool.lookup(cardWithState.card.cardId);
            expect(cardef?.type).toEqual(CardType.CREATURE);
        });
    });
});
