/* tslint:disable */
/* eslint-disable */

export interface NewsEntry {
    id: number;
    title: string;
    newsDate: Date;
    description: string;
}

export interface HttpClient<O> {

    request<R>(requestConfig: { method: string; url: string; queryParams?: any; data?: any; copyFn?: (data: R) => R; options?: O; }): RestResponse<R>;
}

export class RestApplicationClient<O> {

    constructor(protected httpClient: HttpClient<O>) {
    }

    /**
     * HTTP DELETE /api/news
     * Java method: com.toddysoft.ui.modules.news.controller.NewsController.deleteNewsEntry
     */
    deleteNewsEntry(arg0: NewsEntry, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/news`, data: arg0, options: options });
    }

    /**
     * HTTP GET /api/news
     * Java method: com.toddysoft.ui.modules.news.controller.NewsController.getAllNewsEntries
     */
    getAllNewsEntries(options?: O): RestResponse<NewsEntry[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/news`, options: options });
    }

    /**
     * HTTP POST /api/news
     * Java method: com.toddysoft.ui.modules.news.controller.NewsController.saveNewsEntry
     */
    saveNewsEntry(arg0: NewsEntry, options?: O): RestResponse<NewsEntry> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/news`, data: arg0, options: options });
    }

    /**
     * HTTP POST /api/news/read/{id}
     * Java method: com.toddysoft.ui.modules.news.controller.NewsController.readNewsEntry
     */
    readNewsEntry(id: number, options?: O): RestResponse<NewsEntry> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/news/read/${id}`, options: options });
    }

    /**
     * HTTP GET /api/news/{id}
     * Java method: com.toddysoft.ui.modules.news.controller.NewsController.getNewsEntryById
     */
    getNewsEntryById(id: number, options?: O): RestResponse<NewsEntry> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/news/${id}`, options: options });
    }
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
