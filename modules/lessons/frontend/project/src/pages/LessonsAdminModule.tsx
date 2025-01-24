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
import LessonsAdminModuleRegistrations from "./LessonsAdminModuleRegistrations.tsx";
import LessonsAdminModuleCouples from "./LessonsAdminModuleCouples.tsx";

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
            {sortable: true, header: "Start Date", getter: item => {
                    if(item.lessons && item.lessons.length > 0) {
                        const firstLesson = item.lessons.reduce((earliest, current) =>
                            current.startTime < earliest.startTime ? current : earliest);
                        return firstLesson.startTime
                    } else {
                        return ""
                    }
                }, fieldType: "DateTime"},
            {sortable: true, header: "Course Type", field: "courseTypeCode"},
            {sortable: true, header: "Closed", field: "closed"}
        ],
        listSortColumn: "listOrder",
        listActions: [
            {
                icon: "fa-solid fa-sack-dollar",
                label: "Reg.",
                onClick: (item, setChildEditor) => {
                    setChildEditor(<LessonsAdminModuleRegistrations course={item} onClose={() => setChildEditor(undefined)}/>)
                }
            },
            {
                icon: "fa-solid fa-people",
                label: "Couples",
                onClick: (item, setChildEditor) => {
                    setChildEditor(<LessonsAdminModuleCouples course={item} onClose={() => setChildEditor(undefined)}/>)
                }
            },
            {
                icon: "fa-solid fa-video",
                label: "Videos",
                onClick: item => {
                    console.log("Videos Clicked", item)
                }
            },
            {
                icon: "fa-solid fa-list",
                label: "List",
                onClick: item => {
                    console.log("List Clicked", item)
                }
            }
        ],
        editorColumns: [
            {label: "Course Type", required: true, editable: true, fieldType: "Select", field: "courseTypeId",
                selectOptions: courseTypes,
                optionLabelFunction: (item:CourseType) => {return (item) ? `${item.code} - ${item.title}` : "Select an option"},
                optionValueFunction: (item:CourseType) => item.id},
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
                                {sortable: true, header: "Start Time", field: "startTime", fieldType: "DateTime"},
                                {sortable: true, header: "Location", field: "location"}
                            ],
                            listSortColumn: "startTime",
                            editorColumns: [
                                {label: "Date", required: true, editable: true, fieldType: "Date", field: "startTime"},
                                {label: "Start Time", required: true, editable: true, fieldType: "Time", field: "startTime"},
                                {label: "End Time", required: true, editable: true, fieldType: "Time", field: "endTime"},
                                // TODO: Add something to reset lat and lon, if the location changes
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
                                    // Insert a new entry.
                                    if(entry.id == 0) {
                                        // Generate a fake id
                                        entry.id = (value.lessons.length + 1) * -1;
                                        value.lessons.push(entry);
                                    }
                                    // Replace the old instance of the rate with the new one.
                                    else {
                                        value.lessons = value.lessons.map(curValue => curValue.id == entry.id ? entry : curValue)
                                    }
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
