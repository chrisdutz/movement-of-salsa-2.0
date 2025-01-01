import store, {logout, moduleListInitialState, updateModuleList, UpdateModuleListAction} from "../store/store.ts";
import axios from "axios";
import {RestApplicationClient} from "../generated/plc4j-tools-ui-frontend.ts";

const restClient = new RestApplicationClient(axios);

export default function Logout() {
    // Reset the authentication data
    store.dispatch(logout())

    // Reset the JWT token
    axios.defaults.headers.common['Authorization'] = ""

    // Get the list of modules the current user is allowed to use (After resetting the auth-token, we'll get the
    // list of modules a guest is allowed to see.
    restClient.applicationModules().then(readUserModulesResult => {
        const data = readUserModulesResult.data;
        data.sort((a, b) => a.sort - b.sort);
        const action: UpdateModuleListAction = {moduleList: data}
        store.dispatch(updateModuleList(action));
    })

    return (
        <p>
            <div>Logged out</div>
        </p>
    )
}
