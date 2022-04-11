import { Card, CardWithState } from '../src/models';
import { CardefPool } from '../src/pool';
import { createInitialSide, SideManager } from '../src/side';
import { CardNumber, CardState, CardType } from '../src/types';

function createCard(cardNumber: CardNumber): Card {
    return {
        cardId: `OmegaCodex-${cardNumber}`,
        deckId: 'Whatever',
    };
}

function createCardWithState(
    cardNumber: CardNumber,
    cardState: CardState
): CardWithState {
    const card = createCard(cardNumber);
    return {
        card,
        state: cardState,
    };
}

describe('Sides', () => {
    const pool = CardefPool.getPool();

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

describe('StateManager.removeFromLine', () => {
    it('can remove cards from the middle of the line', () => {
        const player = {
            name: 'Kevin',
            deckId: '679a6701-d7c3-494e-becb-04e9178aca30',
        };
        const sideManager = new SideManager(createInitialSide(player));

        const vix = createCardWithState('OmegaCodex-001', CardState.READY);
        const jater = createCardWithState('OmegaCodex-002', CardState.READY);
        const luminate = createCardWithState('OmegaCodex-003', CardState.READY);
        const budge = createCardWithState('OmegaCodex-004', CardState.READY);
        sideManager.line.push(vix);
        sideManager.line.push(jater);
        sideManager.line.push(luminate);
        sideManager.line.push(budge);

        const removed = sideManager.removeFromLine([1, 3]);
        expect(removed).toEqual([budge.card, jater.card]);
        expect(sideManager.line).toEqual([vix, luminate]);
    });
});
