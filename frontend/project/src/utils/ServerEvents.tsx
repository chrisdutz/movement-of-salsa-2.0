import { EventEmitter } from "eventemitter3"
import {UiApplicationEvent} from "../generated/plc4j-tools-ui-frontend.ts";
import React from "react";

type ServerEvents = {
    "new-server-event": (serverEvent: UiApplicationEvent<object>) => void;
}

const serverEventEmitter = new EventEmitter<ServerEvents>();

type Opts = {
    onNewServerEvent?: (serverEvent: UiApplicationEvent<object>) => void;
}

const useEvents = (opts:Opts): void => {
    React.useEffect(() => {
        if(opts.onNewServerEvent !== undefined) {
            serverEventEmitter.on("new-server-event", opts.onNewServerEvent)
        }
        return () => {
            serverEventEmitter.off("new-server-event", opts.onNewServerEvent)
        }
    }, [opts])
}

export const useServerEvents = Object.assign(useEvents, {
    emitter: serverEventEmitter,
})