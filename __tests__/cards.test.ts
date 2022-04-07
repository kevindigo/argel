import { lookupCardef as lookupCardef } from '../src/cards';

describe('The cardef pool', () => {
    it('Can lookup a known cardef', () => {
        const cardef = lookupCardef('OmegaCodex-001');
        expect(cardef).toBeDefined();
        expect(cardef?.name).toEqual('Vix');
    });

    it('Cannot lookup a cardef for an unknown id', () => {
        expect(lookupCardef('Unknown')).toBeUndefined();
    });
});
