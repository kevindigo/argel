import { Game } from '../src/game';
import { Player } from '../src/models';

const sig: Player = {
    name: 'Sig',
    deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
};
const marla: Player = {
    name: 'Marla',
    deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
};

describe('A Game', () => {
    it('can be started', () => {
        const game = new Game(sig, marla);
        game.getCopyOfStateWithOptions().sides.forEach((side) => {
            expect(side.line.length).toEqual(2);
            expect(side.hand.length).toEqual(3);
            expect(side.discards.length + side.drawPile.length).toEqual(12);
            expect(side.scored.length).toEqual(0);
            expect(side.arsenal.length).toEqual(0);
            expect(side.flags.canFight).toBeTruthy();
            expect(side.flags.canPlayActions).toBeTruthy();
            expect(side.flags.isNextCardActive).toBeFalsy();
        });
        const deed = game.getCopyOfStateWithOptions().currentDeed;
        expect(deed.decisions.length).toEqual(1);
        const decision = deed.decisions[0];
        expect(decision?.availableSlots.length).toEqual(3);
    });

    it('prevents mirror matches', () => {
        const sig2: Player = {
            name: 'Sig2',
            deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
        };
        expect(() => {
            new Game(sig, sig2);
        }).toThrowError();
    });
});
