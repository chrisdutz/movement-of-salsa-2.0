import {RestApplicationClient, Sex} from "../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import React, {useRef, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Card} from "primereact/card";
import {Toast} from "primereact/toast";

const restClient = new RestApplicationClient(axios);

export default function RegistrationForm() {
    const toast = useRef<Toast>(null)

    const [registerSex, setRegisterSex] = useState<Sex>()
    const [registerFirstName, setRegisterFirstName] = useState<string>("")
    const [registerLastName, setRegisterLastName] = useState<string>("")
    const [registerEmail, setRegisterEmail] = useState<string>("")
    const [registerPassword, setRegisterPassword] = useState<string>("")
    const [registerRepeatPassword, setRegisterRepeatPassword] = useState<string>("")
    const [registerErrors, setRegisterErrors] = useState({
        sex: "",
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
                newErrors.sex = "Geschlecht darf nicht leer sein.";
            } else {
                newErrors.sex = "";
            }
        }

        if (field === "registerFirstName") {
            if (!value) {
                newErrors.firstName = "Vorname darf nicht leer sein.";
            } else {
                newErrors.firstName = "";
            }
        }

        if (field === "registerLastName") {
            if (!value) {
                newErrors.lastName = "Nachname darf nicht leer sein.";
            } else {
                newErrors.lastName = "";
            }
        }

        if (field === "registerEmail") {
            if (!value) {
                newErrors.email = "Email darf nicht leer sein.";
            } else {
                newErrors.email = "";
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
        return registerErrors.sex == "" &&
            registerErrors.firstName == "" &&
            registerErrors.lastName == "" &&
            registerErrors.email == "" &&
            registerErrors.password == "" &&
            registerErrors.repeatPassword == ""
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
        }).then(() => {
            setRegistering(false);
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Please check your inbox to complete the registration process.', life: 3000})
        }).catch(() => {
            setRegistering(false);
            toast.current?.show({severity: 'error', summary: 'Error', detail: 'Registration failed.', life: 3000})
        })
    }

    return (
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
                          className={`w-full ${registerErrors.sex != "" ? "p-invalid" : ""}`}
                          options={[{value: "MALE", label: "Männlich"}, {
                              value: "FEMALE",
                              label: "Weiblich"
                          }]}/>
                {registerErrors.sex && (<small className="p-error">{registerErrors.sex}</small>)}
            </div>
            <div className="field mb-3">
                <InputText placeholder="Vorname"
                           value={registerFirstName}
                           onChange={event => {
                               const value = event.target.value;
                               setRegisterFirstName(value)
                               validateRegistrationForm("registerFirstName", value)
                           }}
                           className={`w-full ${registerErrors.firstName != "" ? "p-invalid" : ""}`}/>
                {registerErrors.firstName && (<small className="p-error">{registerErrors.firstName}</small>)}
            </div>
            <div className="field mb-3">
                <InputText placeholder="Nachname"
                           value={registerLastName}
                           onChange={event => {
                               const value = event.target.value;
                               setRegisterLastName(value)
                               validateRegistrationForm("registerLastName", value)
                           }}
                           className={`w-full ${registerErrors.lastName != "" ? "p-invalid" : ""}`}/>
                {registerErrors.lastName && (<small className="p-error">{registerErrors.lastName}</small>)}
            </div>
            <div className="field mb-3">
                <InputText placeholder="Email"
                           value={registerEmail}
                           onChange={event => {
                               const value = event.target.value;
                               setRegisterEmail(value)
                               validateRegistrationForm("registerEmail", value)
                           }}
                           className={`w-full ${registerErrors.email != "" ? "p-invalid" : ""}`}/>
                {registerErrors.email && (<small className="p-error">{registerErrors.email}</small>)}
            </div>
            <div className="field mb-3">
                <Password placeholder="Passwort"
                          value={registerPassword}
                          onChange={event => {
                              const value = event.target.value;
                              setRegisterPassword(value)
                              validateRegistrationForm("registerPassword", value)
                          }}
                          inputClassName={`w-full ${registerErrors.password != "" ? "p-invalid" : ""}`}
                          className="w-full"/>
                {registerErrors.password && (<small className="p-error">{registerErrors.password}</small>)}
            </div>
            <div className="field mb-3">
                <Password placeholder="Widerholung"
                          value={registerRepeatPassword}
                          onChange={event => {
                              const value = event.target.value;
                              setRegisterRepeatPassword(value)
                              validateRegistrationForm("registerPasswordRepeat", value)
                          }}
                          inputClassName={`w-full ${registerErrors.repeatPassword != "" ? "p-invalid" : ""}`}
                          className="w-full"/>
                {registerErrors.repeatPassword && (<small className="p-error">{registerErrors.repeatPassword}</small>)}
            </div>
            <Button label="Registrieren"
                    onClick={() => handleRegister()}
                    disabled={!isRegistrationFormValid()}
                    loading={registering}
                    className="w-full"/>
        </Card>
    )
}