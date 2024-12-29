import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Permission, RestApplicationClient} from "../../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import React, {useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";

const restClient = new RestApplicationClient(axios);

export default function Permissions() {
    let emptyPermission:Permission = {
        id: 0,
        moduleName: "",
        actionName: "",
        rule: "",
    }
    const toast = useRef<Toast>(null)

    const [initialized, setInitialized] = useState<boolean>(false)
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [selectedPermission, setSelectedPermission] = useState<Permission>(emptyPermission)
    const [editPermissionDialog, setEditPermissionDialog] = useState(false)
    const [submitted, setSubmitted] = useState<boolean>(false)

    if(!initialized) {
        restClient.listPermissions().then(value => {
            setPermissions(value.data)
            setInitialized(true)
        })
    }

    const findIndexById = (id: number) => {
        let index = -1
        for (let i = 0; i < permissions.length; i++) {
            if (permissions[i].id === id) {
                index = i
                break
            }
        }
        return index
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || ''
        let _selectedPermission = { ...selectedPermission }

        // @ts-ignore
        _selectedPermission[name] = val

        setSelectedPermission(_selectedPermission)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Edit permission
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const showEditPermissionDialog = (permission:Permission) => {
        setSelectedPermission(permission)
        setEditPermissionDialog(true)
    }

    const handleSavePermission = () => {
        setSubmitted(true);

        if (selectedPermission.moduleName.trim()) {
            let _permissions = [...permissions]
            let _permission = { ...selectedPermission }

            // Update permission
            if (_permission.id !== 0) {
                const index = findIndexById(_permission.id)
                // Actually save the permission on the sever
                restClient.savePermission(_permission).then(value => {
                    _permissions[index] = value.data
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Permission Updated', life: 3000 })

                    setPermissions(_permissions)
                    setEditPermissionDialog(false)
                    setSelectedPermission(emptyPermission)
                })
            }

            // Create permission
            else {
                _permission.id = 0
                // Actually save the permission on the sever
                restClient.savePermission(_permission).then(value => {
                    _permissions.push(value.data)
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Permission Created', life: 3000 })

                    setPermissions(_permissions)
                    setEditPermissionDialog(false)
                    setSelectedPermission(emptyPermission)
                })
            }
        }
    }

    const hidePermissionDialog = () => {
        setEditPermissionDialog(false)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Templates
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const actionBodyTemplate = (rowData:Permission) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => showEditPermissionDialog(rowData)} />
            </React.Fragment>
        )
    }

    const editPermissionDialogFooterTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" outlined onClick={hidePermissionDialog} />
                <Button label="Save" icon="pi pi-check" onClick={handleSavePermission} />
            </React.Fragment>
        )
    }

    return (
        <>
            <Toast ref={toast} />

            <DataTable value={permissions} sortField="name" sortOrder={-1} showGridlines stripedRows tableStyle={{minWidth: '50rem'}}>
                <Column field={"id"} header={""}/>
                <Column field={"moduleName"} sortable header={"Module Name"}/>
                <Column field={"actionName"} sortable header={"Action Name"}/>
                <Column field={"rule"} sortable header={"Rule"}/>
                <Column body={actionBodyTemplate}/>
            </DataTable>

            <Dialog visible={editPermissionDialog} style={{width: '32rem'}}
                    breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Permission Details" modal className="p-fluid" footer={editPermissionDialogFooterTemplate}
                    onHide={hidePermissionDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Module Name
                    </label>
                    <span>{selectedPermission.moduleName}</span>
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Action Name
                    </label>
                    <span>{selectedPermission.actionName}</span>
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Rule
                    </label>
                    <InputText id="name" value={selectedPermission.rule}
                               onChange={(e) => onInputChange(e, 'rule')} required autoFocus
                               className={classNames({'p-invalid': submitted && !selectedPermission.rule})}/>
                    {submitted && !selectedPermission.rule && <small className="p-error">Rule is required.</small>}
                </div>
            </Dialog>
        </>
    )
}
