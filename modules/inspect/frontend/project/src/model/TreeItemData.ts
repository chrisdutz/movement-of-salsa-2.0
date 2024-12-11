import {Device, Driver} from "../generated/plc4j-tools-ui-frontend.ts";

export type TreeItemType = "ROOT" | "DRIVER" | "CONNECTION" | "DEVICE";

export interface TreeItemData {
    id: string,
    name: string,
    type: TreeItemType,
    driver?: Driver,
    device?: Device,
    supportsDiscovery: boolean,
    supportsBrowsing: boolean,
    supportsReading: boolean,
    supportsWriting: boolean,
    supportsSubscribing: boolean,
    supportsPublishing: boolean,
    children?: readonly TreeItemData[]
}
