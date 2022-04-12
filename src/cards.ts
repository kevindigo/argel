import { CardEffects } from './effects';
import { CardNumber, CardType, SetId } from './types';

export interface Cardef {
    setId: SetId;
    cardNumber: CardNumber;
    type: CardType;
    name: string;
    power: number | undefined;
    vp: number;
    cardEffects?: CardEffects;
    // skills
    // bonus
    // rarity
}

export function createCardef(
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
