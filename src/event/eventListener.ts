import { Event } from "./event";

export interface EventListener {
    /**
     * Handle a fired event
     * @param event Event to handle
     */
    (event: Event<any>): void;
}
