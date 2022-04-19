import { Game } from '../src/game';
import { Card, Player, Slot } from '../src/models';
import { SideManager } from '../src/side';
import { StateManager } from '../src/state';
import { CardId, Facing, Zone } from '../src/types';

const sig: Player = {
    name: 'Sig',
    deckId: '59bd26ac-7450-4f60-a0b0-44628a5b28d4',
};
const marla: Player = {
    name: 'Marla',
    deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
};

function createBogusReadyCard(cardId: CardId): Card {
    return {
        cardId,
        deckId: 'bogus',
        facing: Facing.READY,
    };
}

describe('calculateNextDecision', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game(sig, marla);
    });

    it('Follow-up for playing actions only offers scored', () => {
        const mySideManager = game.sideManagers[0] as SideManager;
        const nothingToSee = createBogusReadyCard('OmegaCodex-100');
        while (mySideManager.hand.length) {
            mySideManager.hand.pop();
        }
        mySideManager.hand.push(nothingToSee);
        while (mySideManager.line.length) {
            mySideManager.line.pop();
        }
        game.startTurn();

        {
            const state = game.getCopyOfState();
            expect(state.sides[0]?.hand.length).toEqual(1);
            expect(state.sides[0]?.line.length).toEqual(0);

            const stateManager = new StateManager(state);
            const topLevelDecision = stateManager.getCurrentDecision();
            expect(topLevelDecision.availableSlots.length).toEqual(1);
            const topLevelSlot = topLevelDecision.availableSlots[0] as Slot;
            game.applyDecision([topLevelSlot]);
        }

        {
            const state = game.getCopyOfState();
            const stateManager = new StateManager(state);
            const followUp = stateManager.getCurrentDecision();
            expect(followUp.availableSlots.length).toEqual(1);
            const dest = followUp.availableSlots[0] as Slot;
            expect(dest.zone).toEqual(Zone.MY_SCORED);
            expect(dest.index).toEqual(-1);
        }
    });
});
