import {Permission, RestApplicationClient, RestResponse} from "../../generated/plc4j-tools-ui-frontend.ts";
import axios, {AxiosRequestConfig} from "axios";
import AdminList from "../../components/AdminList.tsx";

const restClient = new RestApplicationClient(axios);

export default function Permissions() {
    return AdminList<Permission>({
        emptyItem: {
            id: 0,
            moduleName: '',
            actionName: '',
            rule: ''
        },
        listColumns: [
            {header: "Module", field: "moduleName", sortable: true},
            {header: "Action", field: "actionName", sortable: true},
            {header: "Rule", field: "rule", sortable: true}
        ],
        listSortColumn: "moduleName",
        editorColumns: [
            {label: "Module", required: true, editable: false, fieldType: "InputText", field: "moduleName"},
            {label: "Action", required: true, editable: false, fieldType: "InputText", field: "actionName"},
            {label: "Rule", required: true, editable: true, fieldType: "InputText", field: "rule"}
        ],
        controller: {
            findAll(options: AxiosRequestConfig | undefined): RestResponse<Permission[]> {
                return restClient.listPermissions(options);
            },
            save(entry: Permission, options: AxiosRequestConfig | undefined): RestResponse<Permission> {
                return restClient.savePermission(entry, options);
            }
        }
    })
}
