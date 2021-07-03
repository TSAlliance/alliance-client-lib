import { HashMap } from "../util/hashMap";
import { Event } from "./event";
import { EventListener } from "./eventListener";

export class EventPublisher {
    private static _eventListenerRegistry: HashMap<EventListener> = {};

    /**
     * Register a new event listener
     * @param eventName Name of the event
     * @param listener Event listener to register
     */
    public static registerListener(eventName: string, listener: EventListener) {
        this._eventListenerRegistry[eventName.toLowerCase()] = listener;
    }

    /**
     * Emit an event
     * @param event Event to emit
     */
    public static emitEvent(event: Event<any>) {
        const listeners: EventListener[] = Object.keys(this._eventListenerRegistry)
            .filter((key) => key === event.eventName.toLowerCase())
            .map((key) => this._eventListenerRegistry[key]);

        for (const listener of listeners) {
            listener(event);
        }
    }

    public static unregister(eventName: string) {
        this._eventListenerRegistry[eventName.toLowerCase()] = undefined;
    }
}
