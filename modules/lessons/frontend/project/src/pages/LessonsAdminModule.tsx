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
import React, {useEffect, useState} from "react";
import LessonsAdminModuleRegistrations from "./LessonsAdminModuleRegistrations.tsx";
import LessonsAdminModuleCouples from "./LessonsAdminModuleCouples.tsx";
import store, {
    updateMainLayoutSubTitle,
    UpdateMainLayoutSubTitleAction,
} from "mainApp/Store";
import {Dialog} from "primereact/dialog";
import {Calendar} from "primereact/calendar";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

interface CopyCourseData {
    baseCourse: CourseDto
    setStateAction: React.Dispatch<React.SetStateAction<CourseDto[]>>
}

// Make sure date-strings are correctly parsed as Date objects.
const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const isoTimeRegex = /^\d{2}:\d{2}:\d{2}$/;
axios.interceptors.response.use((response) => {
    function transformDates(obj: any): any {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (typeof obj[key] === 'string' && isoDateTimeRegex.test(obj[key])) {
                    obj[key] = new Date(obj[key]);
                } else if (typeof obj[key] === 'string' && isoTimeRegex.test(obj[key])) {
                    obj[key] = new Date("1970-01-01T" + obj[key])
                } else if (typeof obj[key] === 'object') {
                    transformDates(obj[key]);
                }
            }
        }
        return obj;
    }
    response.data = transformDates(response.data);
    return response;
});

export default function LessonsAdminModule() {
    const [courseTypes, setCourseTypes] = useState<CourseType[]>()
    const [copyCourseStartDataDialogShow, setCopyCourseStartDataDialogShow] = useState(false)
    const [copyCourseData, setCopyCourseData] = useState<CopyCourseData | undefined>()

    useEffect(() => {
        restClient.findAll$GET$api_coursetypes().then(value => {
            setCourseTypes(value.data)
        })
    }, []);

    return (<>
        <Dialog header="Select start Date" visible={copyCourseStartDataDialogShow} onHide={() => {if (!copyCourseStartDataDialogShow) return; setCopyCourseStartDataDialogShow(false); }}>
            <Calendar id="newCourseStartDate" onChange={(event) => {
                if(!copyCourseData) return
                if(!event.value) return

                // Calculate how many days later than the start day of the selected course was
                // (so we can update all lessons accordingly)
                const selectedStartDate = new Date(event.value)
                const firstLessonBaseCourse = copyCourseData.baseCourse.lessons.reduce((earliest, current) =>
                    current.startTime < earliest.startTime ? current : earliest);

                // Calculate the number of days between the start of the selected course and start date
                const millisecondsPerDay = 1000 * 60 * 60 * 24;
                const diffInMilliseconds = selectedStartDate.getTime() - new Date(firstLessonBaseCourse.startTime).getTime();
                const diffInDays = Math.ceil(diffInMilliseconds / millisecondsPerDay);
                console.log("Day Difference", diffInDays)

                const newCourse = {
                    ...copyCourseData.baseCourse,
                    id: 0,
                    lessons: copyCourseData.baseCourse.lessons.map(lesson => {
                        // Clone the lesson
                        const newLesson = {
                            ...lesson,
                            id: 0,
                            startTime: new Date(lesson.startTime),
                            endTime: new Date(lesson.endTime),
                        }

                        // Update the start and end time by adding the diffDays.
                        newLesson.startTime.setDate(newLesson.startTime.getDate() + diffInDays)
                        newLesson.endTime.setDate(newLesson.endTime.getDate() + diffInDays)

                        return newLesson
                    }),
                }
                restClient.save$POST$api_courses(newCourse).then((response) => {
                    copyCourseData.setStateAction(oldCourses => [...oldCourses, response.data])
                })
                setCopyCourseData(undefined)
                setCopyCourseStartDataDialogShow(false)
            }}/>
        </Dialog>
        {
        AdminList<CourseDto>({
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
            listSortColumn: "StartDate",
            listSortOrder: -1,
            listActions: [
                {
                    icon: "fa-solid fa-copy",
                    tooltip: "Create follow-up course",
                    onClick: (course, setCourses) => {
                        console.log("Opening dialog", course, setCourses, true)
                        // Show a dialog asking for a start-date and use that as basis for creating the new one.
                        setCopyCourseData({baseCourse: course, setStateAction: setCourses})
                        setCopyCourseStartDataDialogShow(true)
                    }
                },
                {
                    icon: "fa-solid fa-sack-dollar",
                    tooltip: "Registrations",
                    onClick: (item, _, setChildEditor) => {
                        setChildEditor(<LessonsAdminModuleRegistrations course={item} onClose={() => setChildEditor(undefined)}/>)
                        const firstLesson = item.lessons.reduce((earliest, current) =>
                            current.startTime < earliest.startTime ? current : earliest);
                        const firstLessonDate:string = firstLesson ? " - " + new Date(firstLesson.startTime).toLocaleDateString() : ""
                        const action: UpdateMainLayoutSubTitleAction = {subTitle: `${item.courseTypeCode}${firstLessonDate} / Registrations`}
                        store.dispatch(updateMainLayoutSubTitle(action))
                    }
                },
                {
                    icon: "fa-solid fa-people",
                    tooltip: "Couples",
                    onClick: (item, _, setChildEditor) => {
                        setChildEditor(<LessonsAdminModuleCouples course={item} onClose={() => setChildEditor(undefined)}/>)
                        const firstLesson = item.lessons.reduce((earliest, current) =>
                            current.startTime < earliest.startTime ? current : earliest);
                        const firstLessonDate:string = firstLesson ? " - " + new Date(firstLesson.startTime).toLocaleDateString() : ""
                        const action: UpdateMainLayoutSubTitleAction = {subTitle: `${item.courseTypeCode}${firstLessonDate} / Couples`}
                        store.dispatch(updateMainLayoutSubTitle(action))
                    }
                },
                {
                    icon: "fa-solid fa-video",
                    tooltip: "Videos",
                    onClick: item => {
                        console.log("Videos Clicked", item)
                        const firstLesson = item.lessons.reduce((earliest, current) =>
                            current.startTime < earliest.startTime ? current : earliest);
                        const firstLessonDate:string = firstLesson ? " - " + new Date(firstLesson.startTime).toLocaleDateString() : ""
                        const action: UpdateMainLayoutSubTitleAction = {subTitle: `${item.courseTypeCode}${firstLessonDate} / Videos`}
                        store.dispatch(updateMainLayoutSubTitle(action))
                    }
                },
                {
                    icon: "fa-solid fa-list",
                    tooltip: "List",
                    onClick: item => {
                        console.log("List Clicked", item)
                        const firstLesson = item.lessons.reduce((earliest, current) =>
                            current.startTime < earliest.startTime ? current : earliest);
                        const firstLessonDate:string = firstLesson ? " - " + new Date(firstLesson.startTime).toLocaleDateString() : ""
                        const action: UpdateMainLayoutSubTitleAction = {subTitle: `${item.courseTypeCode}${firstLessonDate} / List`}
                        store.dispatch(updateMainLayoutSubTitle(action))
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
                                    {sortable: true, header: "End Time", field: "endTime", fieldType: "Time"},
                                    {sortable: true, header: "Location", field: "location"}
                                ],
                                listSortColumn: "startTime",
                                listActions: [
                                    {
                                        icon: "fa-solid fa-copy",
                                        tooltip: "Create follow-up lesson",
                                        onClick: (lesson) => {
                                            // Clone the lesson
                                            const newLesson = {
                                                ...lesson,
                                                id: 0,
                                                startTime: new Date(lesson.startTime),
                                                endTime: new Date(lesson.endTime),
                                            }

                                            // Update the start and end time by adding 7 days
                                            newLesson.startTime.setDate(new Date(lesson.startTime).getDate() + 7)
                                            newLesson.endTime.setDate(new Date(lesson.endTime).getDate() + 7)

                                            // Update the course's lessons
                                            setValue({
                                                ...value,
                                                lessons: [...value.lessons, newLesson]
                                            })
                                        }
                                    }
                                ],
                                editorColumns: [
                                    {label: "Start Time", required: true, editable: true, fieldType: "DateTime", field: "startTime"},
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
    </>)
}
