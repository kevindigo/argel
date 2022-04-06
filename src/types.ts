export enum CardState {
    DORMANT = 'Dormant',
    READY = 'Ready',
    MATURE = 'Mature',
}

export enum TopOrBottom {
    TOP = 'Top',
    BOTTOM = 'Bottom',
}

export enum ActionType {
    PLAY = 'Play',
    FIGHT = 'Fight',
    HARVEST = 'Harvest',
}

export enum FlagKey {
    NEXT_CARD_ACTIVE = 'NextCardActive',
    HAS_PLAYED_CARD = 'HasPlayedCard',
}

export type HandIndex = number;
export type LineIndex = number;
export type LineGap = number;
export type RelicsIndex = number;
export type ScoredIndex = number;
export type DeckId = string;
export type CardId = string;
