import { Cardef, CardefPool } from './cards';
import { Game } from './game';
import { Action } from './models';
import { SideManager } from './side';
import { ActionType, CardId, CardState, CardType } from './types';

function getActiveSideManager(game: Game): SideManager {
    const activePlayerIndex = game.state.turnState.activePlayerIndex;
    const activeSideManager = game.sideManagers[activePlayerIndex];
    if (!activeSideManager) {
        throw new Error('No active player???');
    }

    return activeSideManager;
}

function getCardef(pool: CardefPool, cardId: CardId): Cardef {
    const cardef = pool.lookup(cardId);
    if (!cardef) {
        throw new Error(`Card not in pool: ${cardId}`);
    }
    return cardef;
}

function getAvailablePlayActions(game: Game): Set<Action> {
    const available = new Set<Action>();

    const manager = getActiveSideManager(game);
    for (let i = 0; i < manager.hand.length; ++i) {
        const card = manager.hand[i];
        if (!card) {
            throw new Error(`Couldn't find card index ${i} in hand`);
        }
        const cardef = getCardef(game.pool, card.cardId);
        switch (cardef.type) {
            // case CardType.ACTION: {
            //     available.add({
            //         type: ActionType.PLAY,
            //         handIndex: i,
            //     });
            //     break;
            // }
            case CardType.CREATURE: {
                available.add({
                    type: ActionType.PLAY,
                    handIndex: i,
                    lineIndex: 0,
                    relicsIndex: null,
                });
                available.add({
                    type: ActionType.PLAY,
                    handIndex: i,
                    lineIndex: -1,
                    relicsIndex: null,
                });
                break;
            }
            // case CardType.RELIC: {
            //     available.add({
            //         type: ActionType.PLAY,
            //         handIndex: i,
            //     });
            //     break;
            // }
        }
    }

    return available;
}

function getAvailableAttackActions(game: Game): Set<Action> {
    const available = new Set<Action>();

    const manager = getActiveSideManager(game);
    for (
        let attackerIndex = 0;
        attackerIndex < manager.line.length;
        ++attackerIndex
    ) {
        const cardWithState = manager.line[attackerIndex];
        if (!cardWithState) {
            throw new Error(
                `Couldn't find card index ${attackerIndex} in my line`
            );
        }
        const cardef = getCardef(game.pool, cardWithState.card.cardId);
        if (cardef.type !== CardType.CREATURE) {
            continue;
        }
        if (cardWithState.state === CardState.DORMANT) {
            continue;
        }

        const oppSideIndex = 1 - game.state.turnState.activePlayerIndex;
        const oppManager = game.sideManagers[oppSideIndex];
        if (!oppManager) {
            throw new Error(`Couldn't find side manager[${oppSideIndex}]`);
        }
        for (
            let targetIndex = 0;
            targetIndex < oppManager.line.length;
            ++targetIndex
        ) {
            available.add({
                type: ActionType.ATTACK,
                handIndex: null,
                lineIndex: null,
                relicsIndex: null,
                attackers: [attackerIndex],
                defenders: [targetIndex],
            });
        }

        // ToDo: Implement BearHug
        // ToDo: Implement TeamUp
    }

    return available;
}

export function getAvailableActions(game: Game): Set<Action> {
    const available = new Set<Action>();

    const playActions = getAvailablePlayActions(game);
    playActions.forEach((action) => {
        available.add(action);
    });

    const attackActions = getAvailableAttackActions(game);
    attackActions.forEach((action) => {
        available.add(action);
    });

    // for each mature card in line, it can harvest
    // if can discard, each card in hand can be discarded

    return available;
}
