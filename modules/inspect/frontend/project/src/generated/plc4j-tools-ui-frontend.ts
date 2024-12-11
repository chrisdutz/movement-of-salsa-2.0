/* tslint:disable */
/* eslint-disable */

export interface DeviceEvent extends UiApplicationEvent<Device> {
    source: Device;
}

export interface Device {
    id: number;
    name: string;
    protocolCode: string;
    transportCode: string;
    transportUrl: string;
    options: { [index: string]: string };
    attributes: { [index: string]: string };
}

export interface DeviceAddress {
    name: string;
    address: string;
    type: string;
    arrayInfo: ArrayInfo[];
    readable: boolean;
    writable: boolean;
    subscribable: boolean;
    publishable: boolean;
    children: { [index: string]: DeviceAddress };
}

export interface Driver {
    code: string;
    name: string;
    metadata: PlcDriverMetadata;
}

export interface UiApplicationEvent<T> extends ApplicationEvent {
    source: T;
    moduleName: string;
    actionName: string;
}

export interface ArrayInfo {
    lowerBound: number;
    upperBound: number;
}

export interface PlcDriverMetadata {
    protocolConfigurationOptionMetadata?: OptionMetadata;
    defaultTransportCode?: string;
    supportedTransportCodes: string[];
    discoverySupported: boolean;
}

export interface ApplicationEvent extends EventObject {
    timestamp: number;
}

export interface OptionMetadata {
    options: Option[];
    requiredOptions: Option[];
}

export interface EventObject extends Serializable {
    source: any;
}

export interface Option {
    key: string;
    type: OptionType;
    defaultValue?: any;
    since?: string;
    description: string;
    required: boolean;
}

export interface Serializable {
}

export interface HttpClient<O> {

    request<R>(requestConfig: { method: string; url: string; queryParams?: any; data?: any; copyFn?: (data: R) => R; options?: O; }): RestResponse<R>;
}

export class RestApplicationClient<O> {

    constructor(protected httpClient: HttpClient<O>) {
    }

    /**
     * HTTP DELETE /api/devices
     * Java method: com.toddysoft.ui.modules.inspect.controller.DeviceController.deleteDevice
     */
    deleteDevice(arg0: Device, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/devices`, data: arg0, options: options });
    }

    /**
     * HTTP GET /api/devices
     * Java method: com.toddysoft.ui.modules.inspect.controller.DeviceController.getAllDevices
     */
    getAllDevices(options?: O): RestResponse<Device[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/devices`, options: options });
    }

    /**
     * HTTP POST /api/devices
     * Java method: com.toddysoft.ui.modules.inspect.controller.DeviceController.saveDevice
     */
    saveDevice(arg0: Device, options?: O): RestResponse<Device> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/devices`, data: arg0, options: options });
    }

    /**
     * HTTP GET /api/devices/browse/{id}
     * Java method: com.toddysoft.ui.modules.inspect.controller.DeviceController.browseDevice
     */
    browseDevice(id: number, options?: O): RestResponse<DeviceAddress[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/devices/browse/${id}`, options: options });
    }

    /**
     * HTTP POST /api/devices/read/{id}
     * Java method: com.toddysoft.ui.modules.inspect.controller.DeviceController.readDevice
     */
    readDevice(id: number, arg1: string[], options?: O): RestResponse<{ [index: string]: any }> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/devices/read/${id}`, data: arg1, options: options });
    }

    /**
     * HTTP GET /api/devices/{id}
     * Java method: com.toddysoft.ui.modules.inspect.controller.DeviceController.getDeviceById
     */
    getDeviceById(id: number, options?: O): RestResponse<Device> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/devices/${id}`, options: options });
    }

    /**
     * HTTP GET /api/drivers
     * Java method: com.toddysoft.ui.modules.inspect.controller.DriverController.getAllDrivers
     */
    getAllDrivers(options?: O): RestResponse<Driver[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/drivers`, options: options });
    }

    /**
     * HTTP GET /api/drivers/discover/{protocolCode}
     * Java method: com.toddysoft.ui.modules.inspect.controller.DriverController.discover
     */
    discover(protocolCode: string, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/drivers/discover/${protocolCode}`, options: options });
    }
}

export type RestResponse<R> = Promise<Axios.GenericAxiosResponse<R>>;

export type OptionType = "BOOLEAN" | "INT" | "LONG" | "FLOAT" | "DOUBLE" | "STRING" | "STRUCT";

function uriEncoding(template: TemplateStringsArray, ...substitutions: any[]): string {
    let result = "";
    for (let i = 0; i < substitutions.length; i++) {
        result += template[i];
        result += encodeURIComponent(substitutions[i]);
    }
    result += template[template.length - 1];
    return result;
}


// Added by 'AxiosClientExtension' extension

import axios from "axios";
import * as Axios from "axios";

declare module "axios" {
    export interface GenericAxiosResponse<R> extends Axios.AxiosResponse {
        data: R;
    }
}

class AxiosHttpClient implements HttpClient<Axios.AxiosRequestConfig> {

    constructor(private axios: Axios.AxiosInstance) {
    }

    request<R>(requestConfig: { method: string; url: string; queryParams?: any; data?: any; copyFn?: (data: R) => R; options?: Axios.AxiosRequestConfig; }): RestResponse<R> {
        function assign(target: any, source?: any) {
            if (source != undefined) {
                for (const key in source) {
                    if (source.hasOwnProperty(key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        }

        const config: Axios.AxiosRequestConfig = {};
        config.method = requestConfig.method as typeof config.method;  // `string` in axios 0.16.0, `Method` in axios 0.19.0
        config.url = requestConfig.url;
        config.params = requestConfig.queryParams;
        config.data = requestConfig.data;
        assign(config, requestConfig.options);
        const copyFn = requestConfig.copyFn;

        const axiosResponse = this.axios.request(config);
        return axiosResponse.then(axiosResponse => {
            if (copyFn && axiosResponse.data) {
                (axiosResponse as any).originalData = axiosResponse.data;
                axiosResponse.data = copyFn(axiosResponse.data);
            }
            return axiosResponse;
        });
    }
}

export class AxiosRestApplicationClient extends RestApplicationClient<Axios.AxiosRequestConfig> {

    constructor(baseURL: string, axiosInstance: Axios.AxiosInstance = axios.create()) {
        axiosInstance.defaults.baseURL = baseURL;
        super(new AxiosHttpClient(axiosInstance));
    }
}
