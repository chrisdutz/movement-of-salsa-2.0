import {RestApplicationClient, RestResponse, Role} from "../../generated/plc4j-tools-ui-frontend.ts";
import axios, {AxiosRequestConfig} from "axios";
import AdminList from "../../components/AdminList.tsx";

const restClient = new RestApplicationClient(axios);

export default function Roles() {
    return AdminList<Role>({
        emptyItem: {
            id: 0,
            name: ""
        },
        listColumns: [
            {header: "Name", field: "name", sortable: true}
        ],
        listSortColumn: "name",
        editorColumns: [
            {label: "Name", required: true, editable: true, fieldType: "Text", field: "name"},
        ],
        controller: {
            findAll(options?: AxiosRequestConfig | undefined): RestResponse<Role[]> {
                return restClient.listRoles(options);
            },
            save(entry: Role, options?: AxiosRequestConfig | undefined): RestResponse<Role> {
                return restClient.saveRole(entry, options);
            },
            delete(entry: Role, options?: AxiosRequestConfig): RestResponse<void> {
                return restClient.deleteRole(entry, options);
            }
        }
    })
}
