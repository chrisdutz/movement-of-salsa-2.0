import React, { useState } from "react";
import {Card} from "primereact/card";
import LoginForm from "../forms/LoginForm.tsx";
import RegistrationForm from "../forms/RegistrationForm.tsx";
import ResetPasswordDialog from "../forms/ResetPasswordDialog.tsx";

export default function Login() {
    const [resetPasswordDialogVisible, setResetPasswordDialogVisible] = useState<boolean>(false);

    const handleResetPasswordClick = () => {
        setResetPasswordDialogVisible(true);
    };

    return (
        <>
            <ResetPasswordDialog 
                visible={resetPasswordDialogVisible} 
                onVisibleChange={setResetPasswordDialogVisible}
            />
            <Card>
                <p>Hier kannst du dich entweder einloggen oder einen neuen Account anlegen. Bei Kursanmeldungen haben
                    User mit einem Account den Vorteil, die Videos ihrer gebuchten Kurse online anschauen zu können.</p>
                <div className="flex flex-column md:flex-row gap-4 w-full">
                    <LoginForm resetPasswordCallback={handleResetPasswordClick}/>
                    <RegistrationForm/>
                </div>
            </Card>
        </>
    )
}
