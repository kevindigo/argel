import { Card, Slot } from '../src/models';
import { CardefPool } from '../src/pool';
import { createInitialSide, SideManager } from '../src/side';
import { CardNumber, Facing, CardType, Zone } from '../src/types';

function createCard(cardNumber: CardNumber): Card {
    return {
        cardId: `OmegaCodex-${cardNumber}`,
        deckId: 'Whatever',
        facing: Facing.READY,
    };
}

function createCardWithFacing(cardNumber: CardNumber, facing: Facing): Card {
    const card = createCard(cardNumber);
    card.facing = facing;
    return card;
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
        sideManager.line.forEach((cardWithFacing) => {
            expect(cardWithFacing.facing).toEqual(Facing.READY);
            const cardef = pool.lookup(cardWithFacing.cardId);
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

        const vix = createCardWithFacing('OmegaCodex-001', Facing.READY);
        const jater = createCardWithFacing('OmegaCodex-002', Facing.READY);
        const luminate = createCardWithFacing('OmegaCodex-003', Facing.READY);
        const budge = createCardWithFacing('OmegaCodex-004', Facing.READY);
        sideManager.line.push(vix);
        sideManager.line.push(jater);
        sideManager.line.push(luminate);
        sideManager.line.push(budge);

        const slotsToRemove: Slot[] = [
            { zone: Zone.MY_LINE, index: 1 },
            { zone: Zone.MY_LINE, index: 3 },
        ];
        const removed = sideManager.removeFromLine(slotsToRemove);
        expect(removed).toEqual([budge, jater]);
        expect(sideManager.line).toEqual([vix, luminate]);
    });
});
