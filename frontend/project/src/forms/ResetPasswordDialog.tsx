import {RestApplicationClient} from "../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import React, {useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";

const restClient = new RestApplicationClient(axios);

interface ResetPasswordDialogProps {
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
}

export default function ResetPasswordDialog({ visible = false, onVisibleChange }: ResetPasswordDialogProps) {
    const toast = useRef<Toast>(null)

    const [resetPasswordDialog, setResetPasswordDialog] = useState<boolean>(visible)

    // Update internal state when prop changes
    React.useEffect(() => {
        setResetPasswordDialog(visible);
    }, [visible]);

    // Notify the parent component when the internal state changes
    const updateVisibility = (newValue: boolean) => {
        setResetPasswordDialog(newValue);
        if (onVisibleChange) {
            onVisibleChange(newValue);
        }
    }
    const [resetPasswordEmail, setResetPasswordEmail] = useState<string>("")
    const [resetPasswordPassword, setResetPasswordPassword] = useState<string>("")
    const [resetPasswordPasswordRepeat, setResetPasswordPasswordRepeat] = useState<string>("")
    const [resetPasswordErrors, setResetPasswordErrors] = useState({
        email: "",
        password: "",
        passwordRepeat: "",
    });
    const [sendingPasswordResetEmail, setSendingPasswordResetEmail] = useState<boolean>(false)

    function validateResetPasswordForm(field:string, value:any) {
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
            resetPasswordErrors.password == "" &&
            resetPasswordErrors.passwordRepeat == ""
    }

    function handleResetPassword() {
        setSendingPasswordResetEmail(true)
        console.log("Requesting reset password", resetPasswordEmail)
        restClient.resetPassword({email: resetPasswordEmail, password: resetPasswordPassword}).then(() => {
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Reset Password Email sent', life: 3000})
            updateVisibility(false)
            setSendingPasswordResetEmail(false)
            setResetPasswordEmail("")
            setResetPasswordPassword("")
            setResetPasswordPasswordRepeat("")
        }).catch(() => {
            toast.current?.show({severity: 'error', summary: 'Error', detail: 'Reset Password Email failed', life: 3000})
            updateVisibility(false)
            setSendingPasswordResetEmail(false)
            setResetPasswordEmail("")
            setResetPasswordPassword("")
            setResetPasswordPasswordRepeat("")
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
                updateVisibility(false)
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
                                   validateResetPasswordForm("resetPasswordEmail", value)
                               }}
                               className={`w-full ${resetPasswordErrors.email != "" ? "p-invalid" : ""}`}/>
                    {resetPasswordErrors.email && (<small className="p-error">{resetPasswordErrors.email}</small>)}
                </div>
                <div className="field mb-3">
                    <Password placeholder="Passwort"
                              value={resetPasswordPassword}
                              onChange={event => {
                                  const value = event.target.value;
                                  setResetPasswordPassword(value)
                                  validateResetPasswordForm("resetPasswordPassword", value)
                              }}
                              inputClassName={`w-full ${resetPasswordErrors.passwordRepeat != "" ? "p-invalid" : ""}`}
                              className="w-full"/>
                    {resetPasswordErrors.password && (<small className="p-error">{resetPasswordErrors.password}.</small>)}
                </div>
                <div className="field mb-3">
                    <Password placeholder="Widerholung"
                              value={resetPasswordPasswordRepeat}
                              onChange={event => {
                                  const value = event.target.value;
                                  setResetPasswordPasswordRepeat(value)
                                  validateResetPasswordForm("resetPasswordPasswordRepeat", value)
                              }}
                              inputClassName={`w-full ${resetPasswordErrors.passwordRepeat != "" ? "p-invalid" : ""}`}
                              className="w-full"/>
                    {resetPasswordErrors.passwordRepeat && (<small className="p-error">{resetPasswordErrors.passwordRepeat}</small>)}
                </div>
                <Button label="Abschicken"
                        onClick={handleResetPassword}
                        disabled={!isResetPasswordFormValid()}
                        loading={sendingPasswordResetEmail}
                        className="w-full mb-3"/>
            </Dialog>
        </>
    )
}
