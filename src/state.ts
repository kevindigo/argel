import {
    State,
    Side,
    Player,
    TurnState,
    CardWithState,
    Slot,
    Card,
} from './models';
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
        turnFlags: {
            canDiscard: false,
        },
    };

    const state: State = {
        sides,
        turnState,
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
        return this.state.turnState.turnFlags.canDiscard;
    }

    public getCardAtSlot(slot: Slot): Card {
        if (this.isZoneStateful(slot.zone)) {
            const cardWithState = this.getCardWithStateAtSlot(slot);
            return cardWithState.card;
        } else {
            return this.getCardWithoutStateAtSlot(slot);
        }
    }

    public getMyIndex(): number {
        return this.state.turnState.myIndex;
    }

    public getEnemyIndex(): number {
        return 1 - this.getMyIndex();
    }

    public getEffectivePower(sideIndex: number, slots: Slot[]): number {
        const line = this.state.sides[sideIndex]?.line as CardWithState[];
        const power = slots.reduce((power, slot) => {
            const cardId = line[slot.index]?.card.cardId;
            if (!cardId) {
                throw new Error(
                    `No card found in line at ${sideIndex}.${slot.index}`
                );
            }
            const cardef = this.pool.lookup(cardId);
            if (!cardef) {
                throw new Error(`Unknown CardId ${cardId}`);
            }
            const thisPower = cardef?.power ?? 0;
            return power + thisPower;
        }, 0);
        return power;
    }

    private getSide(sideIndex: number): Side {
        return this.state.sides[sideIndex] as Side;
    }

    private isZoneStateful(zone: Zone): boolean {
        return (
            zone === Zone.MY_LINE ||
            zone === Zone.MY_ARSENAL ||
            zone === Zone.ENEMY_LINE ||
            zone === Zone.ENEMY_ARSENAL
        );
    }

    private getCardWithStateAtSlot(slot: Slot): CardWithState {
        const cardsInZone = this.getZoneCardsWithState(slot.zone);
        return cardsInZone[slot.index] as CardWithState;
    }

    private getZoneCardsWithState(zone: Zone): CardWithState[] {
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
            default: {
                throw new Error(`Unknown zoneWithState: ${zone}`);
            }
        }
    }

    private getCardWithoutStateAtSlot(slot: Slot): Card {
        const cardsInZone = this.getZoneCardsWithoutState(slot.zone);
        return cardsInZone[slot.index] as Card;
    }

    private getZoneCardsWithoutState(zone: Zone): Card[] {
        switch (zone) {
            case Zone.MY_TOP: {
                const drawPile = this.getMySideManager().drawPile;
                const topCard = drawPile[drawPile.length - 1] as Card;
                return [topCard];
            }
            case Zone.MY_BOTTOM: {
                const drawPile = this.getMySideManager().drawPile;
                const topCard = drawPile[0] as Card;
                return [topCard];
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
                const topCard = drawPile[drawPile.length - 1] as Card;
                return [topCard];
            }
            case Zone.ENEMY_BOTTOM: {
                const drawPile = this.getEnemySideManager().drawPile;
                const topCard = drawPile[0] as Card;
                return [topCard];
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
                throw new Error(`Unknown zoneWithState: ${zone}`);
            }
        }
    }
}
