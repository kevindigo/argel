import { Cardef, CardefPool } from './cards';
import { Game } from './game';
import { Deed, Card, CardWithState, GameState } from './models';
import { SideManager } from './side';
import { DeedType, CardId, CardState, CardType } from './types';

function getMySideManager(game: Game): SideManager {
    const myIndex = game.getMyIndex();
    const mySideManager = game.sideManagers[myIndex] as SideManager;

    return mySideManager;
}

function getCardef(pool: CardefPool, cardId: CardId): Cardef {
    const cardef = pool.lookup(cardId) as Cardef;
    return cardef;
}

function getAvailablePlayDeeds(gameState: GameState): Set<Deed> {
    const available = new Set<Deed>();

    const game = new Game(gameState);
    const manager = getMySideManager(game);
    for (let i = 0; i < manager.hand.length; ++i) {
        const card = manager.hand[i] as Card;
        const cardef = getCardef(game.pool, card.cardId);
        switch (cardef.type) {
            case CardType.ACTION: {
                available.add({
                    type: DeedType.PLAY,
                    handIndex: i,
                    lineIndex: null,
                    arsenalIndex: null,
                });
                break;
            }
            case CardType.CREATURE: {
                available.add({
                    type: DeedType.PLAY,
                    handIndex: i,
                    lineIndex: -1,
                    arsenalIndex: null,
                });
                if (manager.line.length > 0) {
                    available.add({
                        type: DeedType.PLAY,
                        handIndex: i,
                        lineIndex: 0,
                        arsenalIndex: null,
                    });
                }
                break;
            }
            case CardType.RELIC: {
                available.add({
                    type: DeedType.PLAY,
                    handIndex: i,
                    lineIndex: null,
                    arsenalIndex: -1,
                });
                break;
            }
        }
    }

    return available;
}

function getAvailableFightDeeds(gameState: GameState): Set<Deed> {
    const available = new Set<Deed>();

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
                type: DeedType.FIGHT,
                handIndex: null,
                lineIndex: null,
                arsenalIndex: null,
                attackers: [attackerIndex],
                defenders: [targetIndex],
            });
        }

        // ToDo: Implement BearHug
        // ToDo: Implement TeamUp
    }

    return available;
}

function getAvailableHarvestDeeds(gameState: GameState): Set<Deed> {
    const available = new Set<Deed>();

    const game = new Game(gameState);
    const manager = getMySideManager(game);
    for (let lineIndex = 0; lineIndex < manager.line.length; ++lineIndex) {
        const cardWithState = manager.line[lineIndex] as CardWithState;
        if (cardWithState.state !== CardState.MATURE) {
            continue;
        }

        available.add({
            type: DeedType.HARVEST,
            handIndex: null,
            lineIndex,
            arsenalIndex: null,
        });
    }

    for (
        let arsenalIndex = 0;
        arsenalIndex < manager.arsenal.length;
        ++arsenalIndex
    ) {
        const cardWithState = manager.arsenal[arsenalIndex] as CardWithState;
        if (cardWithState.state !== CardState.MATURE) {
            continue;
        }

        available.add({
            type: DeedType.HARVEST,
            handIndex: null,
            lineIndex: null,
            arsenalIndex: arsenalIndex,
        });
    }

    return available;
}

function getAvailableDiscardDeeds(gameState: GameState): Set<Deed> {
    const available = new Set<Deed>();

    const game = new Game(gameState);
    const manager = getMySideManager(game);
    if (!gameState.turnState.turnFlags.canDiscard) {
        return available;
    }

    for (let i = 0; i < manager.hand.length; ++i) {
        available.add({
            type: DeedType.DISCARD,
            handIndex: i,
            lineIndex: null,
            arsenalIndex: null,
        });
    }

    return available;
}

export function getAvailableDeeds(gameState: GameState): Set<Deed> {
    const available = new Set<Deed>();

    const playDeeds = getAvailablePlayDeeds(gameState);
    playDeeds.forEach((deed) => {
        available.add(deed);
    });

    const FightDeeds = getAvailableFightDeeds(gameState);
    FightDeeds.forEach((deed) => {
        available.add(deed);
    });

    const harvestDeeds = getAvailableHarvestDeeds(gameState);
    harvestDeeds.forEach((deed) => {
        available.add(deed);
    });

    const discardDeeds = getAvailableDiscardDeeds(gameState);
    discardDeeds.forEach((deed) => {
        available.add(deed);
    });

    return available;
}
