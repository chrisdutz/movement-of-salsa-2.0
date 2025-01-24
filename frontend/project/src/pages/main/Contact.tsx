import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import React, {useRef, useState} from "react";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {RestApplicationClient} from "../../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import {Toast} from "primereact/toast";

const restClient = new RestApplicationClient(axios);

export default function Contact() {
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [subject, setSubject] = useState<string>("")
    const [message, setMessage] = useState<string>("")

    const toast = useRef<Toast>(null)

    function handleSubmit() {
        restClient.sendContactRequest({
            name: name, email: email, subject: subject, message: message
        }).then(() => {
            handleReset();
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Kontakt formular erfolgreich verschickt', life: 3000})
        })
    }

    function handleReset() {
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
    }

    return (
        <>
            <Toast ref={toast}/>
            <Card title="Kontakt">
                <InputText placeholder="Name"
                           value={name}
                           onChange={event => setName(event.target.value)}
                           className="w-full mb-3"/>
                <InputText placeholder="Email"
                           value={email}
                           onChange={event => setEmail(event.target.value)}
                           className="w-full mb-3"/>
                <InputText placeholder="Betreff"
                           value={subject}
                           onChange={event => setSubject(event.target.value)}
                           className="w-full mb-3"/>
                <InputTextarea placeholder="Nachricht"
                               value={message}
                               onChange={event => setMessage(event.target.value)}
                               rows={5}
                               className="w-full mb-3"/>
                <div className="flex flex-column md:flex-row gap-4 w-full">
                    <Button label="Abschicken"
                            onClick={() => handleSubmit()}
                            className="w-full mb-3"/>
                    <Button label="Zurücksetzen"
                            onClick={() => handleReset()}
                            className="w-full mb-3"/>
                </div>
            </Card>
        </>
    )
}
