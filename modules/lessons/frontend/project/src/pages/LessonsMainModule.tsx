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
import {Stepper} from "primereact/stepper";
import {StepperPanel} from "primereact/stepperpanel";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Checkbox} from "primereact/checkbox";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type StepperRef = React.ElementRef<typeof Stepper>;

export default function NewsMainModule() {
    const wizardStepperRef = useRef<StepperRef>(null);

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
    const [availableCourseRates, setAvailableCourseRates] = useState<CourseTypeRate[]>([])
    const [partners, setPartners] = useState<UserDto[]>([])
    const [selectedCourseRate, setSelectedCourseRate] = useState<CourseTypeRate>()
    const [selectedRateIsPartnerRate, setSelectedRateIsPartnerRate] = useState<boolean>(false)
    const [acceptedTermsOfUse, setAcceptedTermsOfUse] = useState(false)
    const [acceptedTerms, setAcceptedTerms] = useState(false)

    const [isGuestStepValid, setIsGuestStepValid] = useState(false);
    const [isTarifStepValid, setIsTarifStepValid] = useState(false);
    const [isBillingStepValid, setIsBillingStepValid] = useState(false);

    function updateGuestStepValidState(curRegistration:CourseRegistrationDto) {
        setIsGuestStepValid((curRegistration.registrar?.sex != undefined) &&
            (curRegistration.registrar?.firstName?.length > 0) &&
            (curRegistration.registrar?.lastName?.length > 0) &&
            (((curRegistration.registrar) as GuestUserDto)?.email?.length > 0))
        setRegistration(curRegistration)
    }

    function updateTarifStepValidState(curRegistration:CourseRegistrationDto) {
        setIsTarifStepValid((curRegistration.rateName != undefined) &&
            !curRegistration.partner || (
                (((curRegistration.partner) as GuestUserDto)?.lastName?.length > 0) &&
                (((curRegistration.partner) as GuestUserDto)?.firstName?.length > 0)
            ))
        setRegistration(curRegistration)
    }

    function updateBillingStepValidState(curRegistration:CourseRegistrationDto) {
        setIsBillingStepValid((((curRegistration.registrar) as GuestUserDto)?.street?.length > 0) &&
            (((curRegistration.registrar) as GuestUserDto)?.zip?.length > 0) &&
            (((curRegistration.registrar) as GuestUserDto)?.city?.length > 0) &&
            (((curRegistration.registrar) as GuestUserDto)?.country?.length > 0) &&
            (((curRegistration.registrar) as GuestUserDto)?.phone?.length > 0))
        setRegistration(curRegistration)
    }

    useEffect(() => {
        // Make all axios requests use the bearer token from now on.
        axios.defaults.headers.common['Authorization'] = "Bearer " + authToken
        restClient.findAllNotHidden().then(courseTypesResponse => {
            setCourseTypes(courseTypesResponse.data)
        })
        restClient.findUpAndRunningCourses().then(result => {
            const newUpAndRunningCourses:Record<string, CourseDto[]> = {}
            if(result.data) {
                result.data.forEach(course => {
                    if (!newUpAndRunningCourses[course.courseTypeCode]) {
                        newUpAndRunningCourses[course.courseTypeCode] = [];
                    }
                    newUpAndRunningCourses[course.courseTypeCode] = [...newUpAndRunningCourses[course.courseTypeCode], course]
                })
            }
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
                                <Dropdown id="fieldSex" required={true}
                                          options={[
                                              {value: "MALE", label: "Männlich"},
                                              {value: "FEMALE", label: "Weiblich"}
                                          ]}
                                          valueTemplate={(registration?.registrar as GuestUserDto).sex == "MALE" ? "Männlich" : "Weiblich"}
                                          value={(registration?.registrar as GuestUserDto).sex}
                                          onChange={event => {
                                              if(registration && registration.registrar) {
                                                  updateGuestStepValidState({...registration, registrar: {...registration.registrar, sex: event.value as Sex}})
                                              }
                                          }}/>
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="fieldFirstName" className="font-bold">Vorname</label>
                                <InputText id="fieldFirstName" required={true}
                                           value={(registration?.registrar as GuestUserDto).firstName}
                                           onChange={event => {
                                               if(registration && registration.registrar) {
                                                   updateGuestStepValidState({...registration, registrar: {...registration.registrar, firstName: event.target.value}})
                                               }
                                           }}/>
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="fieldLastName" className="font-bold">Nachname</label>
                                <InputText id="fieldLastName" required={true}
                                           value={(registration?.registrar as GuestUserDto).lastName}
                                           onChange={event => {
                                               if(registration && registration.registrar) {
                                                   updateGuestStepValidState({...registration, registrar: {...registration.registrar, lastName: event.target.value}})
                                               }
                                           }}/>
                            </div>
                            <div className="field mb-3">
                                <label htmlFor="fieldEmail" className="font-bold">Email Adresse</label>
                                <InputText id="fieldEmail" type={"email"} required={true}
                                           value={(registration?.registrar as GuestUserDto).email}
                                           onChange={event => {
                                               if(registration && registration.registrar) {
                                                   updateGuestStepValidState({...registration, registrar: {...registration.registrar, email: event.target.value} as GuestUserDto})
                                               }
                                           }}/>
                            </div>
                        </div>
                    </Card>
                    <div className="flex gap-4 pt-4 justify-content-end">
                        <Button label="Abort" severity="secondary" onClick={() => setRegistration(undefined)} />
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" disabled={true} />
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right"
                                disabled={!isGuestStepValid}
                                onClick={() => wizardStepperRef.current?.nextCallback()} />
                        <Button label="Complete" severity="secondary" disabled={true} />
                    </div>
                </StepperPanel>
            }
            <StepperPanel header="Tarif & Partner">
                <Card className="flex flex-column" style={{ backgroundColor: 'lightblue' }}>
                    <div className="p-fluid">
                        <div className="field mb-3">
                            <label htmlFor="fieldRate" className="font-bold">Tarif</label>
                            <Dropdown id="fieldRate" options={availableCourseRates} required={true}
                                      itemTemplate={option => option?.title}
                                      valueTemplate={option => option ? option.title : "Select"}
                                      value={selectedCourseRate}
                                      onChange={event => {
                                          setSelectedCourseRate(event.value)
                                          const coupleRate = event.value["coupleRate"] as boolean
                                          setSelectedRateIsPartnerRate(coupleRate)

                                          // If we're not logged in, provide an empty partner.
                                          if(registration) {
                                              if (!user && coupleRate) {
                                                  updateTarifStepValidState({
                                                      ...registration,
                                                      rateName: event.value["title"],
                                                      courseRegistrationType: coupleRate ? "COUPLE" : "SINGLE",
                                                      // TODO: Add the price
                                                      partner: {
                                                          id: 0,
                                                          sex: registration?.registrar.sex == 'MALE' ? "FEMALE" : "MALE"
                                                      } as GuestUserDto
                                                  })
                                              } else {
                                                  updateTarifStepValidState({
                                                      ...registration,
                                                      rateName: event.value["title"],
                                                      courseRegistrationType: coupleRate ? "COUPLE" : "SINGLE",
                                                      // TODO: Add the price
                                                      partner: undefined
                                                  })
                                              }
                                          }
                                      }}/>
                        </div>
                        {selectedRateIsPartnerRate &&
                            <>
                                {user &&
                                    <div className="field mb-3">
                                        <label htmlFor="fieldPartner" className="font-bold">Partner</label>
                                        <Dropdown id="fieldPartner" options={partners} value={registration.partner}
                                                  itemTemplate={(option) => (option) ? option.lastName + ((option.firstName && option.firstName.length > 0) ? ", " + option.firstName : "") : "Empty"}
                                                  valueTemplate={(option) => (option) ? option.lastName + ((option.firstName && option.firstName.length > 0) ? ", " + option.firstName : "") : "Empty"}
                                                  required={true}
                                                  onChange={event => {
                                                      if(registration) {
                                                          updateTarifStepValidState({...registration, partner: event.value})
                                                      }
                                                  }}/>
                                    </div>
                                }
                                <div className="field mb-3">
                                    <label htmlFor="fieldParnerFirstName" className="font-bold">Partner Vorname</label>
                                    <InputText id="fieldParnerFirstName" required={true}
                                               value={registration.partner?.firstName}
                                               disabled={registration.partner?.id != 0}
                                               onChange={event => {
                                                   if(registration) {
                                                       updateTarifStepValidState({...registration, partner: {...registration.partner, firstName: event.target.value} as RegisteredUserDto})
                                                   }
                                               }}/>
                                </div>
                                <div className="field mb-3">
                                    <label htmlFor="fieldParnerLastName" className="font-bold">Partner Nachname</label>
                                    <InputText id="fieldParnerLastName" required={true}
                                               value={registration.partner?.lastName}
                                               disabled={registration.partner?.id != 0}
                                               onChange={event => {
                                                   if(registration) {
                                                       updateTarifStepValidState({...registration, partner: {...registration.partner, lastName: event.target.value} as RegisteredUserDto})
                                                   }
                                               }}/>
                                </div>
                            </>
                        }
                        <div className="field mb-3">
                            <label htmlFor="fieldRemarks" className="font-bold">Anmerkungen</label>
                            <InputText id="fieldRemarks" required={true}
                                       value={registration.remarks}
                                       onChange={event => {
                                           if(registration) {
                                               updateTarifStepValidState({...registration, remarks: event.target.value})
                                           }
                                       }}/>
                        </div>
                    </div>
                </Card>
                <div className="flex gap-4 pt-4 justify-content-end">
                    <Button label="Abort" severity="secondary" onClick={() => setRegistration(undefined)} />
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left"
                            disabled={user != undefined}
                            onClick={() => wizardStepperRef.current?.prevCallback()} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right"
                            disabled={!isTarifStepValid}
                            onClick={() => wizardStepperRef.current?.nextCallback()} />
                    <Button label="Complete" severity="secondary" disabled={true} />
                </div>
            </StepperPanel>
            {/* TODO: hier ein StepperPanel rein, bei dem man schon selektieren kann, wann man nicht kann */}
            <StepperPanel header="Weitere Informationen">
                <Card className="flex flex-column" style={{ backgroundColor: 'lightblue' }}>
                    {registration.courseRegistrationType == "SINGLE" &&
                        <>
                            <p>Für Partnerzuweisung (Optional):</p>
                            <div className="p-fluid">
                                <div className="field mb-3">
                                    <label htmlFor="fieldSize" className="font-bold">Größe</label>
                                    <InputNumber id="fieldSize" required={true}
                                                 value={registration.registrar.size}
                                                 onChange={event => {
                                                     if(registration && event.value) {
                                                         updateBillingStepValidState({...registration, registrar: {...registration.partner, size: event.value} as RegisteredUserDto})
                                                     }
                                                 }}/>
                                </div>
                            </div>
                        </>
                    }
                    <p>Für Rechnungsstellung benötigt:</p>
                    <div className="p-fluid">
                        <div className="field mb-3">
                            <label htmlFor="fieldStreet" className="font-bold">Straße</label>
                            <InputText id="fieldStreet" required={true}
                                       value={(registration.registrar as RegisteredUserDto).street}
                                       onChange={event => {
                                           if(registration && registration.registrar) {
                                               // Both types have a "street" property
                                               updateBillingStepValidState({...registration, registrar: {...registration.registrar, street: event.target.value} as RegisteredUserDto})
                                           }
                                       }}/>
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="fieldZip" className="font-bold">PLZ</label>
                            <InputText id="fieldZip" required={true}
                                       value={(registration.registrar as RegisteredUserDto).zip}
                                       onChange={event => {
                                           if(registration && registration.registrar) {
                                               // Both types have a "zip" property
                                               updateBillingStepValidState({...registration, registrar: {...registration.registrar, zip: event.target.value} as RegisteredUserDto})
                                           }
                                       }}/>
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="fieldCity" className="font-bold">Stadt</label>
                            <InputText id="fieldCity" required={true}
                                       value={(registration.registrar as RegisteredUserDto).city}
                                       onChange={event => {
                                           if(registration && registration.registrar) {
                                               // Both types have a "city" property
                                               updateBillingStepValidState({...registration, registrar: {...registration.registrar, city: event.target.value} as RegisteredUserDto})
                                           }
                                       }}/>
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="fieldCountry" className="font-bold">Land</label>
                            <InputText id="fieldCountry" required={true}
                                       value={(registration.registrar as RegisteredUserDto).country}
                                       onChange={event => {
                                           if(registration && registration.registrar) {
                                               // Both types have a "country" property
                                               updateBillingStepValidState({...registration, registrar: {...registration.registrar, country: event.target.value} as RegisteredUserDto})
                                           }
                                       }}/>
                        </div>
                    </div>
                    <p>Damit wir dich im Notfall erreichen können:</p>
                    <div className="p-fluid">
                        <div className="field mb-3">
                            <label htmlFor="fieldPhoneNumber" className="font-bold">Handynummer</label>
                            <InputText id="fieldPhoneNumber" required={true}
                                       value={(registration.registrar as RegisteredUserDto).phone}
                                       onChange={event => {
                                           if(registration && registration.registrar) {
                                               // Both types have a "phone" property
                                               updateBillingStepValidState({...registration, registrar: {...registration.registrar, phone: event.target.value} as RegisteredUserDto})
                                           }
                                       }}/>
                        </div>
                    </div>
                </Card>
                <div className="flex gap-4 pt-4 justify-content-end">
                    <Button label="Abort" severity="secondary" onClick={() => setRegistration(undefined)} />
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => wizardStepperRef.current?.prevCallback()} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right"
                            disabled={!isBillingStepValid}
                            onClick={() => wizardStepperRef.current?.nextCallback()} />
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
                            <Checkbox id="fieldAcceptTermsOfUse" required={true}
                                      checked={acceptedTermsOfUse}
                                      onChange={event => {
                                          setAcceptedTermsOfUse(!!event.checked)
                                      }}/>
                            <label htmlFor="fieldAcceptTermsOfUse" className="ml-2">Ich habe die (Link: AGBs) gelesen und akzeptiere diese.</label>
                        </div>
                        <div className="field mb-3">
                            <Checkbox id="fieldConfirmTerms" required={true}
                                      checked={acceptedTerms}
                                      onChange={event => {
                                          setAcceptedTerms(!!event.checked)
                                      }}/>
                            <label htmlFor="fieldConfirmTerms" className="ml-2">Ich wurde über alle Kosten aufgeklärt und stimme der Zahlung aus diesem Vertrag zu.</label>
                        </div>
                    </div>
                </Card>
                <div className="flex gap-4 pt-4 justify-content-end">
                    <Button label="Abort" severity="secondary" onClick={() => setRegistration(undefined)} />
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => wizardStepperRef.current?.prevCallback()} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" disabled={true} />
                    <Button label="Complete" severity="secondary"
                            disabled={!acceptedTermsOfUse || !acceptedTerms}
                            onClick={() => restClient.save$POST$api_registrations(registration)} />
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
                                                                const registeredUserRegistrar = {} as RegisteredUserDto
                                                                registeredUserRegistrar.id = user.id
                                                                registeredUserRegistrar.firstName = user.firstName
                                                                registeredUserRegistrar.lastName = user.lastName
                                                                registeredUserRegistrar.sex = user.sex
                                                                registeredUserRegistrar.size = user.size

                                                                registeredUserRegistrar.street = user.street
                                                                registeredUserRegistrar.zip = user.zip
                                                                registeredUserRegistrar.city = user.city
                                                                registeredUserRegistrar.country = user.country

                                                                registeredUserRegistrar.phone = user.phone
                                                                registration.registrar = registeredUserRegistrar

                                                                // Fetch any previous partner for this user
                                                                restClient.findPartners().then(value1 => {
                                                                    const partners:UserDto[] = [...value1.data, {
                                                                        id: 0,
                                                                        firstName: "",
                                                                        lastName: "Neuer Partner",
                                                                        sex: user.sex == "MALE" ? "FEMALE": "MALE",
                                                                        size: 0,
                                                                        // GuestUserDto properties
                                                                        city: "",
                                                                        country: "",
                                                                        email: "",
                                                                        phone: "",
                                                                        street: "",
                                                                        zip: ""
                                                                    } as GuestUserDto]
                                                                    setPartners(partners)
                                                                })
                                                            } else {
                                                                registration.registrar = {} as GuestUserDto
                                                            }

                                                            // Fetch the available rates for this course
                                                            restClient.findCourseTypeRates(course.id).then(value1 => {
                                                                setAvailableCourseRates(value1.data)
                                                            })

                                                            updateTarifStepValidState(registration)
                                                            updateBillingStepValidState(registration)
                                                            setAcceptedTermsOfUse(false)
                                                            setAcceptedTerms(false)
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