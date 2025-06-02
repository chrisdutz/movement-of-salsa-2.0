import {Toolbar} from "primereact/toolbar";
import React, {useRef, useState} from "react";
import {Button} from "primereact/button";
import {confirmDialog} from "primereact/confirmdialog";
import {RestApplicationClient, User} from "../../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import {InputNumber, InputNumberChangeEvent} from "primereact/inputnumber";
import {InputText} from "primereact/inputtext";
import {Toast} from "primereact/toast";

const restClient = new RestApplicationClient(axios);

export default function Profile() {
    const toast = useRef<Toast>(null)

    const [initialized, setInitialized] = useState<boolean>(false)
    const [editItem, setEditItem] = useState<User | undefined>()
    const [dirty, setDirty] = useState<boolean>(false)

    if(!initialized) {
        restClient.authenticatedUser().then(value => setEditItem(value.data))
        setInitialized(true)
    }

    const showConfirmAbortEditItemDialog = () => {
        // Only show the dialog if the editor is dirty.
        if (dirty) {
            confirmDialog({
                message: 'Do you want to abort editing this record?',
                header: 'Abort Editing',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'accept',
                accept: () => {
                    setDirty(false);
                    setEditItem(undefined);
                    // Reset the initialized state to make the list update itself again.
                    setInitialized(false);
                }
            });
        } else {
            setEditItem(undefined);
        }
    }

    const editorToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Save" icon="pi pi-save" severity="success" className="mr-2"
                        disabled={!dirty}
                        onClick={() => {
                    if (editItem) {
                        restClient.saveUser(editItem).then(() => {
                            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Profile saved', life: 3000})
                            setDirty(false);
                            setEditItem(undefined);
                            setInitialized(false);
                        }).catch(() => {
                            toast.current?.show({severity: 'error', summary: 'Error', detail: 'Saving profile failed', life: 3000})
                            setDirty(false);
                            setEditItem(undefined);
                            setInitialized(false);
                        });
                    }
                }}/>
                <Button label="Abort" icon="pi pi-times-circle" severity="danger" className="mr-2"
                        disabled={!dirty}
                        onClick={() => editItem && showConfirmAbortEditItemDialog()}/>
            </div>
        )
    }

    return (
        <>
            <Toast ref={toast}/>
            <Toolbar className="mb-4" start={editorToolbarTemplate}/>
            <div className="p-fluid">
                <div className="field">
                    <label htmlFor="field0" className="font-bold">Vorname</label>
                    <InputText id="field0"
                               value={editItem?.firstName}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   const updatedItem = {...editItem, firstName: event.target.value} as User;
                                   setEditItem(updatedItem);
                                   setDirty(true);
                               }}/>
                </div>
                <div className="field">
                    <label htmlFor="field1" className="font-bold">Nachname</label>
                    <InputText id="field1"
                               value={editItem?.lastName}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   const updatedItem = {...editItem, lastName: event.target.value} as User;
                                   setEditItem(updatedItem);
                                   setDirty(true);
                               }}/>
                </div>
                <div className="field">
                    <label htmlFor="field2" className="font-bold">Straße</label>
                    <InputText id="field2"
                               value={editItem?.street}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   const updatedItem = {...editItem, street: event.target.value} as User;
                                   setEditItem(updatedItem);
                                   setDirty(true);
                               }}/>
                </div>
                <div className="field">
                    <label htmlFor="field3" className="font-bold">PLZ</label>
                    <InputText id="field3"
                               value={editItem?.zip}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   const updatedItem = {...editItem, zip: event.target.value} as User;
                                   setEditItem(updatedItem);
                                   setDirty(true);
                               }}/>
                </div>
                <div className="field">
                    <label htmlFor="field4" className="font-bold">Ort</label>
                    <InputText id="field4"
                               value={editItem?.city}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   const updatedItem = {...editItem, city: event.target.value} as User;
                                   setEditItem(updatedItem);
                                   setDirty(true);
                               }}/>
                </div>
                <div className="field">
                    <label htmlFor="field5" className="font-bold">Land</label>
                    <InputText id="field5"
                               value={editItem?.country}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   const updatedItem = {...editItem, country: event.target.value} as User;
                                   setEditItem(updatedItem);
                                   setDirty(true);
                               }}/>
                </div>
                <div className="field">
                    <label htmlFor="field6" className="font-bold">Größe (cm)</label>
                    <InputNumber id="field6"
                                 value={editItem?.size}
                                 onChange={(event: InputNumberChangeEvent) => {
                                     const updatedItem = {...editItem, size: event.value} as User;
                                     setEditItem(updatedItem);
                                     setDirty(true);
                                 }}/>
                </div>
                <div className="field">
                    <label htmlFor="field7" className="font-bold">Telefon</label>
                    <InputText id="field7"
                               value={editItem?.phone}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   const updatedItem = {...editItem, phone: event.target.value} as User;
                                   setEditItem(updatedItem);
                                   setDirty(true);
                               }}/>
                </div>
            </div>
        </>
    )
}
