import { Cardef, CardefPool } from './cards';
import { Game } from './game';
import { Action, Card, CardWithState, GameState } from './models';
import { SideManager } from './side';
import { ActionType, CardId, CardState, CardType } from './types';

function getMySideManager(game: Game): SideManager {
    const myIndex = game.getMyIndex();
    const mySideManager = game.sideManagers[myIndex] as SideManager;

    return mySideManager;
}

function getCardef(pool: CardefPool, cardId: CardId): Cardef {
    const cardef = pool.lookup(cardId) as Cardef;
    return cardef;
}

function getAvailablePlayActions(gameState: GameState): Set<Action> {
    const available = new Set<Action>();

    const game = new Game(gameState);
    const manager = getMySideManager(game);
    for (let i = 0; i < manager.hand.length; ++i) {
        const card = manager.hand[i] as Card;
        const cardef = getCardef(game.pool, card.cardId);
        switch (cardef.type) {
            case CardType.ACTION: {
                available.add({
                    type: ActionType.PLAY,
                    handIndex: i,
                    lineIndex: null,
                    relicsIndex: null,
                });
                break;
            }
            case CardType.CREATURE: {
                available.add({
                    type: ActionType.PLAY,
                    handIndex: i,
                    lineIndex: -1,
                    relicsIndex: null,
                });
                if (manager.line.length > 0) {
                    available.add({
                        type: ActionType.PLAY,
                        handIndex: i,
                        lineIndex: 0,
                        relicsIndex: null,
                    });
                }
                break;
            }
            case CardType.RELIC: {
                available.add({
                    type: ActionType.PLAY,
                    handIndex: i,
                    lineIndex: null,
                    relicsIndex: -1,
                });
                break;
            }
        }
    }

    return available;
}

function getAvailableAttackActions(gameState: GameState): Set<Action> {
    const available = new Set<Action>();

    const game = new Game(gameState);
    const manager = getMySideManager(game);
    for (
        let attackerIndex = 0;
        attackerIndex < manager.line.length;
        ++attackerIndex
    ) {
        const cardWithState = manager.line[attackerIndex] as CardWithState;
        if (cardWithState.state === CardState.DORMANT) {
            continue;
        }

        const enemyIndex = game.getEnemyIndex();
        const enemyManager = game.sideManagers[enemyIndex] as SideManager;
        for (
            let targetIndex = 0;
            targetIndex < enemyManager.line.length;
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

function getAvailableHarvestActions(gameState: GameState): Set<Action> {
    const available = new Set<Action>();

    const game = new Game(gameState);
    const manager = getMySideManager(game);
    for (let lineIndex = 0; lineIndex < manager.line.length; ++lineIndex) {
        const cardWithState = manager.line[lineIndex] as CardWithState;
        if (cardWithState.state !== CardState.MATURE) {
            continue;
        }

        available.add({
            type: ActionType.HARVEST,
            handIndex: null,
            lineIndex,
            relicsIndex: null,
        });
    }

    for (
        let relicsIndex = 0;
        relicsIndex < manager.relics.length;
        ++relicsIndex
    ) {
        const cardWithState = manager.relics[relicsIndex] as CardWithState;
        if (cardWithState.state !== CardState.MATURE) {
            continue;
        }

        available.add({
            type: ActionType.HARVEST,
            handIndex: null,
            lineIndex: null,
            relicsIndex,
        });
    }

    return available;
}

function getAvailableDiscardActions(gameState: GameState): Set<Action> {
    const available = new Set<Action>();

    const game = new Game(gameState);
    const manager = getMySideManager(game);
    if (!gameState.turnState.turnFlags.canDiscard) {
        return available;
    }

    for (let i = 0; i < manager.hand.length; ++i) {
        available.add({
            type: ActionType.DISCARD,
            handIndex: i,
            lineIndex: null,
            relicsIndex: null,
        });
    }

    return available;
}

export function getAvailableActions(gameState: GameState): Set<Action> {
    const available = new Set<Action>();

    const playActions = getAvailablePlayActions(gameState);
    playActions.forEach((action) => {
        available.add(action);
    });

    const attackActions = getAvailableAttackActions(gameState);
    attackActions.forEach((action) => {
        available.add(action);
    });

    const harvestActions = getAvailableHarvestActions(gameState);
    harvestActions.forEach((action) => {
        available.add(action);
    });

    const discardActions = getAvailableDiscardActions(gameState);
    discardActions.forEach((action) => {
        available.add(action);
    });

    return available;
}
