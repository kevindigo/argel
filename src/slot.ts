import { Slot } from './models';

export function slotString(slot: Slot): string {
    return `${slot.zone}-${slot.index}`;
}
