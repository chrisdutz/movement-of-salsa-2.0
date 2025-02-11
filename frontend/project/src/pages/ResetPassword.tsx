import React, {useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {Card} from "primereact/card";

export default function ResetPassword() {
    /*const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")*/
    const [resettingPassword, setResettingPassword] = useState<boolean>(false)

    const toast = useRef<Toast>(null)

    function handleResetPassword() {
        setResettingPassword(true);
        /*restClient.resetPassword({
            token: token,
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
        })*/
    }

    return (
        <>
            <Toast ref={toast}/>
            <Card>
                <p>Hier kannst du dich entweder einloggen oder einen neuen Account anlegen. Bei Kursanmeldungen haben
                    User mit einem Account den Vorteil, die Videos ihrer gebuchten Kurse online anschauen zu können.</p>
                {/*<div className="flex flex-column md:flex-row gap-4 w-full">
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
                        <a onClick={() => setLostPasswordDialog(true)}>Passwort Vergessen</a>
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
                </div>*/}
            </Card>
        </>
    )
}
