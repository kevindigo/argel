import { CardefPool } from '../src/pool';

describe('The cardef pool', () => {
    it('Can be loaded', () => {
        const pool = CardefPool.getPool();
        expect(pool.lookup('OmegaCodex-014')).toBeDefined();
    });
});

describe('A loaded cardef pool', () => {
    const pool = CardefPool.getPool();

    it('Has the right number of cardefs', () => {
        expect(pool.size()).toEqual(100);
    });

    it('Can lookup a known cardef', () => {
        const cardef = pool.lookup('OmegaCodex-001');
        expect(cardef).toBeDefined();
        expect(cardef?.name).toEqual('Vix');
    });

    it('Cannot lookup a cardef for an unknown id', () => {
        expect(pool.lookup('Unknown')).toBeUndefined();
    });
});
