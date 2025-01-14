import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import AdminList from "mainApp/components/AdminList";
import {CourseType, CourseTypeRate, RestApplicationClient, RestResponse} from "../generated/tools-ui-frontend.ts";
import axios, * as Axios from "axios";
import {AxiosRequestConfig} from "axios";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

export default function LessonTypesAdminModule() {
    return AdminList<CourseType>({
        emptyItem: {
            id: 0, code: "", description: "", hidden: false, image: {
                height: 0, width: 0, imageData: ""
            }, listOrder: 0, rates: [], title: ""
        },
        listColumns: [
            {sortable: true, header: "Pos", field: "listOrder"},
            {sortable: true, header: "Code", field: "code"},
            {sortable: true, header: "Title", field: "title"},
            {sortable: true, header: "Hidden", field: "hidden"}
        ],
        listSortColumn: "listOrder",
        editorColumns: [
            {label: "Position", required: true, editable: true, fieldType: "Number", field: "listOrder"},
            {label: "Code", required: true, editable: true, fieldType: "Text", field: "code"},
            {label: "Title", required: true, editable: true, fieldType: "Text", field: "title"},
            {label: "Description", required: true, editable: true, fieldType: "Editor", field: "description"},
            {label: "Hidden", required: false, editable: true, fieldType: "Boolean", field: "hidden"},
            {label: "Image", required: true, editable: true, fieldType: "Image", field: "image"},
            {
                label: "Rates", required: false, editable: true, fieldType: "Custom", field: "rates", fieldEditor:
                    (value, setValue) => {
                        return AdminList<CourseTypeRate>({
                            emptyItem: {
                                id: 0, listOrder: 0, title: "", price: 0, coupleRate: false
                            },
                            listColumns: [
                                {sortable: true, header: "Position", field: "listOrder"},
                                {sortable: true, header: "Title", field: "title"},
                                {sortable: true, header: "Price", field: "price"},
                                {sortable: true, header: "Couple Rate", field: "coupleRate"}
                            ],
                            listSortColumn: "listOrder",
                            editorColumns: [
                                {
                                    label: "Position",
                                    required: true,
                                    editable: true,
                                    fieldType: "Number",
                                    field: "listOrder"
                                },
                                {label: "Title", required: true, editable: true, fieldType: "Text", field: "title"},
                                {label: "Price", required: true, editable: true, fieldType: "Number", field: "price"},
                                {
                                    label: "Couple Rate",
                                    required: false,
                                    editable: true,
                                    fieldType: "Boolean",
                                    field: "coupleRate"
                                },
                            ],
                            controller: {
                                findAll(): RestResponse<CourseTypeRate[]> {
                                    const response: Axios.GenericAxiosResponse<CourseTypeRate[]> = {
                                        data: value.rates,
                                        status: 200,
                                        statusText: "OK",
                                        headers: {},
                                        config: {headers: {} as Axios.AxiosRequestHeaders},
                                        request: {},
                                    };
                                    return Promise.resolve(response);
                                },
                                save(entry: CourseTypeRate): RestResponse<CourseTypeRate> {
                                    // Replace the old instance of the rate with the new one.
                                    value.rates = value.rates.map(curValue => curValue.id == entry.id ? entry : curValue)
                                    setValue(value)
                                    const response: Axios.GenericAxiosResponse<CourseTypeRate> = {
                                        data: entry,
                                        status: 200,
                                        statusText: "OK",
                                        headers: {},
                                        config: {headers: {} as Axios.AxiosRequestHeaders},
                                        request: {},
                                    };
                                    return Promise.resolve(response);
                                },
                                delete(entry: CourseTypeRate): RestResponse<void> {
                                    // Filter out the currently selected item.
                                    value.rates = value.rates.filter(curValue => curValue.id != entry.id)
                                    setValue(value)
                                    const response: Axios.GenericAxiosResponse<void> = {
                                        data: undefined,
                                        status: 200,
                                        statusText: "OK",
                                        headers: {},
                                        config: {headers: {} as Axios.AxiosRequestHeaders},
                                        request: {},
                                    };
                                    return Promise.resolve(response);
                                },
                            },
                        })
                    }
            }
        ],
        controller: {
            findAll(options?: AxiosRequestConfig | undefined): RestResponse<CourseType[]> {
                return restClient.findAll(options);
            },
            save(entry: CourseType, options?: AxiosRequestConfig | undefined): RestResponse<CourseType> {
                return restClient.save(entry, options);
            },
            delete: function (entry: CourseType, options?: AxiosRequestConfig): RestResponse<void> {
                return restClient.deleteById(entry.id, options)
            }
        },
    })
}
