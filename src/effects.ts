export enum EffectType {
    CHOOSE = 'Choose',
    DO = 'Do',
    FILTER = 'Filter',
}

export enum EffectsWhen {
    PLAY = 'Play',
}

export type EffectText = string;

export interface Effect {
    type: EffectType;
    text: EffectText;
}

export interface CardEffects {
    when: EffectsWhen;
    effects: Effect[];
}

export function parseEffects(raw: string): CardEffects {
    const whenAndEffects = raw.split('/');
    const when: EffectsWhen = whenAndEffects.shift() as EffectsWhen;
    const effectStrings = whenAndEffects.shift() ?? '';
    const effectTexts = effectStrings.split(';');
    const effects = effectTexts.map((effect) => {
        const [rawType, rawText] = effect.split(':');
        const type = rawType as EffectType;
        const text = rawText as string;
        return { type, text };
    });
    return {
        when,
        effects,
    };
}
