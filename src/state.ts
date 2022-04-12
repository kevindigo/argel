import { State, Side, Player, TurnState, CardWithState } from './models';
import { CardefPool } from './pool';
import { createInitialSide, SideManager } from './side';
import { LineIndex } from './types';

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

    public getMyIndex(): number {
        return this.state.turnState.myIndex;
    }

    public getEnemyIndex(): number {
        return 1 - this.getMyIndex();
    }

    public getEffectivePower(
        sideIndex: number,
        lineIndexes: LineIndex[]
    ): number {
        const line = this.state.sides[sideIndex]?.line as CardWithState[];
        const power = lineIndexes.reduce((lineIndex, power) => {
            const cardId = line[lineIndex]?.card.cardId;
            if (!cardId) {
                throw new Error(
                    `No card found in line at ${sideIndex}.${lineIndex}`
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
}
