import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {RestApplicationClient, Role, User} from "../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import React, {useRef, useState} from "react";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {Toast} from "primereact/toast";
import {useSelector} from "react-redux";
import {RootState} from "../store/store.ts";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {Toolbar} from "primereact/toolbar";
import {PickList, PickListChangeEvent} from "primereact/picklist";

const restClient = new RestApplicationClient(axios);

export default function Users() {
    let emptyUser:User = {
        id: 0,
        accountNonExpired: false,
        accountNonLocked: false,
        authorities: [],
        createdAt: new Date(),
        credentialsNonExpired: false,
        email: "",
        enabled: false,
        password: "",
        roles: [],
        updatedAt: new Date(),
        username: '',
        fullName: ''
    }
    const currentUserName = useSelector((state: RootState) => state.authentication.user?.username)
    const toast = useRef<Toast>(null)

    const [initialized, setInitialized] = useState<boolean>(false)
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User>(emptyUser)
    const [editUserDialog, setEditUserDialog] = useState(false)
    const [deleteUserDialog, setDeleteUserDialog] = useState(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [roles, setRoles] = useState<Role[]>([])
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([])

    if(!initialized) {
        restClient.listUsers().then(value => {
            setUsers(value.data)
            setInitialized(true)
        })
    }

    const findIndexById = (id: number) => {
        let index = -1
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
                index = i
                break
            }
        }
        return index
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || ''
        let _selectedUser = { ...selectedUser }

        // @ts-ignore
        _selectedUser[name] = val

        setSelectedUser(_selectedUser)
    }

    const onRolesChange = (e: PickListChangeEvent) => {
        setRoles(e.source)
        setSelectedRoles(e.target)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create or edit user
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const showCreateUserDialog = () => {
        restClient.listRoles().then(value => {
            setRoles(value.data)

            setSelectedUser(selectedUser)
            setSubmitted(false)
            setEditUserDialog(true)
        })
    }

    const showEditUserDialog = (user:User) => {
        restClient.listRoles().then(value => {
            // Make sure the right roles are pre-selected
            const _availableRoles = value.data.filter(role => user.roles.find(curRole => role.id === curRole.id) === undefined)
            setRoles(_availableRoles)
            const _selectedRoles = value.data.filter(role => user.roles.find(curRole => role.id === curRole.id) !== undefined)
            setSelectedRoles(_selectedRoles)

            setSelectedUser(user)
            setEditUserDialog(true)
        })
    }

    const handleSaveUser = () => {
        setSubmitted(true);

        if (selectedUser.username.trim()) {
            let _users = [...users]
            let _user = { ...selectedUser }
            _user.roles = selectedRoles

            // Update user
            if (_user.id !== 0) {
                const index = findIndexById(_user.id)

                // Actually save the user on the sever
                restClient.saveUser(_user).then(value => {
                    _users[index] = value.data
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 })

                    setUsers(_users)
                    setEditUserDialog(false)
                    setSelectedUser(emptyUser)
                })
            }

            // Create user
            else {
                _user.id = 0
                // Actually save the user on the sever
                restClient.saveUser(_user).then(value => {
                    _users.push(value.data)
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 })

                    setUsers(_users)
                    setEditUserDialog(false)
                    setSelectedUser(emptyUser)
                })
            }
        }
    }

    const hideUserDialog = () => {
        setEditUserDialog(false)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Delete user
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const showDeleteUserDialog = (user:User) => {
        setSelectedUser(user)
        setDeleteUserDialog(true)
    }

    const handleDeleteUser = () => {
        let _users = users.filter((val) => val.id !== selectedUser.id)
        // TODO: Actually delete the user on the sever.

        setUsers(_users)
        setDeleteUserDialog(false)
        setSelectedUser(emptyUser)
        if(toast.current) {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 })
        }
    }

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Templates
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={showCreateUserDialog} />
            </div>
        )
    }

    const actionBodyTemplate = (rowData:User) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => showEditUserDialog(rowData)} />
                {/* Disable the Delete button for the currently logged-in user */}
                {(rowData.username !== currentUserName) && (
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => showDeleteUserDialog(rowData)} />
                )}
            </React.Fragment>
        )
    }

    const editUserDialogFooterTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" outlined onClick={hideUserDialog} />
                <Button label="Save" icon="pi pi-check" onClick={handleSaveUser} />
            </React.Fragment>
        )
    }

    const deleteUserDialogFooterTemplate = () => {
        return (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog}/>
                <Button label="Yes" icon="pi pi-check" severity="danger" onClick={handleDeleteUser}/>
            </React.Fragment>
        )
    }

    const roleTemplate = (item:Role) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <span>{item.name}</span>
            </div>
        )
    }

    const rolesBodyTemplate = (rowData:User) => {
        return (
            <span>
                {rowData.roles.map(value =>
                    (<span className="mr-2">{value.name}</span>)
                )}
            </span>
        )
    }

    return (
        <>
            <Toast ref={toast} />

            <Toolbar className="mb-4" start={leftToolbarTemplate}/>

            <DataTable value={users} sortField="username" sortOrder={-1} showGridlines stripedRows tableStyle={{minWidth: '50rem'}}>
                <Column field={"id"} header={""}/>
                <Column field={"username"} sortable header={"Username"}/>
                <Column field={"fullName"} sortable header={"Full Name"}/>
                <Column field={"email"} sortable header={"Email"}/>
                <Column body={rolesBodyTemplate} field={"roles"} header={"Roles"}/>
                <Column body={actionBodyTemplate}/>
            </DataTable>

            <Dialog visible={editUserDialog} style={{width: '64rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="User Details" modal className="p-fluid" footer={editUserDialogFooterTemplate} onHide={hideUserDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Username
                    </label>
                    <InputText id="username" value={selectedUser.username}
                               onChange={(e) => onInputChange(e, 'username')} required autoFocus
                               className={classNames({'p-invalid': submitted && !selectedUser.username})}/>
                    {submitted && !selectedUser.username && <small className="p-error">Username is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Full Name
                    </label>
                    <InputText id="fullName" value={selectedUser.fullName}
                               onChange={(e) => onInputChange(e, 'fullName')} required autoFocus
                               className={classNames({'p-invalid': submitted && !selectedUser.fullName})}/>
                    {submitted && !selectedUser.fullName && <small className="p-error">Full name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        E-Mail
                    </label>
                    <InputText id="email" value={selectedUser.email}
                               onChange={(e) => onInputChange(e, 'email')} required autoFocus
                               className={classNames({'p-invalid': submitted && !selectedUser.email})}/>
                    {submitted && !selectedUser.email && <small className="p-error">E-Mail is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Roles
                    </label>
                    <PickList dataKey="id" source={roles} target={selectedRoles} onChange={(e) => onRolesChange(e)}
                              itemTemplate={roleTemplate} breakpoint="1280px"
                              sourceHeader="Available" targetHeader="Selected" sourceStyle={{height: '24rem'}}
                              targetStyle={{height: '24rem'}}/>
                </div>
            </Dialog>

            <Dialog visible={deleteUserDialog} style={{width: '32rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Confirm" modal footer={deleteUserDialogFooterTemplate} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                    {selectedUser && (
                        <span>
                            Are you sure you want to delete <b>{selectedUser.username}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </>
    )
}
