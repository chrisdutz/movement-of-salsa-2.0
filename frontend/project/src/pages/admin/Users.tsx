import {RestApplicationClient, RestResponse, Role, User} from "../../generated/plc4j-tools-ui-frontend.ts";
import axios, {AxiosRequestConfig} from "axios";
import AdminList from "../../components/AdminList.tsx";
import {useState} from "react";

const restClient = new RestApplicationClient(axios);

export default function Users() {
    const [roles, setRoles] = useState<Role[]>([])
    return AdminList<User>({
        emptyItem: {
            id: 0,
            accountNonExpired: false,
            accountNonLocked: false,
            authorities: [],
            createdAt: new Date(),
            credentialsNonExpired: false,
            email: "",
            enabled: false,
            password: "",
            roles: [],
            updatedAt: new Date(),
            username: '',
            firstName: '',
            lastName: '',
            street: '',
            zip: '',
            city: '',
            country: '',
            phone: '',
            sex: 'MALE',
            size: 0
        },
        listColumns: [
            {header: "Sex", field: "sex", sortable: true},
            {header: "First Name", field: "firstName", sortable: true},
            {header: "Last Name", field: "lastName", sortable: true},
            {header: "Email", field: "email", sortable: true},
            {header: "Phone", field: "phone", sortable: true},
            {header: "Street", field: "street", sortable: true},
            {header: "Zip", field: "zip", sortable: true},
            {header: "City", field: "city", sortable: true},
            {header: "Roles", sortable: false,
                getter: (item: User) => {
                    return item.roles.map(value => value.name).join(", ");
                }}
        ],
        listSortColumn: "lastName",
        editorColumns: [
            {label: "Roles", field: "roles", required: false, editable: true, fieldType: "MultiSelect",
                selectOptions: roles, optionLabel: "name"},
            {label: "First Name", field: "firstName", required: true, editable: true, fieldType: "Text"},
            {label: "Last Name", field: "lastName", required: true, editable: true, fieldType: "Text"},
            {label: "Sex", field: "sex", required: true, editable: true, fieldType: "Enum", selectOptions: ['MALE', 'FEMALE']},
            {label: "Size", field: "size", required: true, editable: true, fieldType: "Number"},
            {label: "Email", field: "email", required: false, editable: true, fieldType: "Email"},
            {label: "Phone", field: "phone", required: false, editable: true, fieldType: "Text"},
            {label: "Street", field: "street", required: true, editable: true, fieldType: "Text"},
            {label: "Zip", field: "zip", required: true, editable: true, fieldType: "Text"},
            {label: "City", field: "city", required: true, editable: true, fieldType: "Text"},
            {label: "Country", field: "country", required: true, editable: true, fieldType: "Text"},
        ],
        controller: {
            findAll(options?: AxiosRequestConfig | undefined): RestResponse<User[]> {
                return restClient.listUsers(options);
            },
            save(entry: User, options?: AxiosRequestConfig | undefined): RestResponse<User> {
                return restClient.saveUser(entry, options);
            },
            delete(entry: User, options?: AxiosRequestConfig): RestResponse<void> {
                return restClient.deleteUser(entry, options);
            }
        },
        initializer: () => {
            restClient.listRoles().then(response => {
                setRoles(response.data);
            })
        }
    })
}
