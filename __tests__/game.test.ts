import { lookupCardTemplate } from '../src/cards';
import { initializeSide } from '../src/game';
import { CardState, CardType } from '../src/types';

describe('A game', () => {
    it('can initialize a side', () => {
        const player = {
            name: 'Kevin',
            deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
        };
        const sideManager = initializeSide(player);
        expect(sideManager.playerName()).toEqual(player.name);
        expect(sideManager.hand.length).toEqual(3);
        expect(sideManager.line.length).toEqual(2);
        sideManager.line.forEach((cardWithState) => {
            expect(cardWithState.state).toEqual(CardState.READY);
            const cardef = lookupCardTemplate(cardWithState.card.id);
            expect(cardef?.type).toEqual(CardType.CREATURE);
        });
    });
});
