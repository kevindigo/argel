import { Game } from './game';
import { Player } from './models';
import { StateManager } from './state';
import { showState } from './ui';

console.log('Argel');

const player1: Player = {
    name: 'Kevin',
    deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
};
const player2: Player = {
    name: 'Mel',
    deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
};

const game = new Game(player1, player2);
{
    const state = game.getCopyOfState();
    const stateManager = new StateManager(state);
    showState(state);
    const currentDecision = stateManager.getCurrentDecision();
    console.log(`Current decision: ${JSON.stringify(currentDecision)}`);

    const selectedSlot = currentDecision.availableSlots[0];
    if (!selectedSlot) {
        throw new Error(
            `Expected an available slot in ${JSON.stringify(
                currentDecision.availableSlots
            )}`
        );
    }

    console.log(`calling applyDecision ${JSON.stringify(selectedSlot)}`);
    game.applyDecision([selectedSlot]);
}

{
    const state = game.getCopyOfState();
    const stateManager = new StateManager(state);
    showState(state);
    const currentDecision = stateManager.getCurrentDecision();
    console.log(`Current decision: ${JSON.stringify(currentDecision)}`);
}
