import {InputText} from "primereact/inputtext";
import React, {useRef, useState} from "react";
import {Button} from "primereact/button";
import {RestApplicationClient, Sex} from "../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import store, {
    setAuthenticationToken,
    setAuthenticationUser,
    updateModuleList,
    UpdateModuleListAction
} from "../store/store.ts";
import {SetAuthenticationTokenAction, SetAuthenticationUserAction} from "../store/types.ts";
import {Password} from "primereact/password";
import {Toast} from "primereact/toast";
import {Card} from "primereact/card";
import {Dropdown} from "primereact/dropdown";
import {Dialog} from "primereact/dialog";

const restClient = new RestApplicationClient(axios);

export default function Login() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loggingIn, setLoggingIn] = useState<boolean>(false)

    const [resetPasswordDialog, setResetPasswordDialog] = useState<boolean>(false)
    const [resetPasswordEmail, setResetPasswordEmail] = useState<string>("")
    const [resetPasswordPassword, setResetPasswordPassword] = useState<string>("")
    const [resetPasswordPasswordRepeat, setResetPasswordPasswordRepeat] = useState<string>("")
    const [sendingPasswordResetEmail, setSendingPasswordResetEmail] = useState<boolean>(false)

    const [registerSex, setRegisterSex] = useState<Sex>()
    const [registerFirstName, setRegisterFirstName] = useState<string>("")
    const [registerLastName, setRegisterLastName] = useState<string>("")
    const [registerEmail, setRegisterEmail] = useState<string>("")
    const [registerPassword, setRegisterPassword] = useState<string>("")
    const [registerRepeatPassword, setRegisterRepeatPassword] = useState<string>("")
    const [registering, setRegistering] = useState<boolean>(false)

    const toast = useRef<Toast>(null)

    function handleLostPassword() {
        setSendingPasswordResetEmail(true)
        console.log("Requesting reset password", resetPasswordEmail)
        restClient.resetPassword({email: resetPasswordEmail, password: resetPasswordPassword}).then(() => {
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Reset Password Email sent', life: 3000})
            setResetPasswordDialog(false)
            setSendingPasswordResetEmail(false)
            setResetPasswordEmail("")
            setResetPasswordPassword("")
            setResetPasswordPasswordRepeat("")
        }).catch(() => {
            toast.current?.show({severity: 'error', summary: 'Error', detail: 'Reset Password Email failed', life: 3000})
            setResetPasswordDialog(false)
            setSendingPasswordResetEmail(false)
            setResetPasswordEmail("")
            setResetPasswordPassword("")
            setResetPasswordPasswordRepeat("")
        })
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
        })
    }

    /*function validateRegister() {
        // TODO: Implement validation
    }*/

    function handleRegister() {
        if(!registerSex) {
            return;
        }

        setRegistering(true);

        restClient.register({
            sex: registerSex,
            firstName: registerFirstName,
            lastName: registerLastName,
            email: registerEmail,
            password: registerPassword
        }).then(value => {
            // TODO: Handle the result
            console.log("Register Response", value)
            setRegistering(false);
        })
    }

    return (
        <>
            <Toast ref={toast}/>
            <Dialog header="Passwort Vergessen" visible={resetPasswordDialog} onHide={() => {if (!resetPasswordDialog) return; setResetPasswordDialog(false); }}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <p className="m-0">
                    Bitte geben sie in diesem feld die Email Adresse des accounts ein, für den sie das Passwort vergessen haben.<br/>
                    Sollten diese Email im System vorhanden sein, werden wir ihnen an diese Adresse eine email schicken, die einen Link enthält, über den sie ihr Passwort zurücksetzen können.
                </p>
                <InputText placeholder="Email"
                           value={resetPasswordEmail}
                           onChange={event => setResetPasswordEmail(event.target.value)}
                           className="w-full mb-3"/>
                <Password placeholder="Passwort"
                          value={resetPasswordPassword}
                          onChange={event => setResetPasswordPassword(event.target.value)}
                          inputClassName="w-full"
                          className="w-full mb-3"/>
                <Password placeholder="Widerholung"
                          value={resetPasswordPasswordRepeat}
                          onChange={event => setResetPasswordPasswordRepeat(event.target.value)}
                          inputClassName="w-full"
                          className="w-full mb-3"/>
                <Button label="Abschicken"
                        onClick={() => handleLostPassword()}
                        loading={sendingPasswordResetEmail}
                        className="w-full mb-3"/>
            </Dialog>
            <Card>
                <p>Hier kannst du dich entweder einloggen oder einen neuen Account anlegen. Bei Kursanmeldungen haben
                    User mit einem Account den Vorteil, die Videos ihrer gebuchten Kurse online anschauen zu können.</p>
                <div className="flex flex-column md:flex-row gap-4 w-full">
                    <Card title="Login" className="flex flex-column gap-3 basis-1/2 grow-0 shrink-0 w-full md:w-1/2">
                        <InputText placeholder="Email"
                                   value={username}
                                   onChange={event => setUsername(event.target.value)}
                                   className="w-full mb-3"/>
                        <Password placeholder="Password"
                                  value={password}
                                  onChange={event => setPassword(event.target.value)}
                                  inputClassName="w-full"
                                  className="w-full mb-3"/>
                        <Button label="Login"
                                onClick={() => handleLogin()}
                                loading={loggingIn}
                                className="w-full mb-3"/>
                        <a onClick={() => setResetPasswordDialog(true)}>Passwort Vergessen</a>
                    </Card>
                    <Card title="User Registrierung"
                          className="flex flex-column gap-3 basis-1/2 grow-0 shrink-0 w-full md:w-1/2">
                        <Dropdown placeholder="Geschlecht"
                                  value={registerSex}
                                  onChange={event => setRegisterSex(event.target.value)}
                                  className="w-full mb-3"
                                  options={[{value: "MALE", label: "Männlich"}, {value: "FEMALE", label: "Weiblich"}]}/>
                        <InputText placeholder="Vorname"
                                   value={registerFirstName}
                                   onChange={event => setRegisterFirstName(event.target.value)}
                                   className="w-full mb-3"/>
                        <InputText placeholder="Nachname"
                                   value={registerLastName}
                                   onChange={event => setRegisterLastName(event.target.value)}
                                   className="w-full mb-3"/>
                        <InputText placeholder="Email"
                                   value={registerEmail}
                                   onChange={event => setRegisterEmail(event.target.value)}
                                   className="w-full mb-3"/>
                        <Password placeholder="Passwort"
                                  value={registerPassword}
                                  onChange={event => setRegisterPassword(event.target.value)}
                                  inputClassName="w-full"
                                  className="w-full mb-3"/>
                        <Password placeholder="Widerholung"
                                  value={registerRepeatPassword}
                                  onChange={event => setRegisterRepeatPassword(event.target.value)}
                                  inputClassName="w-full"
                                  className="w-full mb-3"/>
                        <Button label="Registrieren"
                                onClick={() => handleRegister()}
                                loading={registering}
                                className="w-full"/>
                    </Card>
                </div>
            </Card>
        </>
    )
}
