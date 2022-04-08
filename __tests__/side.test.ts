import { CardefPool } from '../src/cards';
import { initializeSide } from '../src/side';
import { CardState, CardType, SideFlagKey } from '../src/types';

describe('Sides', () => {
    const pool = new CardefPool();

    it('can be initialized', () => {
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
            const cardef = pool.lookup(cardWithState.card.cardId);
            expect(cardef?.type).toEqual(CardType.CREATURE);
        });
        expect(sideManager.getFlag(SideFlagKey.CAN_ATTACK)).toBeTruthy();
        expect(sideManager.getFlag(SideFlagKey.CAN_PLAY_ACTIONS)).toBeTruthy();
        expect(sideManager.getFlag(SideFlagKey.NEXT_CARD_ACTIVE)).toBeFalsy();
    });
});
