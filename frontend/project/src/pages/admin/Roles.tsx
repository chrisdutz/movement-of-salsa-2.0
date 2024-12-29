import {RestApplicationClient, RestResponse, Role} from "../../generated/plc4j-tools-ui-frontend.ts";
import axios, {AxiosRequestConfig} from "axios";
import AdminList from "../../components/AdminList.tsx";

const restClient = new RestApplicationClient(axios);

export default function Roles() {
    return AdminList<Role>({
        emptyItem: {
            id: 0,
            name: ""
        },
        listColumns: [
            {sortable: true, header: "Name", field: "name"}
        ],
        listSortColumn: "name",
        editorColumns: [
            {label: "Name", required: true, fieldType: "InputText", field: "name"},
        ],
        controller: {
            findAll(options: AxiosRequestConfig | undefined): RestResponse<Role[]> {
                return restClient.listRoles();
            },
            save(entry: Role, options: AxiosRequestConfig | undefined): RestResponse<Role> {
                return restClient.saveRole(entry);
            },
            delete(entry: Role, options?: AxiosRequestConfig): RestResponse<void> {
                return restClient.deleteRole(entry);
            }
        }
    })
    /*



    let emptyRole:Role = {
        id: 0,
        name: ""
    }
    const toast = useRef<Toast>(null)

    const [initialized, setInitialized] = useState<boolean>(false)
    const [roles, setRoles] = useState<Role[]>([])
    const [selectedRole, setSelectedRole] = useState<Role>(emptyRole)
    const [editRoleDialog, setEditRoleDialog] = useState(false)
    const [deleteRoleDialog, setDeleteRoleDialog] = useState(false)
    const [submitted, setSubmitted] = useState<boolean>(false)

    if(!initialized) {
        restClient.listRoles().then(value => {
            setRoles(value.data)
            setInitialized(true)
        })
    }

    const findIndexById = (id: number) => {
        let index = -1
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].id === id) {
                index = i
                break
            }
        }
        return index
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || ''
        let _selectedRole = { ...selectedRole }

        // @ts-ignore
        _selectedRole[name] = val

        setSelectedRole(_selectedRole)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create or edit role
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const showCreateRoleDialog = () => {
        setSelectedRole(selectedRole)
        setSubmitted(false)
        setEditRoleDialog(true)
    }

    const showEditRoleDialog = (role:Role) => {
        setSelectedRole(role)
        setEditRoleDialog(true)
    }

    const handleSaveRole = () => {
        setSubmitted(true);

        if (selectedRole.name.trim()) {
            let _roles = [...roles]
            let _role = { ...selectedRole }

            // Update role
            if (_role.id !== 0) {
                const index = findIndexById(_role.id)
                // Actually save the role on the sever
                restClient.saveRole(_role).then(value => {
                    _roles[index] = value.data
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Role Updated', life: 3000 })

                    setRoles(_roles)
                    setEditRoleDialog(false)
                    setSelectedRole(emptyRole)
                })
            }

            // Create role
            else {
                _role.id = 0
                // Actually save the role on the sever
                restClient.saveRole(_role).then(value => {
                    _roles.push(value.data)
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Role Created', life: 3000 })

                    setRoles(_roles)
                    setEditRoleDialog(false)
                    setSelectedRole(emptyRole)
                })
            }
        }
    }

    const hideRoleDialog = () => {
        setEditRoleDialog(false)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Delete role
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const showDeleteRoleDialog = (role:Role) => {
        setSelectedRole(role)
        setDeleteRoleDialog(true)
    }

    const handleDeleteRole = () => {
        restClient.deleteRole(selectedRole).then(() => {
                let _roles = roles.filter((val) => val.id !== selectedRole.id)
                toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Role Deleted', life: 3000})

                setRoles(_roles)
                setDeleteRoleDialog(false)
                setSelectedRole(emptyRole)
            }
        )
    }

    const hideDeleteRoleDialog = () => {
        setDeleteRoleDialog(false)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Templates
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={showCreateRoleDialog} />
            </div>
        )
    }

    const actionBodyTemplate = (rowData:Role) => {
        return (
            <React.Fragment>
                {/ * Disable the Delete button for the "Administrator" Role * /}
                {(rowData.name !== "Administrator") && (
                    <>
                        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => showEditRoleDialog(rowData)} />
                        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => showDeleteRoleDialog(rowData)} />
                    </>
                )}
            </React.Fragment>
        )
    }

    const editRoleDialogFooterTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" outlined onClick={hideRoleDialog} />
                <Button label="Save" icon="pi pi-check" onClick={handleSaveRole} />
            </React.Fragment>
        )
    }

    const deleteRoleDialogFooterTemplate = () => {
        return (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRoleDialog}/>
                <Button label="Yes" icon="pi pi-check" severity="danger" onClick={handleDeleteRole}/>
            </React.Fragment>
        )
    }

    return (
        <>
            <Toast ref={toast} />

            <Toolbar className="mb-4" start={leftToolbarTemplate}/>

            <DataTable value={roles} sortField="name" sortOrder={-1} showGridlines stripedRows tableStyle={{minWidth: '50rem'}}>
                <Column field={"id"} header={""}/>
                <Column field={"name"} sortable header={"Name"}/>
                <Column body={actionBodyTemplate}/>
            </DataTable>

            <Dialog visible={editRoleDialog} style={{width: '32rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Role Details" modal className="p-fluid" footer={editRoleDialogFooterTemplate} onHide={hideRoleDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={selectedRole.name}
                               onChange={(e) => onInputChange(e, 'name')} required autoFocus
                               className={classNames({'p-invalid': submitted && !selectedRole.name})}/>
                    {submitted && !selectedRole.name && <small className="p-error">Username is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteRoleDialog} style={{width: '32rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Confirm" modal footer={deleteRoleDialogFooterTemplate} onHide={hideDeleteRoleDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                    {selectedRole && (
                        <span>
                            Are you sure you want to delete <b>{selectedRole.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </>
    )*/
}
