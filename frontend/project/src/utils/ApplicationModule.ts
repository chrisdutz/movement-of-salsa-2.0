import {UiApplicationEvent} from "../generated/plc4j-tools-ui-frontend.ts";

export interface ApplicationModule {
    getModuleName(): string;
    onApplicationEvent(event: UiApplicationEvent<object>): void;
}

export function isApplicationModule(object: any): object is ApplicationModule {
    return ('getModuleName' in object) && ('onApplicationEvent' in object);
}
