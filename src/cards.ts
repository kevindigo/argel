import { OMEGA_CODEX } from './constants';
import { CardId, CardType } from './types';

export interface CardTemplate {
    id: CardId;
    type: CardType;
    name: string;
    power?: number;
    vp?: number;
    // skills
    // bonus
}

function omegaId(index: number) {
    return `${OMEGA_CODEX}-${index}`;
}

function omegaCreature(
    index: number,
    name: string,
    power: number,
    vp: number
): CardTemplate {
    return {
        id: omegaId(index),
        type: CardType.CREATURE,
        name,
        power,
        vp,
    };
}

function omegaRelic(index: number, name: string, vp: number): CardTemplate {
    return {
        id: omegaId(index),
        type: CardType.RELIC,
        name,
        vp,
    };
}

function omegaAction(index: number, name: string, vp: number): CardTemplate {
    return {
        id: omegaId(index),
        type: CardType.ACTION,
        name,
        vp,
    };
}

// Creatures
export const vix = omegaCreature(1, 'Vix', 1, 1);
export const jater = omegaCreature(2, 'Jater', 1, 1);
export const payday = omegaCreature(26, 'Payday', 6, 1);
export const pinwheel = omegaCreature(29, 'Pinwheel', 6, 2);
export const bamphf = omegaCreature(30, 'Bamphf', 6, 1);
export const vanx = omegaCreature(38, 'Vanx', 7, 2);
export const renegade = omegaCreature(41, 'Renegade', 8, 2);
export const ratSmasher = omegaCreature(42, 'Rat Smasher', 8, 2);
export const saboteur = omegaCreature(48, 'Saboteur', 9, 1);

// Relics
export const hypervator = omegaRelic(58, 'Hypervator', 1);

// Actions
export const recall = omegaAction(71, 'Recall', 1);
export const startOver = omegaAction(76, 'Start Over', 2);
export const corrodeOrShine = omegaAction(77, 'Corrode or Shine', 2);
export const rollTheDice = omegaAction(82, 'Roll the Dice', 1);
export const aLittleOffTheTop = omegaAction(88, 'A Little Off the Top', 1);
export const cheapShot = omegaAction(89, 'Cheap Shot', 1);
export const duck = omegaAction(99, 'Duck!', 0);

const cardPool = new Map<CardId, CardTemplate>();

function addCardToPool(cardTemplate: CardTemplate): void {
    cardPool.set(cardTemplate.id, cardTemplate);
}

addCardToPool(vix);
addCardToPool(jater);
addCardToPool(payday);
addCardToPool(pinwheel);
addCardToPool(bamphf);
addCardToPool(vanx);
addCardToPool(renegade);
addCardToPool(ratSmasher);
addCardToPool(saboteur);
addCardToPool(hypervator);
addCardToPool(recall);
addCardToPool(startOver);
addCardToPool(corrodeOrShine);
addCardToPool(rollTheDice);
addCardToPool(aLittleOffTheTop);
addCardToPool(cheapShot);
addCardToPool(duck);

export function lookupCardTemplate(cardId: CardId): CardTemplate | undefined {
    return cardPool.get(cardId);
}
