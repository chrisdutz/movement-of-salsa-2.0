import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import AdminList from "mainApp/components/AdminList";
import {
    CourseCoupleDto,
    CourseDto,
    RestApplicationClient,
    RestResponse, UserDto
} from "../generated/tools-ui-frontend.ts";
import axios, {AxiosRequestConfig} from "axios";
import {useState} from "react";
import store, {
    updateMainLayoutSubTitle,
    UpdateMainLayoutSubTitleAction,
} from "mainApp/Store";
import UserSelector from "../components/UserSelector.tsx";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

interface LessonsAdminModuleCouplesProps {
    course: CourseDto;
    onClose: () => void;
}

export default function LessonsAdminModuleCouples({course, onClose}:LessonsAdminModuleCouplesProps ) {
    const [newCouple, setNewCouple] = useState(true)
    const [unpairedGents, setUnpairedGents] = useState<UserDto[]>([])
    const [guestGents, setGuestGents] = useState<UserDto[]>([])
    const [unpairedLadies, setUnpairedLadies] = useState<UserDto[]>([])
    const [guestLadies, setGuestLadies] = useState<UserDto[]>([])

    return AdminList<CourseCoupleDto>({
        emptyItem: {
            id: 0,
            courseId: course.id,
            gent: {
                id: 0, name: "", sex: "MALE", size: 0
            },
            gentPaying: false,
            lady: {
                id: 0, name: "", sex: "FEMALE", size: 0
            },
            ladyPaying: false,
            confirmed: false,
            remarks: "",
        },

        globalActions: [
            {label: "Back to Lessons", icon: "pi pi-times-circle", severity: "danger",
                onClick: () => {
                    const action: UpdateMainLayoutSubTitleAction = {subTitle: ""}
                    store.dispatch(updateMainLayoutSubTitle(action))
                    onClose()
                }
            },
        ],

        globalLabel: `${unpairedGents.length > 0 ? unpairedGents.length + " gents needing pairing" : ""}${(unpairedLadies.length > 0) && (unpairedGents.length > 0) ? " " : ""}${unpairedLadies.length > 0 ? unpairedLadies.length + " ladies needing pairing" : ""}`,

        listColumns: [
            {
                sortable: true, header: "Gent",
                styleFunction: item => {
                    return !item.gentPaying ? "text-red-600" : ""
                },
                getter: item => {
                    return `${item.gent.name} ${item.gent.size > 0 ? " (" + item.gent.size + ")" : ""}`
                }
            },
            {
                sortable: true, header: "Lady",
                styleFunction: item => {
                    return !item.ladyPaying ? "text-red-600" : ""
                },
                getter: item => {
                    return `${item.lady.name} ${item.lady.size > 0 ? " (" + item.lady.size + ")" : ""}`
                }
            },
            {sortable: true, header: "Confirmed", field: "confirmed"},
            {sortable: true, header: "Remarks", field: "remarks", fieldType: "HTML"},
        ],

        onOpenEditor: selectedValue => {
            if(selectedValue) {
                restClient.findUnpairedGents(selectedValue.courseId).then(value => {
                    setUnpairedGents(value.data)
                })
                restClient.findPossibleGuestGents(selectedValue.courseId).then(value => {
                    setGuestGents(value.data)
                })
                restClient.findUnpairedLadies(selectedValue.courseId).then(value => {
                    setUnpairedLadies(value.data)
                })
                restClient.findPossibleGuestLadies(selectedValue.courseId).then(value => {
                    setGuestLadies(value.data)
                })
                setNewCouple(selectedValue.id == 0)
            } else {
                setUnpairedGents([])
                setUnpairedLadies([])
            }
        },

        editorColumns: [
            // Replace this by list-view, where gents can be added.
            {
                label: "Gent", required: true, editable: newCouple, fieldType: "Custom", field: "gent",
                selectOptions: unpairedGents,
                fieldEditor: (value, setValue) => {
                    return <UserSelector userSelection={unpairedGents} value={value.gent}
                                         setValue={newValue => {
                                             console.log("New Gent", newValue)
                                             setValue({...value, gent: newValue})
                                         }}
                                         allUsers={guestGents}/>
                }
            },
            // Replace this by list-view, where ladies can be added.
            {
                label: "Lady", required: true, editable: newCouple, fieldType: "Custom", field: "lady",
                selectOptions: unpairedLadies,
                fieldEditor: (value, setValue) => {
                    return <UserSelector userSelection={unpairedLadies} value={value.lady}
                                         setValue={newValue => {
                                             console.log("New Lady", newValue)
                                             setValue({...value, lady: newValue})
                                         }}
                                         allUsers={guestLadies}/>
                }
            },
            {label: "Confirmed", required: false, editable: false, fieldType: "Boolean", field: "confirmed"},
            {label: "Remarks", required: false, editable: true, fieldType: "Editor", field: "remarks"},
        ],

        controller: {
            findAll(options?: AxiosRequestConfig | undefined): RestResponse<CourseCoupleDto[]> {
                restClient.findUnpairedGents(course.id).then(value => {
                    setUnpairedGents(value.data)
                })
                restClient.findUnpairedLadies(course.id).then(value => {
                    setUnpairedLadies(value.data)
                })
                return restClient.findCouplesForCourse(course.id, options);
            },
            save(entry: CourseCoupleDto, options?: AxiosRequestConfig | undefined): RestResponse<CourseCoupleDto> {
                return restClient.save$POST$api_couples(entry, options);
            },
            delete: function (entry: CourseCoupleDto, options?: AxiosRequestConfig): RestResponse<void> {
                return restClient.deleteById$DELETE$api_couples_coupleId(entry.id, options)
            }
        }
    })
}
