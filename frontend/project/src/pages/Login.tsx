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
import {SetAuthenticationTokenAction, SetAuthenticationUserAction} from "../store/store.ts";
import {Password} from "primereact/password";
import {Toast} from "primereact/toast";
import {Card} from "primereact/card";
import {Dropdown} from "primereact/dropdown";
import {Dialog} from "primereact/dialog";

const restClient = new RestApplicationClient(axios);

export default function Login() {
    const toast = useRef<Toast>(null)

    const [resetPasswordDialog, setResetPasswordDialog] = useState<boolean>(false)
    const [resetPasswordEmail, setResetPasswordEmail] = useState<string>("")
    const [resetPasswordPassword, setResetPasswordPassword] = useState<string>("")
    const [resetPasswordPasswordRepeat, setResetPasswordPasswordRepeat] = useState<string>("")
    const [resetPasswordErrors, setResetPasswordErrors] = useState({
        email: "",
        password: "",
        passwordRepeat: "",
    });
    const [sendingPasswordResetEmail, setSendingPasswordResetEmail] = useState<boolean>(false)

    function validateLostResetPasswordForm(field:string, value:any) {
        const newErrors = { ...resetPasswordErrors };

        if (field === "resetPasswordEmail") {
            if (!value) {
                newErrors.email = "Email darf nicht leer sein.";
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                newErrors.email = "Bitte eine gültige Email eingeben.";
            } else {
                newErrors.email = "";
            }
        }

        if (field === "resetPasswordPassword") {
            if (!value) {
                newErrors.password = "Passwort darf nicht leer sein.";
            } else {
                newErrors.password = "";
            }

            // Also validate password repeat if it's already filled
            if (resetPasswordPasswordRepeat || value !== resetPasswordPasswordRepeat) {
                newErrors.passwordRepeat = "Passwörter stimmen nicht überein.";
            } else {
                newErrors.passwordRepeat = "";
            }
        }

        if (field === "resetPasswordPasswordRepeat") {
            if (!value) {
                newErrors.passwordRepeat = "Bitte Passwort wiederholen.";
            } else if (value !== resetPasswordPassword) {
                newErrors.passwordRepeat = "Passwörter stimmen nicht überein.";
            } else {
                newErrors.passwordRepeat = "";
            }
        }

        setResetPasswordErrors(newErrors);
    }

    function isResetPasswordFormValid() {
        return !resetPasswordErrors.email &&
            !resetPasswordErrors.password &&
            !resetPasswordErrors.passwordRepeat &&
            resetPasswordEmail &&
            resetPasswordPassword &&
            resetPasswordPasswordRepeat;
    }

    function handleResetPassword() {
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
        return !loginErrors.email &&
            !loginErrors.password &&
            username &&
            password
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

    const [registerSex, setRegisterSex] = useState<Sex>()
    const [registerFirstName, setRegisterFirstName] = useState<string>("")
    const [registerLastName, setRegisterLastName] = useState<string>("")
    const [registerEmail, setRegisterEmail] = useState<string>("")
    const [registerPassword, setRegisterPassword] = useState<string>("")
    const [registerRepeatPassword, setRegisterRepeatPassword] = useState<string>("")
    const [registerErrors, setRegisterErrors] = useState({
        sex: undefined,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repeatPassword: ""
    });
    const [registering, setRegistering] = useState<boolean>(false)

    function validateRegistrationForm(field:string, value:any) {
        const newErrors = { ...registerErrors };

        if (field === "registerSex") {
            if (!value) {
                newErrors.email = "Geschlecht darf nicht leer sein.";
            } else {
                newErrors.email = "";
            }
        }

        if (field === "registerFirstName") {
            if (!value) {
                newErrors.password = "Vorname darf nicht leer sein.";
            } else {
                newErrors.password = "";
            }
        }

        if (field === "registerLastName") {
            if (!value) {
                newErrors.password = "Nachname darf nicht leer sein.";
            } else {
                newErrors.password = "";
            }
        }

        if (field === "registerEmail") {
            if (!value) {
                newErrors.password = "Email darf nicht leer sein.";
            } else {
                newErrors.password = "";
            }
        }


        if (field === "registerPassword") {
            if (!value) {
                newErrors.password = "Passwort darf nicht leer sein.";
            } else {
                newErrors.password = "";
            }

            // Also validate password repeat if it's already filled
            if (registerRepeatPassword || value !== registerRepeatPassword) {
                newErrors.repeatPassword = "Passwörter stimmen nicht überein.";
            } else {
                newErrors.repeatPassword = "";
            }
        }

        if (field === "registerPasswordRepeat") {
            if (!value) {
                newErrors.repeatPassword = "Bitte Passwort wiederholen.";
            } else if (value !== registerPassword) {
                newErrors.repeatPassword = "Passwörter stimmen nicht überein.";
            } else {
                newErrors.repeatPassword = "";
            }
        }

        setRegisterErrors(newErrors);
    }

    function isRegistrationFormValid() {
        return !registerErrors.sex &&
            !registerErrors.firstName &&
            !registerErrors.lastName &&
            !registerErrors.email &&
            !registerErrors.password &&
            !registerErrors.repeatPassword &&
            registerSex &&
            registerFirstName &&
            registerLastName &&
            registerEmail &&
            registerPassword &&
            registerRepeatPassword
    }

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
            <Dialog header="Passwort Vergessen"
                    visible={resetPasswordDialog} onHide={() => {
                        if (!resetPasswordDialog) return;
                            setResetPasswordEmail("")
                            setResetPasswordPassword("")
                            setResetPasswordPasswordRepeat("")
                            setResetPasswordErrors({
                                email: "",
                                password: "",
                                passwordRepeat: "",
                            })
                            setResetPasswordDialog(false)
                        }}
                    style={{width: '50vw'}} breakpoints={{'960px': '75vw', '641px': '100vw'}}>
                <p className="m-0">
                    Bitte geben sie die Email Adresse des Accounts, sowie das gewünschte neue Passwort ein.
                </p>
                <p>
                    Sollten diese Email im System vorhanden sein, werden wir ihnen eine Email mit einem Bestätigungslink
                    an diese Adresse eine email schicken.<br/>
                </p>
                <p>
                    Erst nach einem Klick auf diesen Link wird das neue Passwort aktiv.
                </p>
                <div className="field mb-3">
                    <InputText placeholder="Email"
                               value={resetPasswordEmail}
                               onChange={event => {
                                   const value = event.target.value;
                                   setResetPasswordEmail(value)
                                   validateLostResetPasswordForm("resetPasswordEmail", value)
                               }}
                               className={`w-full ${resetPasswordErrors.email ? "p-invalid" : ""}`}/>
                    {resetPasswordErrors.email && <small className="p-error">{resetPasswordErrors.email}</small>}
                </div>
                <div className="field mb-3">
                    <Password placeholder="Passwort"
                              value={resetPasswordPassword}
                              onChange={event => {
                                  const value = event.target.value;
                                  setResetPasswordPassword(value)
                                  validateLostResetPasswordForm("resetPasswordPassword", value)
                              }}
                              inputClassName={`w-full ${resetPasswordErrors.passwordRepeat ? "p-invalid" : ""}`}
                              className="w-full"/>
                    {resetPasswordErrors.password && <small className="p-error">{resetPasswordErrors.password}.</small>}
                </div>
                <div className="field mb-3">
                    <Password placeholder="Widerholung"
                              value={resetPasswordPasswordRepeat}
                              onChange={event => {
                                  const value = event.target.value;
                                  setResetPasswordPasswordRepeat(value)
                                  validateLostResetPasswordForm("resetPasswordPasswordRepeat", value)
                              }}
                              inputClassName={`w-full ${resetPasswordErrors.password ? "p-invalid" : ""}`}
                              className="w-full"/>
                    {resetPasswordErrors.passwordRepeat && <small className="p-error">{resetPasswordErrors.passwordRepeat}</small>}
                </div>
                <Button label="Abschicken"
                        onClick={handleResetPassword}
                        disabled={!isResetPasswordFormValid()}
                        loading={sendingPasswordResetEmail}
                        className="w-full mb-3"/>
            </Dialog>
            <Card>
                <p>Hier kannst du dich entweder einloggen oder einen neuen Account anlegen. Bei Kursanmeldungen haben
                    User mit einem Account den Vorteil, die Videos ihrer gebuchten Kurse online anschauen zu können.</p>
                <div className="flex flex-column md:flex-row gap-4 w-full">
                    <Card title="Login" className="flex flex-column gap-3 basis-1/2 grow-0 shrink-0 w-full md:w-1/2">
                        <div className="field mb-3">
                            <InputText placeholder="Email"
                                       value={username}
                                       onChange={event => {
                                           const value = event.target.value;
                                           setUsername(value)
                                           validateLoginForm("username", value)
                                       }}
                                       className={`w-full ${loginErrors.email ? "p-invalid" : ""}`}/>
                            {loginErrors.email && <small className="p-error">{loginErrors.email}</small>}
                        </div>
                        <div className="field mb-3">
                            <Password placeholder="Password"
                                      value={password}
                                      onChange={event => {
                                          const value = event.target.value;
                                          setPassword(value)
                                          validateLostResetPasswordForm("password", value)
                                      }}
                                      inputClassName={`w-full ${loginErrors.password ? "p-invalid" : ""}`}
                                      className="w-full"/>
                            {loginErrors.password && <small className="p-error">{loginErrors.password}</small>}
                        </div>
                        <Button label="Login"
                                onClick={() => handleLogin()}
                                disabled={!isLoginFormValid()}
                                loading={loggingIn}
                                className="w-full mb-3"/>
                        <a onClick={() => setResetPasswordDialog(true)}>Passwort Vergessen</a>
                    </Card>
                    <Card title="User Registrierung"
                          className="flex flex-column gap-3 basis-1/2 grow-0 shrink-0 w-full md:w-1/2">
                        <div className="field mb-3">
                            <Dropdown placeholder="Geschlecht"
                                      value={registerSex}
                                      onChange={event => {
                                          const value = event.target.value;
                                          setRegisterSex(value)
                                          validateRegistrationForm("registerSex", value)
                                      }}
                                      className={`w-full ${registerErrors.sex ? "p-invalid" : ""}`}
                                      options={[{value: "MALE", label: "Männlich"}, {
                                          value: "FEMALE",
                                          label: "Weiblich"
                                      }]}/>
                            {registerErrors.sex && <small className="p-error">{registerErrors.sex}</small>}
                        </div>
                        <div className="field mb-3">
                            <InputText placeholder="Vorname"
                                       value={registerFirstName}
                                       onChange={event => {
                                           const value = event.target.value;
                                           setRegisterFirstName(value)
                                           validateRegistrationForm("registerFirstName", value)
                                       }}
                                       className={`w-full ${registerErrors.firstName ? "p-invalid" : ""}`}/>
                            {registerErrors.firstName && <small className="p-error">{registerErrors.firstName}</small>}
                        </div>
                        <div className="field mb-3">
                            <InputText placeholder="Nachname"
                                       value={registerLastName}
                                       onChange={event => {
                                           const value = event.target.value;
                                           setRegisterLastName(value)
                                           validateRegistrationForm("registerLastName", value)
                                       }}
                                       className={`w-full ${registerErrors.lastName ? "p-invalid" : ""}`}/>
                            {registerErrors.lastName && <small className="p-error">{registerErrors.lastName}</small>}
                        </div>
                        <div className="field mb-3">
                            <InputText placeholder="Email"
                                       value={registerEmail}
                                       onChange={event => {
                                           const value = event.target.value;
                                           setRegisterEmail(value)
                                           validateRegistrationForm("registerEmail", value)
                                       }}
                                       className={`w-full ${registerErrors.email ? "p-invalid" : ""}`}/>
                            {registerErrors.email && <small className="p-error">{registerErrors.email}</small>}
                        </div>
                        <div className="field mb-3">
                            <Password placeholder="Passwort"
                                      value={registerPassword}
                                      onChange={event => {
                                          const value = event.target.value;
                                          setRegisterPassword(value)
                                          validateRegistrationForm("registerPassword", value)
                                      }}
                                      inputClassName={`w-full ${registerErrors.password ? "p-invalid" : ""}`}
                                      className="w-full"/>
                            {registerErrors.password && <small className="p-error">{registerErrors.password}</small>}
                        </div>
                        <div className="field mb-3">
                            <Password placeholder="Widerholung"
                                      value={registerRepeatPassword}
                                      onChange={event => {
                                          const value = event.target.value;
                                          setRegisterRepeatPassword(value)
                                          validateRegistrationForm("registerPasswordRepeat", value)
                                      }}
                                      inputClassName={`w-full ${registerErrors.repeatPassword ? "p-invalid" : ""}`}
                                      className="w-full"/>
                            {registerErrors.repeatPassword && <small className="p-error">{registerErrors.repeatPassword}</small>}
                        </div>
                        <Button label="Registrieren"
                                onClick={() => handleRegister()}
                                disabled={
                                    !registerSex ||
                                    !registerFirstName ||
                                    !registerLastName ||
                                    !registerEmail ||
                                    !registerPassword ||
                                    registerPassword !== registerRepeatPassword
                                }
                                loading={registering}
                                className="w-full"/>
                    </Card>
                </div>
            </Card>
        </>
    )
}
