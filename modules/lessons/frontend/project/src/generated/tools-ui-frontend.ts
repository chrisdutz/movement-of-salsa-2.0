/* tslint:disable */
/* eslint-disable */

export interface HttpClient<O> {

    request<R>(requestConfig: { method: string; url: string; queryParams?: any; data?: any; copyFn?: (data: R) => R; options?: O; }): RestResponse<R>;
}

export class RestApplicationClient<O> {

    constructor(protected httpClient: HttpClient<O>) {
    }

    /**
     * HTTP GET /api/course-types
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseTypeController.findAll
     */
    findAll(options?: O): RestResponse<CourseType[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/course-types`, options: options });
    }

    /**
     * HTTP POST /api/course-types
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseTypeController.save
     */
    save(arg0: CourseType, options?: O): RestResponse<CourseType> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/course-types`, data: arg0, options: options });
    }

    /**
     * HTTP DELETE /api/course-types/{id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseTypeController.deleteById
     */
    deleteById(id: string, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/course-types/${id}`, options: options });
    }

    /**
     * HTTP GET /api/course-types/{id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseTypeController.findById
     */
    findById(id: string, options?: O): RestResponse<CourseType> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/course-types/${id}`, options: options });
    }
}

export interface CourseType {
    code: string;
    description: string;
    id: number;
    image: Image;
    listOrder: number;
    rates: CourseTypeRate[];
    title: string;
}

export interface CourseTypeRate {
    coupleRate: boolean;
    courseType: CourseType;
    id: number;
    listOrder: number;
    price: number;
    title: string;
}

export interface Image {
    height: number;
    imageData: string;
    width: number;
}

export type RestResponse<R> = Promise<Axios.GenericAxiosResponse<R>>;

function uriEncoding(template: TemplateStringsArray, ...substitutions: any[]): string {
    let result = "";
    for (let i = 0; i < substitutions.length; i++) {
        result += template[i];
        result += encodeURIComponent(substitutions[i]);
    }
    result += template[template.length - 1];
    return result;
}


// Added by 'GenericInterfaceWorkaroundExtension' extension

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
