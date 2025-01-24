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

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

interface LessonsAdminModuleCouplesProps {
    course: CourseDto;
    onClose: () => void;
}

export default function LessonsAdminModuleCouples({course, onClose}:LessonsAdminModuleCouplesProps ) {
    const [newCouple, setNewCouple] = useState(true)
    const [gents, setGents] = useState<UserDto[]>([])
    const [ladies, setLadies] = useState<UserDto[]>([])

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
            {label: "Back to Lessons", icon: "pi pi-times-circle", severity: "danger", onClick: () => onClose()},
        ],

        globalLabel: `${gents.length > 0 ? gents.length + " gents needing pairing" : ""}${(ladies.length > 0) && (gents.length > 0) ? " " : ""}${ladies.length > 0 ? ladies.length + " ladies needing pairing" : ""}`,

        listColumns: [
            {sortable: true, header: "Gent", getter: item => {
                    return `${item.gent.name} ${item.gent.size > 0 ? " (" + item.gent.size + ")" : ""}`
                }},
            {sortable: true, header: "Lady", getter: item => {
                    return `${item.lady.name} ${item.lady.size > 0 ? " (" + item.lady.size + ")" : ""}`
                }},
            {sortable: true, header: "Confirmed", field: "confirmed"},
            {sortable: true, header: "Remarks", field: "remarks", fieldType: "HTML"},
        ],

        onOpenEditor: selectedValue => {
            if(selectedValue) {
                restClient.findUnpairedGents(selectedValue.courseId).then(value => {
                    setGents(value.data)
                })
                restClient.findUnpairedLadies(selectedValue.courseId).then(value => {
                    setLadies(value.data)
                })
                setNewCouple(selectedValue.id == 0)
            } else {
                setGents([])
                setLadies([])
            }
        },

        editorColumns: [
            {label: "Gent", required: true, editable: newCouple, fieldType: "Select", field: "gent",
                selectOptions: gents,
                optionLabelFunction: (item:UserDto) => {
                    return (item) ? item.name + ((item.size) ? ` (${item.size})` : "") : "Select a male"
                },
            },
            {label: "Lady", required: true, editable: newCouple, fieldType: "Select", field: "lady",
                selectOptions: ladies,
                optionLabelFunction: (item:UserDto) => {
                    return (item) ? item.name + ((item.size) ? ` (${item.size})` : "") : "Select a female"
                },
            },
            {label: "Confirmed", required: false, editable: false, fieldType: "Boolean", field: "confirmed"},
            {label: "Remarks", required: false, editable: true, fieldType: "Editor", field: "remarks"},
        ],

        controller: {
            findAll(options?: AxiosRequestConfig | undefined): RestResponse<CourseCoupleDto[]> {
                restClient.findUnpairedGents(course.id).then(value => {
                    setGents(value.data)
                })
                restClient.findUnpairedLadies(course.id).then(value => {
                    setLadies(value.data)
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
