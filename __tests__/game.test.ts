import { Game } from '../src/game';
import { Player } from '../src/models';

describe('A Game', () => {
    it('Can be started', () => {
        const sig: Player = {
            name: 'Sig',
            deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
        };
        const marla: Player = {
            name: 'Marla',
            deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
        };
        const players = [sig, marla];
        const game = new Game(sig, marla);
        const state = game.state;
        expect(state.turnState.activePlayerIndex).toEqual(0);
        const statePlayers = state.sides.map((side) => {
            return side.player;
        });
        expect(statePlayers).toEqual(players);
        state.sides.forEach((side) => {
            expect(side.line.length).toEqual(2);
            expect(side.hand.length).toEqual(3);
            expect(side.discards.length + side.drawPile.length).toEqual(12);
            expect(side.scored.length).toEqual(0);
            expect(side.relics.length).toEqual(0);
        });
    });
});
