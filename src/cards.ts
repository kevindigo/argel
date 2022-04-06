import { OMEGA_CODEX } from './constants';
import { CardId, CardType } from './types';

export interface Cardef {
    id: CardId;
    type: CardType;
    name: string;
    power?: number;
    vp?: number;
    // skills
    // bonus
}

function omegaId(index: string) {
    return `${OMEGA_CODEX}-${index}`;
}

function omegaCreature(
    index: string,
    name: string,
    power: number,
    vp: number
): Cardef {
    return {
        id: omegaId(index),
        type: CardType.CREATURE,
        name,
        power,
        vp,
    };
}

function omegaRelic(index: string, name: string, vp: number): Cardef {
    return {
        id: omegaId(index),
        type: CardType.RELIC,
        name,
        vp,
    };
}

function omegaAction(index: string, name: string, vp: number): Cardef {
    return {
        id: omegaId(index),
        type: CardType.ACTION,
        name,
        vp,
    };
}

// Creatures
export const vix = omegaCreature('001', 'Vix', 1, 1);
export const jater = omegaCreature('002', 'Jater', 1, 1);
export const payday = omegaCreature('026', 'Payday', 6, 1);
export const pinwheel = omegaCreature('029', 'Pinwheel', 6, 2);
export const bamphf = omegaCreature('030', 'Bamphf', 6, 1);
export const vanx = omegaCreature('038', 'Vanx', 7, 2);
export const renegade = omegaCreature('041', 'Renegade', 8, 2);
export const ratSmasher = omegaCreature('042', 'Rat Smasher', 8, 2);
export const saboteur = omegaCreature('048', 'Saboteur', 9, 1);

// Relics
export const hypervator = omegaRelic('058', 'Hypervator', 1);

// Actions
export const recall = omegaAction('071', 'Recall', 1);
export const startOver = omegaAction('076', 'Start Over', 2);
export const corrodeOrShine = omegaAction('077', 'Corrode or Shine', 2);
export const rollTheDice = omegaAction('082', 'Roll the Dice', 1);
export const aLittleOffTheTop = omegaAction('088', 'A Little Off the Top', 1);
export const cheapShot = omegaAction('089', 'Cheap Shot', 1);
export const duck = omegaAction('099', 'Duck!', 0);

const cardPool = new Map<CardId, Cardef>();

function addCardefToPool(cardTemplate: Cardef): void {
    cardPool.set(cardTemplate.id, cardTemplate);
}

addCardefToPool(vix);
addCardefToPool(jater);
addCardefToPool(payday);
addCardefToPool(pinwheel);
addCardefToPool(bamphf);
addCardefToPool(vanx);
addCardefToPool(renegade);
addCardefToPool(ratSmasher);
addCardefToPool(saboteur);
addCardefToPool(hypervator);
addCardefToPool(recall);
addCardefToPool(startOver);
addCardefToPool(corrodeOrShine);
addCardefToPool(rollTheDice);
addCardefToPool(aLittleOffTheTop);
addCardefToPool(cheapShot);
addCardefToPool(duck);

export function lookupCardTemplate(cardId: CardId): Cardef | undefined {
    return cardPool.get(cardId);
}
