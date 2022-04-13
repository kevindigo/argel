import { Card, CardWithState, Deed, Slot, State } from './models';
import { CardefPool } from './pool';
import { StateManager } from './state';
import { CardState, CardType, DeedType, LineEnd, Zone } from './types';

function doPlayEffect(state: State, card: Card, choices?: Slot[][]): void {
    switch (card.cardId) {
        case 'OmegaCodex-063': {
            // direct deposit
            const stateManager = new StateManager(state);
            const mySideManager = stateManager.getMySideManager();
            if (!choices) {
                throw new Error('Attempted play without choices');
            }
            const firstChoices = choices[0] as Slot[];
            const moveToScored = firstChoices[0] as Slot;
            const chosenCards = mySideManager.hand.splice(
                moveToScored?.index,
                1
            );
            const cardToScore = chosenCards.shift() as Card;
            mySideManager.scored.push(cardToScore);
            break;
        }
        case 'OmegaCodex-086': {
            // overcharge
            const stateManager = new StateManager(state);
            const mySideManager = stateManager.getMySideManager();
            mySideManager.draw();
            mySideManager.draw();
            break;
        }
        case 'OmegaCodex-074': {
            // fast forward
            const stateManager = new StateManager(state);
            const mySideManager = stateManager.getMySideManager();
            const enemySideManager = stateManager.getEnemySideManager();

            mySideManager.line.forEach((cardWithState) => {
                cardWithState.state = CardState.MATURE;
            });

            enemySideManager.line.forEach((cardWithState) => {
                cardWithState.state = CardState.MATURE;
            });

            break;
        }
    }
}

function doDeedPlay(state: State, deed: Deed): void {
    const stateManager = new StateManager(state);
    const mySideManager = stateManager.getMySideManager();

    const from = deed.from.shift();
    if (from === null) {
        throw new Error(`Attempted to play with no from`);
    }
    if (from?.zone !== Zone.MY_HAND) {
        throw new Error(`Attempted to play from other than hand: ${from}`);
    }
    const handIndex = from?.index;

    const card = mySideManager.hand[handIndex] as Card;
    const pool = CardefPool.getPool();
    const cardef = pool.lookup(card.cardId);
    switch (cardef?.type) {
        case CardType.ACTION: {
            mySideManager.hand.splice(handIndex, 1);
            mySideManager.scored.push(card);
            doPlayEffect(state, card, deed.choices);
            break;
        }
        case CardType.CREATURE: {
            const to = deed.to.shift();
            if (!to) {
                throw new Error('Attempted to play Creature with no to');
            }
            if (to.zone !== Zone.MY_LINE) {
                throw new Error('Attempted to play Creature with no to');
            }
            const cardWithState: CardWithState = {
                card,
                state: CardState.DORMANT,
            };
            mySideManager.hand.splice(handIndex, 1);
            if (to.index === LineEnd.RIGHT) {
                mySideManager.line.push(cardWithState);
            } else {
                mySideManager.line.splice(to.index, 0, cardWithState);
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

function doFightPlay(state: State, deed: Deed): void {
    const stateManager = new StateManager(state);
    const attackers = deed.from;
    if (!attackers) {
        throw new Error(
            `Attempted a Fight with no attackers: ${JSON.stringify(deed)}`
        );
    }
    const defenders = deed.to;
    if (!defenders) {
        throw new Error(
            `Attempted a Fight with no defenders: ${JSON.stringify(deed)}`
        );
    }
    const myIndex = stateManager.getMyIndex();
    const attackPower = stateManager.getEffectivePower(myIndex, attackers);
    const mySideManager = stateManager.getMySideManager();
    const attackingCards = mySideManager.removeFromLine(attackers);

    const enemyIndex = stateManager.getEnemyIndex();
    const defensePower = stateManager.getEffectivePower(enemyIndex, defenders);
    const enemySideManager = stateManager.getEnemySideManager();
    const defendingCards = enemySideManager.removeFromLine(defenders);

    if (attackPower >= defensePower) {
        mySideManager.discards.push(...attackingCards);
        mySideManager.scored.push(...defendingCards);
    } else {
        enemySideManager.discards.push(...defendingCards);
        enemySideManager.scored.push(...attackingCards);
    }
}

export function doDeed(state: State, deed: Deed): void {
    switch (deed.type) {
        case DeedType.PLAY: {
            doDeedPlay(state, deed);
            break;
        }
        case DeedType.FIGHT: {
            doFightPlay(state, deed);
            break;
        }
        default:
            throw new Error(`Can't do deed of type ${deed.type}`);
    }
}
