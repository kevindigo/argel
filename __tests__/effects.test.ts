import { EffectsWhen, EffectType, parseEffects } from '../src/effects';

describe('parseEffects', () => {
    it('can parse the effects for overcharge', () => {
        const rawEffectText = 'Play/Do:MT;Do:>H;Do:MT;Do:>H';
        const cardEffects = parseEffects(rawEffectText);
        expect(cardEffects.when).toEqual(EffectsWhen.PLAY);
        const effects = cardEffects.effects;
        expect(effects.length).toEqual(4);
        expect(effects.shift()).toEqual({ type: EffectType.DO, text: 'MT' });
        expect(effects.shift()).toEqual({ type: EffectType.DO, text: '>H' });
        expect(effects.shift()).toEqual({ type: EffectType.DO, text: 'MT' });
        expect(effects.shift()).toEqual({ type: EffectType.DO, text: '>H' });
    });

    it('can parse the effects for fast forward', () => {
        const rawEffectText = 'Play/Filter:AL;Do:@M';
        const cardEffects = parseEffects(rawEffectText);
        expect(cardEffects.when).toEqual(EffectsWhen.PLAY);
        const effects = cardEffects.effects;
        expect(effects.length).toEqual(2);
        expect(effects.shift()).toEqual({
            type: EffectType.FILTER,
            text: 'AL',
        });
        expect(effects.shift()).toEqual({ type: EffectType.DO, text: '@M' });
    });

    it('can parse the effects for direct deposit', () => {
        const rawEffectText = 'Play/Filter:MH;Choose:1;Do:>MS';
        const cardEffects = parseEffects(rawEffectText);
        expect(cardEffects.when).toEqual(EffectsWhen.PLAY);
        const effects = cardEffects.effects;
        expect(effects.length).toEqual(3);
        expect(effects.shift()).toEqual({
            type: EffectType.FILTER,
            text: 'MH',
        });
        expect(effects.shift()).toEqual({ type: EffectType.CHOOSE, text: '1' });
        expect(effects.shift()).toEqual({ type: EffectType.DO, text: '>MS' });
    });
});
