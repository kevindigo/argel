import { State, Side, Player, TurnState } from './models';
import { createInitialSide, SideManager } from './side';

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
    private state: State;

    public constructor(state: State) {
        this.state = state;
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

    private getSide(sideIndex: number): Side {
        return this.state.sides[sideIndex] as Side;
    }

    private getMyIndex(): number {
        return this.state.turnState.myIndex;
    }

    private getEnemyIndex(): number {
        return 1 - this.getMyIndex();
    }
}
