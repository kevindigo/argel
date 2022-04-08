import { CardId, CardNumber, CardType, SetId } from './types';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface Cardef {
    setId: SetId;
    cardNumber: CardNumber;
    type: CardType;
    name: string;
    power: number | undefined;
    vp: number;
    // skills
    // bonus
    // rarity
}

function createCardef(
    setId?: SetId,
    cardNumber?: CardNumber,
    name?: string,
    type?: CardType,
    power?: number,
    vp?: number
): Cardef {
    if (!setId || !cardNumber || !name || !type) {
        throw new Error('Illegal cardef');
    }

    const validVp: number = vp ?? 0;

    return {
        setId,
        cardNumber,
        name,
        type,
        power,
        vp: validVp,
    };
}

export class CardefPool {
    private pool: Map<CardId, Cardef>;

    public constructor() {
        this.pool = new Map<CardId, Cardef>();
        const path = resolve(__dirname, '../resources/cardpool.tsv');
        this.loadFromFile(path);
        if (this.pool.size !== 100) {
            throw new Error(`Pool not 100 cards! (${this.pool.size})`);
        }
    }

    public loadFromTsvString(tsvString: string): void {
        const rows = tsvString.split('\n');
        rows.shift();
        const validRows = rows.filter((row) => {
            return row.length > 0;
        });
        const cardefs = validRows.map((row) => {
            const columns = row.split('\t');
            const setId = this.forceToString(columns.shift());
            const id = columns.shift();
            const type = columns.shift();
            const name = columns.shift();
            const power = parseInt(columns.shift() ?? '');
            const vp = parseInt(columns.shift() ?? '999');

            try {
                return createCardef(
                    setId,
                    id,
                    name,
                    type as CardType,
                    power,
                    vp
                );
            } catch (e: unknown) {
                console.log(e);
                console.log(row);
                throw e;
            }
        });

        this.pool.clear();
        cardefs.forEach((cardef) => {
            const fullId = `${cardef.setId}-${cardef.cardNumber}`;
            this.pool.set(fullId, cardef);
        });
    }

    public size(): number {
        return this.pool.size;
    }

    public lookup(cardId: CardId): Cardef | undefined {
        return this.pool.get(cardId);
    }

    private loadFromFile(path: string): void {
        try {
            const tsvContents = readFileSync(path);
            this.loadFromTsvString(tsvContents.toString('utf-8'));
        } catch (e: unknown) {
            console.log(e);
            throw e;
        }
    }

    private forceToString(s: string | undefined): string {
        return s ?? '';
    }
}
