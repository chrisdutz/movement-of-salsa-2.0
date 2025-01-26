import {Card} from "primereact/card";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import axios from "axios";
import {RootState} from "mainApp/Store";
import {CourseDto, CourseType, RestApplicationClient} from "../generated/tools-ui-frontend.ts";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Image} from "primereact/image";
import {Chip} from "primereact/chip";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function NewsMainModule() {
    const authToken = useSelector((state: RootState)=> {
        return state.authentication.authToken
    })
    const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
    const [upAndRunningCourses, setUpAndRunningCourses] = useState<Record<string, CourseDto[]>>({})

    useEffect(() => {
        // Make all axios requests use the bearer token from now on.
        axios.defaults.headers.common['Authorization'] = "Bearer " + authToken
        restClient.findAllNotHidden().then(courseTypesResponse => {
            setCourseTypes(courseTypesResponse.data)
        })
        restClient.findUpAndRunningCourses().then(result => {
            console.log("Result", upAndRunningCourses.data)
            const newUpAndRunningCourses:Record<string, CourseDto[]> = {}
            result.data.forEach(course => {
                if(!newUpAndRunningCourses[course.courseTypeCode]) {
                    newUpAndRunningCourses[course.courseTypeCode] = [];
                }
                newUpAndRunningCourses[course.courseTypeCode] = [...newUpAndRunningCourses[course.courseTypeCode], course]
            })
            console.log("Updated Map", newUpAndRunningCourses)
            setUpAndRunningCourses(newUpAndRunningCourses)
        })
    }, [authToken]);

    return (
        <div className="flex flex-column gap-4">
            {courseTypes && courseTypes.map(value => {
                return (<Card title={value.title}>
                        <div className="flex flex-column md:flex-row gap-4 w-full">
                            <div>
                                <Image width="240" height="240" src={value.image.imageData}/>
                            </div>
                            <div className="flex flex-column gap-2">
                                <div dangerouslySetInnerHTML={{__html: value.description}}/>
                                <h4 className="mt-1 mb-1">Kommende Kurse:</h4>
                                {upAndRunningCourses[value.code] && upAndRunningCourses[value.code].length > 0 ? (
                                    upAndRunningCourses[value.code].map(course => {
                                        // If all lessons are on the same weekday the title should be "Tuesdays (Weekly)", if it's on multiple days, "Saturday, Sunday (Workshop)"
                                        let courseStarted = false
                                        const weekdays:number[] = []
                                        const locations:string[] = []
                                        const startTimes:string[] = []
                                        const endTimes:string[] = []
                                        course.lessons.forEach(lesson => {
                                            const startTime = new Date(lesson.startTime);
                                            const endTime = new Date(lesson.endTime);
                                            if (startTime.getTime() < Date.now()) {
                                                courseStarted = true
                                            }
                                            if(!weekdays.includes(startTime.getDay())) {
                                                weekdays.push(startTime.getDay());
                                            }
                                            if(!locations.includes(lesson.location)) {
                                                locations.push(lesson.location);
                                            }
                                            if(!startTimes.includes(startTime.toLocaleTimeString())) {
                                                startTimes.push(startTime.toLocaleTimeString());
                                            }
                                            if(!endTimes.includes(endTime.toLocaleTimeString())) {
                                                endTimes.push(endTime.toLocaleTimeString());
                                            }
                                        })
                                        const title:string = (weekdays.length == 1) ?
                                            `${dayNames[weekdays[0]]}s (Wöchentlich)` :
                                            weekdays.map(weekday => dayNames[weekday]).join(", ") + " (Workshop)"

                                        console.log("Collections", weekdays, locations, startTimes, endTimes)

                                        let description:string = ""
                                        // This is the case where it's a course with all lessons happening on the same day at the same time in the same location.
                                        if ((weekdays.length == 1) && (locations.length == 1) && (startTimes.length == 1) && (endTimes.length == 1)) {
                                            const firstLesson = course.lessons.reduce((earliest, current) =>
                                                current.startTime < earliest.startTime ? current : earliest);
                                            const lastLesson = course.lessons.reduce((last, current) =>
                                                current.startTime > last.startTime ? current : last);
                                            description += `${course.lessons.length} Termine vom ${new Date(firstLesson.startTime).toLocaleDateString([], {
                                                day: '2-digit',
                                                month: 'short',
                                            })} bis ${new Date(lastLesson.startTime).toLocaleDateString([], {
                                                day: '2-digit',
                                                month: 'short',
                                            })} jeweils von ${new Date(firstLesson.startTime).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })} bis ${new Date(firstLesson.endTime).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })} Uhr in: ${firstLesson.location}`
                                        }
                                        // Otherwise list all dates, times and locations.
                                        else {
                                            description += `${course.lessons.length} Termine:<ul>`
                                            course.lessons.forEach(lesson => {
                                                description += `<li>${new Date(lesson.startTime).toLocaleDateString([], {
                                                    weekday: 'short',
                                                    day: '2-digit',
                                                    month: 'short',
                                                })} von ${new Date(lesson.startTime).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })} bis ${new Date(lesson.endTime).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })} Uhr`
                                                if(locations.length > 1) {
                                                    description += ` in: ${lesson.location}`
                                                }
                                                description += `</li>`
                                            })
                                            description += `</ul>`
                                            if(locations.length == 1) {
                                                description += ` in: ${locations[0]}`
                                            }
                                        }

                                        return (<Card title={title} style={{ backgroundColor: 'lightblue' }}>
                                            {courseStarted && (
                                                <b className="text-red-600">Achtung - Der Kurs hat bereits begonnen!</b>
                                            )}
                                            <div dangerouslySetInnerHTML={{__html: description}}/>
                                            {course.closed ? (
                                                <p className="text-red-600">Anmeldung nicht mehr möglich</p>
                                            ):(
                                                <p>Anmelden</p>
                                            )}
                                        </Card>)
                                    })
                                ) : (
                                    <b>Aktuell sind neue Kurse in Vorbereitung und werden demnächst hier aufrufbar sein.</b>
                                )}
                                <h4 className="mt-1 mb-1">Tarife:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {value.rates.map(rate => {
                                        return <Chip label={rate.title + " " + rate.price + "€"}/>
                                    })}
                                </div>
                            </div>
                        </div>
                    </Card>
                )})}
        </div>
    )
}