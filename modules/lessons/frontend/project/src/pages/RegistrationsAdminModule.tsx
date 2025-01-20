import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import AdminList from "mainApp/components/AdminList";
import {
    CourseDto,
    CourseRegistrationDto, CourseTypeRate,
    RestApplicationClient,
    RestResponse, UserDto
} from "../generated/tools-ui-frontend.ts";
import axios from "axios";
import {AxiosRequestConfig} from "axios";
import {useState} from "react";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

interface RegistrationsAdminModuleProps {
    course: CourseDto;
    onClose: () => void;
}

export default function RegistrationsAdminModule( {course, onClose}:RegistrationsAdminModuleProps ) {
    /*const [courseRegistrations, setCourseRegistrations] = useState<CourseRegistrationDto[]>()
    useEffect(() => {
        restClient.findRegistrationsForCourse(courseId).then(value => {
            setCourseRegistrations(value.data)
        })
    }, []);*/
    const [rates, setRates] = useState<CourseTypeRate[]>()
    const [registrars, setRegistrars] = useState<UserDto[]>()
    const [partners, setPartners] = useState<UserDto[]>()
    const [partnerEditorEnabled, setPartnerEditorEnabled] = useState<boolean>(false);

    return AdminList<CourseRegistrationDto>({
        emptyItem: {
            id: 0,

            courseId: course.id,
            courseStartDate: course.lessons.reduce((earliest, current) =>
                current.startTime < earliest.startTime ? current : earliest).startTime,
            courseTypeCode: course.courseTypeCode,

            courseRegistrationType: "SINGLE",
            rateName: "",

            registrar: {
                id: 0,
                name: "",
                sex: "MALE",
            },

            partner: undefined,

            price: 0,
            discount: 0,
            discountRemarks: "",

            remarks: ""
        },
        globalActions: [
            {label: "Back to Lessons", icon: "pi pi-times-circle", severity: "danger", onClick: () => onClose()},
        ],
        listColumns: [
            {sortable: true, header: "Start Date", field: "startDate"},
            {sortable: true, header: "Course Type", field: "courseTypeCode"},
            {sortable: true, header: "Rate", field: "rateName"},
            {sortable: true, header: "Registrar", field: "registrarName"},
            {sortable: true, header: "Partner", field: "partnerName"},
            {sortable: true, header: "Price", field: "price"},
            {sortable: true, header: "Discount", field: "discount"},
            {sortable: true, header: "Discount Remarks", field: "discountRemarks"},
            {sortable: true, header: "Remarks", field: "remarks"},
        ],
        onOpenEditor: selectedValue => {
            if(selectedValue) {
                setPartnerEditorEnabled(selectedValue.courseRegistrationType == "COUPLE");
                restClient.findCourseTypeRates(selectedValue.courseId).then(value => {
                    setRates(value.data)
                })
                restClient.findUsers().then(value => {
                    setRegistrars(value.data)
                })
            } else {
                setPartnerEditorEnabled(false);
                setRates([])
            }
        },
        editorColumns: [
            {label: "Course Rate", required: true, editable: true, fieldType: "Select", field: "rateName",
                selectOptions: rates,
                optionLabelFunction: (item:CourseTypeRate) => {
                    return (item) ? `${item.title}` : "Select an option"
                },
                optionValueFunction: (item:CourseTypeRate) => {
                    return (item) ? item.title : undefined
                },
                // Whenever a rate is selected, initialize the fields: courseRegistrationType, rateName and price.
                onOptionSelected: (oldValue, setValue, selectedItem: CourseTypeRate) => {
                    if((oldValue.courseRegistrationType != (selectedItem.coupleRate ? "COUPLE" : "SINGLE")) || (oldValue.price != selectedItem.price) || (oldValue.rateName != selectedItem.title)) {
                        const isCoupleRate = selectedItem.coupleRate;
                        // Update the partner editor state
                        setPartnerEditorEnabled(isCoupleRate);

                        const newValue: CourseRegistrationDto = {
                            ...oldValue,
                            courseRegistrationType: selectedItem.coupleRate ? "COUPLE" : "SINGLE",
                            rateName: selectedItem.title,
                            price: selectedItem.price,
                            // Potentially reset the partner, if a single-rate was selected.
                            partner: isCoupleRate ? oldValue.partner : undefined,
                        }
                        setValue(newValue)

                        if(isCoupleRate && oldValue.registrar.id != 0) {
                            restClient.findFindPartnersForUser(oldValue.registrar.id).then(value => {
                                setPartners(value.data)
                            })
                        } else {
                            setPartners([])
                        }
                    }
                }
            },
            {label: "Registrar", required: false, editable: true, fieldType: "Select", field: "registrar",
                selectOptions: registrars,
                optionLabelFunction: (item:UserDto) => {
                    return (item) ? item.name : "Select a user"
                },
                onOptionSelected: (oldValue, setValue, selectedItem: UserDto) => {
                    if(oldValue.courseRegistrationType == "COUPLE") {
                        restClient.findFindPartnersForUser(selectedItem.id).then(value => {
                            setPartners(value.data)
                        })
                    } else {
                        setPartners([])
                    }
                    if(oldValue.registrar.id != selectedItem.id) {
                        const newValue: CourseRegistrationDto = {
                            ...oldValue,
                            registrar: selectedItem,
                        }
                        setValue(newValue)
                    }
                }
            },
            {label: "Partner", required: partnerEditorEnabled, editable: partnerEditorEnabled, fieldType: "Select", field: "partner",
                selectOptions: partners,
                optionLabelFunction: (item:UserDto) => {
                    return (item) ? item.name : "Select a partner"
                },
            },
            {label: "Price", required: true, editable: true, fieldType: "Number", field: "price"},
            {label: "Discount", required: false, editable: true, fieldType: "Number", field: "discount"},
            {label: "Discount Remarks", required: false, editable: true, fieldType: "Editor", field: "discountRemarks"},
            {label: "Remarks", required: false, editable: true, fieldType: "Editor", field: "remarks"},
        ],
        controller: {
            findAll(options?: AxiosRequestConfig | undefined): RestResponse<CourseRegistrationDto[]> {
                return restClient.findRegistrationsForCourse(course.id, options);
            },
            save(entry: CourseRegistrationDto, options?: AxiosRequestConfig | undefined): RestResponse<CourseRegistrationDto> {
                return restClient.save$POST$api_registrations(entry, options);
            },
            delete: function (entry: CourseRegistrationDto, options?: AxiosRequestConfig): RestResponse<void> {
                return restClient.deleteById$DELETE$api_registrations_id(entry.id, options)
            }
        },
    })
}
