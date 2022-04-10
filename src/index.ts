import { createInitialState, Game } from './game';
import { Player } from './models';
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
const state = createInitialState(player1, player2);
const game = new Game(state);
game.startGame();
showState(game);
