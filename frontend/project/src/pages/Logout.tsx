import store, {logout, moduleListInitialState, updateModuleList} from "../store/store.ts";
import axios from "axios";

export default function Logout() {
    // Reset the authentication data
    store.dispatch(logout())
    // Reset the module data
    store.dispatch(updateModuleList(moduleListInitialState))
    // Reset the JWT token
    axios.defaults.headers.common['Authorization'] = ""

    return (
        <p>
            <div>Logged out</div>
        </p>
    )
}
