import { Cardef } from './cardefs';
import { Deed } from './models';
import { CardefPool } from './pool';
import { SideManager } from './side';
import { StateManager } from './state';
import { DeedType, CardId, CardState, CardType, Zone, LineEnd } from './types';

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
        const cardef = pool.lookup(cardId);
        if (!cardef) {
            throw new Error(`Cardef not found in pool for ${cardId}`);
        }
        return cardef;
    }

    private getAvailablePlayDeeds(): Set<Deed> {
        const available = new Set<Deed>();

        const manager = this.getMySideManager();
        for (let i = 0; i < manager.hand.length; ++i) {
            const slot = { zone: Zone.MY_HAND, index: i };
            const card = this.stateManager.getCardAtSlot(slot);
            const cardef = this.getCardef(this.pool, card.cardId);
            switch (cardef.type) {
                case CardType.ACTION: {
                    available.add({
                        type: DeedType.PLAY,
                        from: [{ zone: Zone.MY_HAND, index: i }],
                        to: [],
                    });
                    break;
                }
                case CardType.CREATURE: {
                    available.add({
                        type: DeedType.PLAY,
                        from: [{ zone: Zone.MY_HAND, index: i }],
                        to: [{ zone: Zone.MY_LINE, index: LineEnd.RIGHT }],
                    });
                    if (manager.line.length > 0) {
                        available.add({
                            type: DeedType.PLAY,
                            from: [{ zone: Zone.MY_HAND, index: i }],
                            to: [{ zone: Zone.MY_LINE, index: LineEnd.LEFT }],
                        });
                    }
                    break;
                }
                case CardType.RELIC: {
                    available.add({
                        type: DeedType.PLAY,
                        from: [{ zone: Zone.MY_HAND, index: i }],
                        to: [],
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
            const slot = { zone: Zone.MY_LINE, index: attackerIndex };
            const cardWithState =
                this.stateManager.getCardWithStateAtSlot(slot);
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
                    from: [{ zone: Zone.MY_LINE, index: attackerIndex }],
                    to: [{ zone: Zone.ENEMY_LINE, index: targetIndex }],
                });
            }

            // ToDo: Implement BearHug
            // ToDo: Implement TeamUp
        }

        return available;
    }

    private getAvailableHarvestDeeds(): Set<Deed> {
        const available = new Set<Deed>();

        const stateManager = this.stateManager;
        const mySideManager = this.getMySideManager();
        for (
            let lineIndex = 0;
            lineIndex < mySideManager.line.length;
            ++lineIndex
        ) {
            const slot = { zone: Zone.MY_LINE, index: lineIndex };
            const cardWithState = stateManager.getCardWithStateAtSlot(slot);
            if (cardWithState.state !== CardState.MATURE) {
                continue;
            }

            available.add({
                type: DeedType.HARVEST,
                from: [{ zone: Zone.MY_LINE, index: LineEnd.LEFT }],
                to: [],
            });
        }

        for (
            let arsenalIndex = 0;
            arsenalIndex < mySideManager.arsenal.length;
            ++arsenalIndex
        ) {
            const slot = { zone: Zone.MY_ARSENAL, index: arsenalIndex };
            const cardWithState = stateManager.getCardWithStateAtSlot(slot);
            if (cardWithState.state !== CardState.MATURE) {
                continue;
            }

            available.add({
                type: DeedType.HARVEST,
                from: [],
                to: [],
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
                from: [{ zone: Zone.MY_HAND, index: i }],
                to: [],
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
