import {
    aLittleOffTheTop,
    bamphf,
    cheapShot,
    corrodeOrShine,
    duck,
    hypervator,
    jater,
    payday,
    pinwheel,
    ratSmasher,
    recall,
    renegade,
    rollTheDice,
    saboteur,
    startOver,
    vanx,
} from './cards';
import { OMEGA_CODEX } from './constants';
import { CardId, DeckId, SetId } from './types';

interface DeckList {
    id: DeckId;
    set: SetId;
    name: string;
    contents: CardId[]; // 17 cards
}

const sampleDeck1: DeckList = {
    id: '679a6701-d7c3-494e-becb-04e9178aca30',
    set: OMEGA_CODEX,
    name: 'Marla "Buff" Grafani',
    contents: [
        jater.id,
        payday.id,
        pinwheel.id,
        bamphf.id,
        vanx.id,
        renegade.id,
        ratSmasher.id,
        ratSmasher.id,
        saboteur.id,
        hypervator.id,
        recall.id,
        startOver.id,
        corrodeOrShine.id,
        rollTheDice.id,
        aLittleOffTheTop.id,
        cheapShot.id,
        duck.id,
    ],
};

export function lookupDeckList(deckId: DeckId): DeckList | undefined {
    if (deckId === sampleDeck1.id) {
        return sampleDeck1;
    }

    return undefined;
}
