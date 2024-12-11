import {Device} from "../generated/plc4j-tools-ui-frontend.ts";

export interface DeviceConnection {
    id: string,
    device: Device,
}
