import { DecisionManager } from './decision';
import { State, Side, Player, TurnState, Slot, Card, Decision } from './models';
import { CardefPool } from './pool';
import { createInitialSide, SideManager } from './side';
import { Zone } from './types';

export function createInitialState(player1: Player, player2: Player): State {
    const sides: Side[] = [
        createInitialSide(player1),
        createInitialSide(player2),
    ];

    const turnState: TurnState = {
        myIndex: 0,
    };

    const state: State = {
        sides,
        turnState,
        currentDeed: [],
    };

    return state;
}

export class StateManager {
    private _state: State;
    private pool: CardefPool;

    public constructor(state: State) {
        this._state = state;
        this.pool = CardefPool.getPool();
    }

    public get state(): State {
        return this._state;
    }

    public getMySideManager(): SideManager {
        return new SideManager(this.getSide(this.getMyIndex()));
    }

    public getEnemySideManager(): SideManager {
        return new SideManager(this.getSide(this.getEnemyIndex()));
    }

    public canDiscard(): boolean {
        return this.getMySideManager().canDiscard();
    }

    public getCardAtSlot(slot: Slot): Card {
        const cardsInZone = this.getZoneCards(slot.zone);
        const card = cardsInZone[slot.index];
        if (!card) {
            throw new Error(
                `getCardAtSlot failed: ${JSON.stringify(
                    slot
                )} in ${JSON.stringify(cardsInZone)}}`
            );
        }
        return card;
    }

    public getMyIndex(): number {
        return this.state.turnState.myIndex;
    }

    public getEnemyIndex(): number {
        return 1 - this.getMyIndex();
    }

    public getEffectivePower(sideIndex: number, slots: Slot[]): number {
        const power = slots.reduce((power, slot) => {
            const card = this.getCardAtSlot(slot);
            const cardef = this.pool.lookup(card.cardId);
            if (!cardef) {
                throw new Error(
                    `getEffectivePower no such card: ${JSON.stringify(card)}`
                );
            }
            const thisPower = cardef?.power ?? 0;
            return power + thisPower;
        }, 0);
        return power;
    }

    public getCurrentDecision(): Decision {
        const deed = this.state.currentDeed;
        const deedManager = new DecisionManager(deed);
        return deedManager.getCurrentDecision();
    }

    public getLastDecision(): Decision {
        const deed = this.state.currentDeed;
        const last = deed[deed.length - 1];
        if (!last) {
            throw new Error('getLastDecision called when currentDeed is empty');
        }
        return last;
    }

    private getSide(sideIndex: number): Side {
        const side = this.state.sides[sideIndex];
        if (!side) {
            throw new Error(`getSide invalid sideIndex: ${sideIndex}`);
        }
        return side;
    }

    private getZoneCards(zone: Zone): Card[] {
        switch (zone) {
            case Zone.MY_LINE: {
                return this.getMySideManager().line;
            }
            case Zone.MY_ARSENAL: {
                return this.getMySideManager().arsenal;
            }
            case Zone.ENEMY_LINE: {
                return this.getEnemySideManager().line;
            }
            case Zone.ENEMY_ARSENAL: {
                return this.getEnemySideManager().line;
            }
            case Zone.MY_TOP: {
                const drawPile = this.getMySideManager().drawPile;
                const topCard = drawPile[drawPile.length - 1];
                if (!topCard) {
                    return [];
                }
                return [topCard];
            }
            case Zone.MY_BOTTOM: {
                const drawPile = this.getMySideManager().drawPile;
                const bottomCard = drawPile[0];
                if (!bottomCard) {
                    return [];
                }
                return [bottomCard];
            }
            case Zone.MY_HAND: {
                return this.getMySideManager().hand;
            }
            case Zone.MY_DISCARDS: {
                return this.getMySideManager().discards;
            }
            case Zone.MY_SCORED: {
                return this.getMySideManager().scored;
            }
            case Zone.ENEMY_TOP: {
                const drawPile = this.getEnemySideManager().drawPile;
                const topCard = drawPile[drawPile.length - 1];
                if (!topCard) {
                    return [];
                }
                return [topCard];
            }
            case Zone.ENEMY_BOTTOM: {
                const drawPile = this.getEnemySideManager().drawPile;
                const bottomCard = drawPile[0];
                if (!bottomCard) {
                    return [];
                }
                return [bottomCard];
            }
            case Zone.ENEMY_HAND: {
                return this.getEnemySideManager().hand;
            }
            case Zone.ENEMY_DISCARDS: {
                return this.getEnemySideManager().discards;
            }
            case Zone.ENEMY_SCORED: {
                return this.getEnemySideManager().scored;
            }
            default: {
                throw new Error(`Unknown zone: ${zone}`);
            }
        }
    }
}
