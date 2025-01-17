import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import AdminList from "mainApp/components/AdminList";
import {
    CourseDto, CourseType,
    Lesson,
    RestApplicationClient,
    RestResponse
} from "../generated/tools-ui-frontend.ts";
import axios, * as Axios from "axios";
import {AxiosRequestConfig} from "axios";
import {useEffect, useState} from "react";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

export default function LessonsAdminModule() {
    const [courseTypes, setCourseTypes] = useState<CourseType[]>()
    useEffect(() => {
        restClient.findAll$GET$api_coursetypes().then(value => {
            setCourseTypes(value.data)
        })
    }, []);

    return AdminList<CourseDto>({
        emptyItem: {
            id: 0, courseTypeId: 0, courseTypeCode: "", closed: false, lessons: []
        },
        listColumns: [
            {sortable: true, header: "Start Date", field: "listOrder"},
            {sortable: true, header: "Course Type", field: "code"},
            {sortable: true, header: "Closed", field: "closed"}
        ],
        listSortColumn: "listOrder",
        editorColumns: [
            {label: "Course Type", required: true, editable: true, fieldType: "Select", field: "courseTypeId",
                selectOptions: courseTypes, optionLabelFunction: (item:CourseType) => {return (item) ? `${item.code} - ${item.title}` : "Select an option"}},
            {label: "Closed", required: false, editable: true, fieldType: "Boolean", field: "closed"},
            {
                label: "Lessons", required: false, editable: true, fieldType: "Custom", field: "lessons", fieldEditor:
                    (value, setValue) => {
                        return AdminList<Lesson>({
                            emptyItem: {
                                id: 0,
                                startTime: new Date(),
                                endTime: new Date(),
                                location: "",
                                locationLat: 0,
                                locationLon: 0
                            },
                            listColumns: [
                                {sortable: true, header: "Date", field: "startTime"},
                                {sortable: true, header: "Start Time", field: "startTime"},
                                {sortable: true, header: "End Time", field: "endTime"},
                                {sortable: true, header: "Location", field: "location"}
                            ],
                            listSortColumn: "startTime",
                            editorColumns: [
                                {
                                    label: "Date",
                                    required: true,
                                    editable: true,
                                    fieldType: "Date",
                                    field: "startTime"
                                },
                                {label: "Start Time", required: true, editable: true, fieldType: "Time", field: "startTime"},
                                {label: "End Time", required: true, editable: true, fieldType: "Time", field: "endTime"},
                                {label: "Location", required: true, editable: true, fieldType: "Text", field: "location"},
                            ],
                            controller: {
                                findAll(): RestResponse<Lesson[]> {
                                    const response: Axios.GenericAxiosResponse<Lesson[]> = {
                                        data: value.lessons,
                                        status: 200,
                                        statusText: "OK",
                                        headers: {},
                                        config: {headers: {} as Axios.AxiosRequestHeaders},
                                        request: {},
                                    };
                                    return Promise.resolve(response);
                                },
                                save(entry: Lesson): RestResponse<Lesson> {
                                    // Replace the old instance of the lesson with the new one.
                                    value.lessons = value.lessons.map(curValue => curValue.id == entry.id ? entry : curValue)
                                    // TODO: Handle insertions
                                    setValue(value)
                                    const response: Axios.GenericAxiosResponse<Lesson> = {
                                        data: entry,
                                        status: 200,
                                        statusText: "OK",
                                        headers: {},
                                        config: {headers: {} as Axios.AxiosRequestHeaders},
                                        request: {},
                                    };
                                    return Promise.resolve(response);
                                },
                                delete(entry: Lesson): RestResponse<void> {
                                    // Filter out the currently selected item.
                                    value.lessons = value.lessons.filter(curValue => curValue.id != entry.id)
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
            findAll(options?: AxiosRequestConfig | undefined): RestResponse<CourseDto[]> {
                return restClient.findAll$GET$api_courses(options);
            },
            save(entry: CourseDto, options?: AxiosRequestConfig | undefined): RestResponse<CourseDto> {
                return restClient.save$POST$api_courses(entry, options);
            },
            delete: function (entry: CourseDto, options?: AxiosRequestConfig): RestResponse<void> {
                return restClient.deleteById$DELETE$api_courses_id(entry.id, options)
            }
        },
    })
}
