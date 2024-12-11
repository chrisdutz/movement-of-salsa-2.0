import {InputText} from "primereact/inputtext";
import React, {useRef, useState} from "react";
import {Button} from "primereact/button";
import {RestApplicationClient} from "../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import store, {
    setAuthenticationToken, setAuthenticationUser,
    updateModuleList,
    UpdateModuleListAction
} from "../store/store.ts";
import {SetAuthenticationTokenAction, SetAuthenticationUserAction} from "../store/types.ts";
import {Password} from "primereact/password";
import {Toast} from "primereact/toast";

const restClient = new RestApplicationClient(axios);

export default function Login() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const toast = useRef<Toast>(null)

    function handleSubmit() {
        restClient.authenticate({
            username: username,
            password: password
        }).then(value => {
            // Update the redux-store
            const setAuthenticationTokenAction:SetAuthenticationTokenAction = {
                authToken: value.data.token
            }
            store.dispatch(setAuthenticationToken(setAuthenticationTokenAction))

            // Display a login message.
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Logged In', life: 3000 })

            // Make all axios requests use the bearer token from now on.
            // REMARK: This is a slightly dirty hack and will cause issues as soon as I communicate with multiple servers.
            axios.defaults.headers.common['Authorization'] = "Bearer " + value.data.token

            // Get the details of the currently logged-in user
            restClient.authenticatedUser().then(readUserResult => {
                const action:SetAuthenticationUserAction = {user: readUserResult.data}
                store.dispatch(setAuthenticationUser(action))

                // Get the list of modules the current user is allowed to use
                restClient.applicationModules().then(readUserModulesResult => {
                    const action:UpdateModuleListAction = {moduleList: readUserModulesResult.data}
                    store.dispatch(updateModuleList(action));
                })
            })
        })
    }

    return (
        <>
            <Toast ref={toast}/>
            <div className="card">
                <div className="flex justify-content-center mb-2">
                    <InputText placeholder="Username" value={username}
                               onChange={event => setUsername(event.target.value)}/>
                    <Password placeholder="Password" value={password}
                              onChange={event => setPassword(event.target.value)}/>
                    <Button onClick={() => handleSubmit()} label={"Login"}/>
                </div>
            </div>
        </>
    )
}
