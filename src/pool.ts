import { Cardef, createCardef } from './cardefs';
import { CardId, CardType } from './types';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export class CardefPool {
    private static singletonPool: CardefPool;
    private cardefs: Map<CardId, Cardef>;

    public static getPool(): CardefPool {
        if (!this.singletonPool) {
            this.singletonPool = new CardefPool();
        }
        return this.singletonPool;
    }

    private constructor() {
        this.cardefs = new Map<CardId, Cardef>();
        const path = resolve(__dirname, '../resources/cardpool.tsv');
        this.loadFromFile(path);
        if (this.cardefs.size !== 100) {
            throw new Error(`Pool not 100 cards! (${this.cardefs.size})`);
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
            columns.shift(); // rarity

            try {
                const cardef = createCardef(
                    setId,
                    id,
                    name,
                    type as CardType,
                    power,
                    vp
                );

                return cardef;
            } catch (e: unknown) {
                console.log(e);
                console.log(row);
                throw e;
            }
        });

        this.cardefs.clear();
        cardefs.forEach((cardef) => {
            const fullId = `${cardef.setId}-${cardef.cardNumber}`;
            this.cardefs.set(fullId, cardef);
        });
    }

    public size(): number {
        return this.cardefs.size;
    }

    public lookup(cardId: CardId): Cardef | undefined {
        return this.cardefs.get(cardId);
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
