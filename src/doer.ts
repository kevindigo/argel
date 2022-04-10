import { Card, CardWithState, Deed, State } from './models';
import { CardefPool } from './pool';
import { StateManager } from './state';
import { CardState, CardType, DeedType, LineEnd } from './types';

function doDeedPlay(state: State, deed: Deed): void {
    const stateManager = new StateManager(state);
    const mySideManager = stateManager.getMySideManager();

    const handIndex = deed.handIndex;
    if (handIndex === null) {
        throw new Error(`Attempted to play with no handIndex`);
    }

    const card = mySideManager.hand[handIndex] as Card;
    const pool = CardefPool.getPool();
    const cardef = pool.lookup(card.cardId);
    switch (cardef?.type) {
        case CardType.ACTION: {
            mySideManager.hand.splice(handIndex, 1);
            mySideManager.scored.push(card);
            break;
        }
        case CardType.CREATURE: {
            const lineIndex = deed.lineIndex;
            if (lineIndex === null) {
                throw new Error('Attempted to play Creature with no lineIndex');
            }
            const cardWithState: CardWithState = {
                card,
                state: CardState.DORMANT,
            };
            mySideManager.hand.splice(handIndex, 1);
            if (lineIndex === LineEnd.RIGHT) {
                mySideManager.line.push(cardWithState);
            } else {
                mySideManager.line.splice(lineIndex, 0, cardWithState);
            }
            break;
        }
        case CardType.RELIC: {
            const cardWithState: CardWithState = {
                card,
                state: CardState.DORMANT,
            };
            mySideManager.hand.splice(handIndex, 1);
            mySideManager.arsenal.push(cardWithState);
            break;
        }
        default:
            throw new Error(
                `Attempted to play card ${card.cardId} of unknown type ${cardef?.type}`
            );
    }

    state.turnState.turnFlags.canDiscard = true;
}

export function doDeed(state: State, deed: Deed): void {
    switch (deed.type) {
        case DeedType.PLAY: {
            doDeedPlay(state, deed);
            break;
        }
        default:
            throw new Error(`Can't do deed of type ${deed.type}`);
    }
}
