import {RestApplicationClient} from "../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import React, {useRef, useState} from "react";
import {Toast} from "primereact/toast";
import store, {
    setAuthenticationToken,
    SetAuthenticationTokenAction, setAuthenticationUser,
    SetAuthenticationUserAction, updateModuleList, UpdateModuleListAction
} from "../store/store.ts";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Card} from "primereact/card";

const restClient = new RestApplicationClient(axios);

interface LoginFormProps {
    resetPasswordCallback?: () => void;
}

export default function LoginForm({resetPasswordCallback}:LoginFormProps) {
    const toast = useRef<Toast>(null)

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loginErrors, setLoginErrors] = useState({
        email: "",
        password: ""
    });
    const [loggingIn, setLoggingIn] = useState<boolean>(false)

    function validateLoginForm(field:string, value:any) {
        const newErrors = { ...loginErrors };

        if (field === "username") {
            if (!value) {
                newErrors.email = "Email darf nicht leer sein.";
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                newErrors.email = "Bitte eine gültige Email eingeben.";
            } else {
                newErrors.email = "";
            }
        }

        if (field === "password") {
            if (!value) {
                newErrors.password = "Passwort darf nicht leer sein.";
            } else {
                newErrors.password = "";
            }
        }

        setLoginErrors(newErrors);
    }

    function isLoginFormValid() {
        return loginErrors.email == "" &&
            loginErrors.password == ""
    }

    function handleLogin() {
        setLoggingIn(true);
        restClient.authenticate({
            email: username,
            password: password
        }).then(value => {

            // Update the redux-store
            const setAuthenticationTokenAction: SetAuthenticationTokenAction = {
                authToken: value.data.token
            }
            store.dispatch(setAuthenticationToken(setAuthenticationTokenAction))

            // Display a login message.
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Logged In', life: 3000})

            // Make all axios requests use the bearer token from now on.
            // REMARK: This is a slightly dirty hack and will cause issues as soon as I communicate with multiple servers.
            axios.defaults.headers.common['Authorization'] = "Bearer " + value.data.token

            // Get the details of the currently logged-in user
            restClient.authenticatedUser().then(readUserResult => {

                const action: SetAuthenticationUserAction = {user: readUserResult.data}
                store.dispatch(setAuthenticationUser(action))

                // Get the list of modules the current user is allowed to use
                restClient.applicationModules().then(readUserModulesResult => {
                    const data = readUserModulesResult.data;
                    data.sort((a, b) => a.sort - b.sort);
                    const action: UpdateModuleListAction = {moduleList: data}
                    store.dispatch(updateModuleList(action));

                    setLoggingIn(false);
                })
            })
        }).catch(() => {
            toast.current?.show({severity: 'error', summary: 'Error', detail: 'Login failed.', life: 3000})
            setLoggingIn(false);
        })
    }

    return (
        <Card title="Login" className="flex flex-column gap-3 basis-1/2 grow-0 shrink-0 w-full md:w-1/2">
            <div className="field mb-3">
                <InputText placeholder="Email"
                           value={username}
                           onChange={event => {
                               const value = event.target.value;
                               setUsername(value)
                               validateLoginForm("username", value)
                           }}
                           className={`w-full ${loginErrors.email != "" ? "p-invalid" : ""}`}/>
                {loginErrors.email && (<small className="p-error">{loginErrors.email}</small>)}
            </div>
            <div className="field mb-3">
                <Password placeholder="Password"
                          value={password}
                          onChange={event => {
                              const value = event.target.value;
                              setPassword(value)
                              validateLoginForm("password", value)
                          }}
                          inputClassName={`w-full ${loginErrors.password != "" ? "p-invalid" : ""}`}
                          className="w-full"/>
                {loginErrors.password && (<small className="p-error">{loginErrors.password}</small>)}
            </div>
            <Button label="Login"
                    onClick={() => handleLogin()}
                    disabled={!isLoginFormValid()}
                    loading={loggingIn}
                    className="w-full mb-3"/>
            {resetPasswordCallback && (<a onClick={resetPasswordCallback}>Passwort Vergessen</a>)}
        </Card>
    )
}
