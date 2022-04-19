import { DeedManager } from './deed';
import { State, Side, Player, Slot, Card, Decision } from './models';
import { Rules } from './rules';
import { createEmptySide, createInitialSide, SideManager } from './side';
import { Zone } from './types';

export function createInitialState(player1: Player, player2: Player): State {
    const sides: Side[] = [
        createInitialSide(player1),
        createInitialSide(player2),
    ];

    const state: State = {
        activeSideIndex: 0,
        sides,
        currentDeed: { decisions: [] },
    };

    return state;
}

export class StateManager {
    private _state: State;

    public static createWithEmptyState() {
        const state = {
            activeSideIndex: 0,
            sides: [createEmptySide(), createEmptySide()],
            currentDeed: { decisions: [] },
        };
        return new StateManager(state);
    }

    public constructor(state: State) {
        this._state = state;
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
        return this.state.activeSideIndex;
    }

    public getEnemyIndex(): number {
        return 1 - this.getMyIndex();
    }

    public getCurrentDecision(): Decision {
        const deed = this.state.currentDeed;
        const deedManager = new DeedManager(deed);
        return deedManager.getCurrentDecision();
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

    public applyDecision(slots: Slot[]): void {
        const deedManager = new DeedManager(this.state.currentDeed);
        if (!deedManager.isValidSelection(slots)) {
            throw new Error(
                `Invalid slots ${JSON.stringify(slots)} for ${JSON.stringify(
                    this.state
                )}`
            );
        }
        this.getCurrentDecision().selectedSlots = slots;

        const firstSlot = slots[0];
        const stateManager = new StateManager(this.state);
        const deed = this.state.currentDeed;
        if (deed.decisions.length === 1) {
            if (!firstSlot) {
                throw new Error(
                    `Unable to extract mainCard ${JSON.stringify(deed)}`
                );
            }
            deed.mainCard = stateManager.getCardAtSlot(firstSlot);
            deed.mainZone = firstSlot.zone;
        }

        if (deed.decisions.length === 2) {
            if (!firstSlot) {
                throw new Error(
                    `Unable to determine type ${JSON.stringify(deed)}`
                );
            }
            deed.type = deedManager.calculateType(
                deed.mainZone,
                firstSlot.zone
            );
        }

        const rules = new Rules();
        const newDecision = rules.calculateNextDecision(this.state);
        deed.decisions.push(newDecision);
    }
}
