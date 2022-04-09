import { getAvailableActions } from '../src/actions';
import { createInitialGameState, Game } from '../src/game';
import { Player } from '../src/models';

const sig: Player = {
    name: 'Sig',
    deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
};
const marla: Player = {
    name: 'Marla',
    deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
};

describe('getAvailableActions', () => {
    it('knows the 10 actions available on the first turn of a normal game', () => {
        const state = createInitialGameState(sig, marla);
        const game = new Game(state);
        game.startGame();
        const actions = getAvailableActions(game);
        expect(actions.size).toEqual(10);
    });
});
