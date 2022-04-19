import { Player } from '../src/models';
import { createInitialState, StateManager } from '../src/state';

const sig: Player = {
    name: 'Sig',
    deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
};
const marla: Player = {
    name: 'Marla',
    deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
};

describe('createInitialState', () => {
    it('works', () => {
        const state = createInitialState(sig, marla);
        const statePlayers = state.sides.map((side) => {
            return side.player;
        });
        expect(statePlayers).toEqual([sig, marla]);
    });
});

describe('stateManager', () => {
    it('throws if the last decision remains incomplete', () => {
        const state = createInitialState(sig, marla);
        const stateManager = new StateManager(state);
        expect(() => stateManager.calculateNextDecision(state)).toThrowError();
    });
});
