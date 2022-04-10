import { Cardef, CardefPool } from './cards';
import { Deed, Card, CardWithState } from './models';
import { SideManager } from './side';
import { StateManager } from './state';
import { DeedType, CardId, CardState, CardType } from './types';

export class AvailableDeedsGenerator {
    private stateManager: StateManager;
    private pool: CardefPool;

    public constructor(stateManager: StateManager, pool: CardefPool) {
        this.stateManager = stateManager;
        this.pool = pool;
    }

    private getMySideManager(): SideManager {
        const mySideManager = this.stateManager.getMySideManager();

        return mySideManager;
    }

    private getCardef(pool: CardefPool, cardId: CardId): Cardef {
        const cardef = pool.lookup(cardId) as Cardef;
        return cardef;
    }

    private getAvailablePlayDeeds(): Set<Deed> {
        const available = new Set<Deed>();

        const manager = this.getMySideManager();
        for (let i = 0; i < manager.hand.length; ++i) {
            const card = manager.hand[i] as Card;
            const cardef = this.getCardef(this.pool, card.cardId);
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

    private getAvailableFightDeeds(): Set<Deed> {
        const available = new Set<Deed>();

        const manager = this.getMySideManager();
        for (
            let attackerIndex = 0;
            attackerIndex < manager.line.length;
            ++attackerIndex
        ) {
            const cardWithState = manager.line[attackerIndex] as CardWithState;
            if (cardWithState.state === CardState.DORMANT) {
                continue;
            }

            const enemyManager = this.stateManager.getEnemySideManager();
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

    private getAvailableHarvestDeeds(): Set<Deed> {
        const available = new Set<Deed>();

        const manager = this.getMySideManager();
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
            const cardWithState = manager.arsenal[
                arsenalIndex
            ] as CardWithState;
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

    private getAvailableDiscardDeeds(): Set<Deed> {
        const available = new Set<Deed>();

        const manager = this.getMySideManager();
        if (!this.stateManager.canDiscard()) {
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

    public getAvailableDeeds(): Set<Deed> {
        const available = new Set<Deed>();

        const playDeeds = this.getAvailablePlayDeeds();
        playDeeds.forEach((deed) => {
            available.add(deed);
        });

        const FightDeeds = this.getAvailableFightDeeds();
        FightDeeds.forEach((deed) => {
            available.add(deed);
        });

        const harvestDeeds = this.getAvailableHarvestDeeds();
        harvestDeeds.forEach((deed) => {
            available.add(deed);
        });

        const discardDeeds = this.getAvailableDiscardDeeds();
        discardDeeds.forEach((deed) => {
            available.add(deed);
        });

        return available;
    }
}
