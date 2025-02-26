import {Card} from "primereact/card";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import axios from "axios";
import {RootState} from "mainApp/Store";
import {
    CourseDto,
    CourseRegistrationDto,
    CourseType,
    CourseTypeRate, GuestUserDto, RegisteredUserDto,
    RestApplicationClient, Sex, UserDto
} from "../generated/tools-ui-frontend.ts";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {Image} from "primereact/image";
import {Chip} from "primereact/chip";
import {Button} from "primereact/button";
import {Stepper, StepperRefAttributes} from "primereact/stepper";
import {StepperPanel} from "primereact/stepperpanel";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Checkbox} from "primereact/checkbox";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function NewsMainModule() {
    const wizardStepperRef = useRef<StepperRefAttributes>(null);

    const authToken = useSelector((state: RootState)=> {
        return state.authentication.authToken
    })
    const user = useSelector((state: RootState)=> {
        return state.authentication.user
    })

    // For the main list
    const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
    const [upAndRunningCourses, setUpAndRunningCourses] = useState<Record<string, CourseDto[]>>({})

    // For the registration process
    const [registration, setRegistration] = useState<CourseRegistrationDto|undefined>()
    const [availableCourseRates/*, setAvailableCourseRates*/] = useState<CourseTypeRate[]>([])
    const [previousPartners/*, setPreviousPartners*/] = useState<UserDto[]>([])

    useEffect(() => {
        // Make all axios requests use the bearer token from now on.
        axios.defaults.headers.common['Authorization'] = "Bearer " + authToken
        restClient.findAllNotHidden().then(courseTypesResponse => {
            setCourseTypes(courseTypesResponse.data)
        })
        restClient.findUpAndRunningCourses().then(result => {
            console.log("Result", result.data)
            console.log("Old Map", upAndRunningCourses)
            const newUpAndRunningCourses:Record<string, CourseDto[]> = {}
            if(result.data) {
                result.data.forEach(course => {
                    if (!newUpAndRunningCourses[course.courseTypeCode]) {
                        newUpAndRunningCourses[course.courseTypeCode] = [];
                    }
                    newUpAndRunningCourses[course.courseTypeCode] = [...newUpAndRunningCourses[course.courseTypeCode], course]
                })
            }
            console.log("Updated Map", newUpAndRunningCourses)
            setUpAndRunningCourses(newUpAndRunningCourses)
        })
    }, [authToken]);

    if(registration){
        return <Stepper ref={wizardStepperRef}>
            {!user &&
                <StepperPanel header="Gast Anmeldung">
                    <Card className="flex flex-column" style={{ backgroundColor: 'lightblue' }}>
                        <p className="flex flex-column">
                            Du kannst dich jeder Zeit als Gast zu einem unserer Kurse anmelden.
                            <b>Dabei verlierst du allerdings die Möglichkeit die Kurs-Videos anzusehen und du musst bei jedem Kurs erneut alle deine Daten eingeben.</b>
                            Wir raten dir daher, einen Account anzulegen. Bei Anmeldungen ohne Account, muss die Anmeldung jedes mal via Email bestätigt werden.
                        </p>
                        <p>
                            <b className="text-red-600">Für ein nachträgliches Umwandeln in einen normalen Account erheben wir eine Gebühr von 10€ pro Person.</b>
                        </p>
                        <p>Falls du schon über einen Account verfügst, so logge dich bitte vor der Kurs-Buchung ein.</p>
                        <p>Solltest du einen neuen Account anlegen wollen, so gehe einfach auf "Login" im Hauptmenü, führe hier eine "User Registrierung" durch und melde dich dann mit diesem User zu diesem Kurs an.</p>
                        <div className="p-fluid">
                            <div className="field mb-3">
                                <label htmlFor="fieldSex" className="font-bold">Geschlecht</label>
                                <Dropdown id="fieldSex" options={[{value: "MALE", label: "Männlich"}, {
                                    value: "FEMALE",
                                    label: "Weiblich"
                                }]} required={true} onChange={event => {
                                    if(registration && registration.registrar) {
                                        (registration?.registrar as GuestUserDto).sex = event.value as Sex
                                    }}
                                }/>

                            </div>
                            <div className="field mb-3">
                                <label htmlFor="fieldFirstName" className="font-bold">Vorname</label>
                                <InputText id="fieldFirstName" required={true} onChange={event => {
                                    if(registration && registration.registrar) {
                                        (registration?.registrar as GuestUserDto).firstName = event.target.value
                                    }}
                                }/>
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="fieldLastName" className="font-bold">Nachname</label>
                                <InputText id="fieldLastName" required={true} onChange={event => {
                                    if(registration && registration.registrar) {
                                        (registration?.registrar as GuestUserDto).lastName = event.target.value
                                    }}}/>
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="fieldEmail" className="font-bold">Email Adresse</label>
                                <InputText id="fieldEmail" type={"email"} required={true} onChange={event => {
                                    if(registration && registration.registrar) {
                                        (registration?.registrar as GuestUserDto).email = event.target.value
                                    }}}/>
                            </div>
                        </div>
                    </Card>
                    <div className="flex gap-4 pt-4 justify-content-end">
                        <Button label="Abort" severity="secondary" onClick={() => console.log("Aborted")} />
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" disabled={true} />
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => wizardStepperRef.current?.nextCallback()} />
                        <Button label="Complete" severity="secondary" disabled={true} />
                    </div>
                </StepperPanel>
            }
            <StepperPanel header="Tarif & Partner">
                <Card className="flex flex-column" style={{ backgroundColor: 'lightblue' }}>
                    <div className="p-fluid">
                        <div className="field mb-3">
                            <label htmlFor="fieldRate" className="font-bold">Tarif</label>
                            <Dropdown id="fieldRate" options={availableCourseRates} optionLabel="title" required={true} onChange={event => {
                                if(registration) {
                                    registration.rateName = event.value["title"]
                                }}
                            }/>
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="fieldPartner" className="font-bold">Partner</label>
                            <Dropdown id="fieldPartner" options={previousPartners} optionLabel="name" required={true} onChange={event => {
                                if(registration) {
                                    registration.partner = event.value
                                }}
                            }/>
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="fieldParnerFirstName" className="font-bold">Partner Vorname</label>
                            <InputText id="fieldParnerFirstName" required={true} onChange={event => {
                                if(registration) {
                                    (registration.partner as GuestUserDto).firstName = event.target.value
                                }}
                            }/>
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="fieldParnerLastName" className="font-bold">Partner Nachname</label>
                            <InputText id="fieldParnerLastName" required={true} onChange={event => {
                                if(registration) {
                                    (registration.partner as GuestUserDto).lastName = event.target.value
                                }}
                            }/>
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="fieldRemarks" className="font-bold">Anmerkungen</label>
                            <InputText id="fieldRemarks" required={true} onChange={event => {
                                if(registration) {
                                    registration.remarks = event.target.value
                                }}
                            }/>
                        </div>
                    </div>
                </Card>
                <div className="flex gap-4 pt-4 justify-content-end">
                    <Button label="Abort" severity="secondary" onClick={() => console.log("Aborted")} />
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => wizardStepperRef.current?.prevCallback()} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => wizardStepperRef.current?.nextCallback()} />
                    <Button label="Complete" severity="secondary" disabled={true} />
                </div>
            </StepperPanel>
            <StepperPanel header="Weitere Informationen">
                <Card className="flex flex-column" style={{ backgroundColor: 'lightblue' }}>
                    {registration.courseRegistrationType == "SINGLE" &&
                        <>
                            <p>Für Partnerzuweisung (Optional):</p>
                            <div className="p-fluid">
                                <div className="field mb-3">
                                    <label htmlFor="fieldSize" className="font-bold">Größe</label>
                                    <InputNumber id="fieldSize" required={true} onChange={event => {
                                        if(registration && event.value) {
                                            registration.registrar.size = event.value
                                        }}
                                    }/>
                                </div>
                            </div>
                        </>
                    }
                    <p>Für Rechnungsstellung benötigt:</p>
                    <div className="p-fluid">
                        <div className="field mb-3">
                            <label htmlFor="fieldStreet" className="font-bold">Straße</label>
                            <InputText id="fieldStreet" required={true} onChange={event => {
                                if(registration) {
                                    // Both types have a "street" property
                                    (registration.registrar as GuestUserDto).street = event.target.value
                                }}
                            }/>
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="fieldZip" className="font-bold">PLZ</label>
                            <InputText id="fieldZip" required={true} onChange={event => {
                                if(registration) {
                                    // Both types have a "street" property
                                    (registration.registrar as GuestUserDto).zip = event.target.value
                                }}
                            }/>
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="fieldCity" className="font-bold">Stadt</label>
                            <InputText id="fieldCity" required={true} onChange={event => {
                                if(registration) {
                                    // Both types have a "street" property
                                    (registration.registrar as GuestUserDto).city = event.target.value
                                }}
                            }/>
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="fieldCountry" className="font-bold">Land</label>
                            <InputText id="fieldCountry" required={true} onChange={event => {
                                if(registration) {
                                    // Both types have a "street" property
                                    (registration.registrar as GuestUserDto).country = event.target.value
                                }}
                            }/>
                        </div>
                    </div>
                    <p>Damit wir dich im Notfall erreichen können:</p>
                    <div className="p-fluid">
                        <div className="field mb-3">
                            <label htmlFor="fieldPhoneNumber" className="font-bold">Handynummer</label>
                            <InputText id="fieldPhoneNumber" required={true} onChange={event => {console.log(event)}}/>
                        </div>
                    </div>
                </Card>
                <div className="flex gap-4 pt-4 justify-content-end">
                    <Button label="Abort" severity="secondary" onClick={() => console.log("Aborted")} />
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => wizardStepperRef.current?.prevCallback()} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => wizardStepperRef.current?.nextCallback()} />
                    <Button label="Complete" severity="secondary" disabled={true} />
                </div>
            </StepperPanel>
            <StepperPanel header="Zusammenfassung">
                <Card className="flex flex-column" style={{ backgroundColor: 'lightblue' }}>
                    <h3>Zusammenfassung:</h3>
                    <p>Hiermit meldest du dich Zahlungspflichtig zum dem Kurs {registration.courseTypeCode} an.</p>
                    <p>Du hast den Tarif "{'paar'}" gewählt. Die Kosten in höhe von {100} Euro sind am ersten Termin fällig und werden bar bezahlt</p>
                    <p>Solltest du dich für einen Paar-Tarif entschieden haben, bist du für die Zahlung des Komplettpreises verantwortlich. Natürlich können du und dein Partner sich die Kursgebühr teilen, allerdings bist du für die Zahlung verantwortlich.</p>
                    <div className="p-fluid">
                        <div className="field mb-3">
                            <Checkbox id="fieldAcceptTermsOfUse" checked={false} required={true} onChange={event => {console.log(event)}}/>
                            <label htmlFor="fieldAcceptTermsOfUse" className="ml-2">Ich habe die (Link: AGBs) gelesen und akzeptiere diese.</label>
                        </div>
                        <div className="field mb-3">
                            <Checkbox id="fieldConfirmTerms" checked={false} required={true} onChange={event => {console.log(event)}}/>
                            <label htmlFor="fieldConfirmTerms" className="ml-2">Ich wurde über alle Kosten aufgeklärt und stimme der Zahlung aus diesem Vertrag zu.</label>
                        </div>
                    </div>
                </Card>
                <div className="flex gap-4 pt-4 justify-content-end">
                    <Button label="Abort" severity="secondary" onClick={() => console.log("Aborted")} />
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => wizardStepperRef.current?.prevCallback()} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" disabled={true} />
                    <Button label="Complete" severity="secondary" onClick={() => console.log("Complete")} />
                </div>
            </StepperPanel>
        </Stepper>
    }

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
                                <div className="flex flex-wrap gap-4 md:flex-row">
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

                                            return (<Card title={title} style={{ backgroundColor: 'lightblue' }} className="flex-1 min-w-[350px] md:max-w-[calc(33.33%-1rem)]">
                                                {courseStarted && (
                                                    <b className="text-red-600">Achtung - Der Kurs hat bereits begonnen!</b>
                                                )}
                                                <div dangerouslySetInnerHTML={{__html: description}}/>
                                                {course.closed ? (
                                                    <p className="text-red-600">Anmeldung nicht mehr möglich</p>
                                                ):(
                                                    <p>
                                                        <Button label={"Anmelden"} onClick={() => {
                                                            const registration:CourseRegistrationDto = {} as CourseRegistrationDto
                                                            registration.courseId = course.id
                                                            registration.courseTypeCode = course.courseTypeCode
                                                            if(user) {
                                                                registration.registrar = {} as RegisteredUserDto
                                                                // TODO: fetch any previous partner for this user
                                                            } else {
                                                                registration.registrar = {} as GuestUserDto
                                                            }

                                                            // TODO: fetch the available rates for this course

                                                            setRegistration(registration)
                                                        }}/>
                                                    </p>
                                                )}
                                            </Card>)
                                        })
                                    ) : (
                                        <b>Aktuell sind neue Kurse in Vorbereitung und werden demnächst hier aufrufbar sein.</b>
                                    )}
                                </div>
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