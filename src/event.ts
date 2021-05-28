export interface Event<T> {
    eventName: string;
    payload: T;
}

export abstract class EventListener<T> {
    public event: Event<T>;

    constructor(_event: Event<T>) {
        this.event = _event;
    }

    /**
     * Handle a fired event
     * @param event Event to handle
     */
    abstract onEvent(event: Event<T>): void;
}

export class EventPublisher {
    private static _eventListenerRegistry: EventListener<any>[] = [];

    /**
     * Register a new event listener
     * @param listener Event listener to register
     */
    public static registerListener(listener: EventListener<any>) {
        this._eventListenerRegistry.push(listener);
    }

    /**
     * Emit an event
     * @param event Event to emit
     */
    public static emitEvent(event: Event<any>) {
        const listeners: EventListener<any>[] = this._eventListenerRegistry.filter(
            (listener) => listener.event.eventName === event.eventName,
        );
        for (const listener of listeners) {
            listener.onEvent(event);
        }
    }
}
