declare global {
  namespace ExtensionServer {
    /**
     * Events being received by the extension server where the keys are the event names
     * and the values are the payload of the given action. In case no payload is
     * required, a value of void should be used.
     */
    interface InboundEvents {
      //
    }

    /**
     * Events being sent to the extension server where the keys are the event names
     * and the values are the payload of the given action. In case no payload is
     * required, a value of void should be used.
     */
    interface OutboundEvents {
      //
    }

    /**
     * This helper type allows us to account for nullish payloads on the emit function.
     * In practice, this will allow TypeScript to type-check the event being emitted
     * and, if the payload isn't required, the second argument won't be necessary.
     */
    type EmitArgs<Event extends keyof ExtensionServer.OutboundEvents> =
      ExtensionServer.OutboundEvents[Event] extends void
        ? [event: Event]
        : [event: Event, payload: ExtensionServer.OutboundEvents[Event]];

    interface Options {
      connection: WebSocket.Options;
    }

    interface Client {
      /**
       * Reconnecting WebSocket Client
       */
      readonly connection: WebSocket.Client;

      /**
       * Function to add an event listener to messages coming from
       * the extension server connection.
       */
      on<Event extends keyof ExtensionServer.InboundEvents>(
        event: Event,
        cb: (payload: ExtensionServer.InboundEvents[Event]) => void,
      ): () => void;

      /**
       * Function to emit an event to the extension server.
       */
      emit<Event extends keyof OutboundEvents>(...args: EmitArgs<Event>): void;

      /**
       * Function to dispatch an event to the extension server.
       */
      dispatch<Event extends keyof OutboundEvents>(...args: EmitArgs<Event>): void;
    }

    type StaticClient = Static<Client, [option: ExtensionServer.Options]>;

    /**
     * The native WebSocket implementation has a some limitations and features like connecting timeout
     * and reconnect attempts lack in the native class. This internal wrapper introduces
     * these features as well as some helpers to obtain a more natural API.
     */
    namespace WebSocket {
      interface Options {
        /**
         * This defines if we should automatically attempt to connect when the
         * class is instantiated.
         *
         * @default true
         */
        automaticConnect: boolean;

        /**
         * The sub-protocol selected by the server.
         *
         * @default []
         */
        protocols: string | string[];

        /**
         * When attempting to reconnect, an exponential back off strategy should be implemented.
         * This object defines the variables for reconnect strategy.
         *
         * wait_interval = interval * decay^(number_of_attempts)
         * where: interval <= wait_interval < maxInterval
         *        number of attempts <= maxAttempts
         */
        reconnect: {
          /**
           * This is an arbitrary multiplier that can be defined as an integer or float. This
           * allows us to back off when there's a problem and avoid overwhelming the system.
           *
           * @default 1.5
           */
          decay: number;

          /**
           * This is the initial (minimum) time in milliseconds that we'll wait to attempt
           * to reconnect. This is the base for the back off formula and will be
           * the value used for the first reconnection attempt.
           *
           * @default 1000
           */
          interval: number;

          /**
           * This defines the maximum number of times we'll attempt to reconnect. This is
           * defined by an integer that will be used to compare before trying to
           * attempt to reconnect.
           *
           * @default Infinity
           */
          maxAttempts: number;

          /**
           * The maximum number of milliseconds that the back off algorithm will wait.
           * Since the back off algorithm is an exponential function, this will
           * grow fast. This allows us to cap the wait time to a max value.
           *
           * @default 30000
           */
          maxInterval: number;

          /**
           * Defines if the WebSocket should NOT try to reconnect automatically.
           * If false, the attempts will start automatically if it fails to
           * connect or if it gets disconnected.
           *
           * @default false
           */
          skip: boolean;
        };

        /**
         * Time in milliseconds that a connection attempts to succeed before
         * closing and retrying.
         *
         * @default 2000
         */
        timeout: number;
      }

      /**
       * The WebSocket's connection state.
       */
      type State = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

      /**
       * The reconnecting WebSocket class.
       */
      interface Client extends WebSocket {
        /**
         * The current state of the connection. The native WebSocket's readyState returns
         * an unsigned short value. This property translates these values into the State
         * union types which is more readable.
         */
        state: WebSocket.State;

        /**
         * Checks if the socket is closed or couldn't be opened.
         */
        isClosed(): boolean;

        /**
         * Checks if the socket is in the process of closing.
         */
        isClosing(): boolean;

        /**
         * Checks if the socket has been created but is not yet open.
         */
        isConnecting(): boolean;

        /**
         * Checks if the socket is open and ready to communicate.
         */
        isOpen(): boolean;

        /**
         * Manually triggers the reconnect sequence for the WebSocket.
         */
        reconnect(): void;
      }

      type StaticClient = Static<Client, [url: string, options: WebSocket.Options]>;
    }

    /**
     * This is a helper interface that allows us to define the static methods of a given
     * class. This is useful to define static methods, static properties
     * and constructor variables.
     */
    interface Static<T = unknown, A extends Array<unknown> = any[]> {
      new (...args: A): T;
    }
  }
}

export {};
