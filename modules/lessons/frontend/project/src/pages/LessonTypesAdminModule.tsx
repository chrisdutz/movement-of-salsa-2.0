import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import AdminList from "mainApp/components/AdminList";
import {CourseType, RestApplicationClient, RestResponse} from "../generated/tools-ui-frontend.ts";
import axios, {AxiosRequestConfig} from "axios";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

export default function LessonTypesAdminModule() {
    return AdminList<CourseType>({
        emptyItem: {
            id: 0, code: "", description: "", image: {
                height: 0, width: 0, imageData: ""
            }, listOrder: 0, rates: [], title: ""
        },
        listColumns: [
            {sortable: true, header: "Pos", field: "listOrder"},
            {sortable: true, header: "Code", field: "code"},
            {sortable: true, header: "Title", field: "title"}
        ],
        listSortColumn: "listPosition",
        editorColumns: [
            {label: "Position", required: true, editable: true, fieldType: "Number", field: "listOrder"},
            {label: "Code", required: true, editable: true, fieldType: "Text", field: "code"},
            {label: "Title", required: true, editable: true, fieldType: "Text", field: "title"},
            {label: "Description", required: true, editable: true, fieldType: "Editor", field: "description"},
            {label: "Image", required: true, editable: true, fieldType: "Image", field: "image"}
        ],
        controller: {
            findAll(options?: AxiosRequestConfig | undefined): RestResponse<CourseType[]> {
                return restClient.findAll(options);
            },
            save(entry: CourseType, options?: AxiosRequestConfig | undefined): RestResponse<CourseType> {
                return restClient.save(entry, options);
            },
            delete: function (entry: CourseType, options?: AxiosRequestConfig): RestResponse<void> {
                return restClient.deleteById(entry.id.toString(), options)
            }
        },
    })
}
