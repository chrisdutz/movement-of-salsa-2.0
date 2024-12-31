import {Toast} from "primereact/toast";
import {Toolbar} from "primereact/toolbar";
import {DataTable, DataTableValue} from "primereact/datatable";
import {Column} from "primereact/column";
import React, {useRef, useState} from "react";
import {RestResponse} from "../generated/plc4j-tools-ui-frontend";
import {Button} from "primereact/button";
import * as Axios from "axios";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {InputNumber, InputNumberChangeEvent} from "primereact/inputnumber";
import {Calendar} from "primereact/calendar";
import {Editor, EditorTextChangeEvent} from "primereact/editor";
import {MultiSelect, MultiSelectChangeEvent} from "primereact/multiselect";
import {Dropdown, DropdownChangeEvent} from "primereact/dropdown";
import {Password} from "primereact/password";

export interface AdminController<E> {
    findAll(options?: Axios.AxiosRequestConfig): RestResponse<E[]>

    save(entry: E, options?: Axios.AxiosRequestConfig): RestResponse<E>

    delete?(entry: E, options?: Axios.AxiosRequestConfig): RestResponse<void>
}

export interface ListColumn<E> {
    header: string;
    sortable: boolean;
    field?: string;
    getter?: (item: E) => any;
}

export interface EditorColumn<E> {
    label: string,
    required: boolean,
    editable: boolean,
    fieldType: any,
    field?: string,
    getter?: (item: E) => any,
    setter?: (item: E, value: any) => void,
    selectOptions?: any[],
    optionLabel?: string
}

interface AdminListProps<T> {
    controller: AdminController<T>;
    emptyItem: T;
    listColumns: ListColumn<T>[];
    listSortColumn: string;
    editorColumns: EditorColumn<T>[];
    initializer?: () => void;
}

export default function AdminList<T extends DataTableValue>({
                                                                controller,
                                                                emptyItem,
                                                                listColumns,
                                                                listSortColumn,
                                                                editorColumns,
                                                                initializer
                                                            }: AdminListProps<T>) {
    const toast = useRef<Toast>(null)

    const [initialized, setInitialized] = useState<boolean>(false)
    const [items, setItems] = useState<T[]>([]);
    const [editItem, setEditItem] = useState<T | undefined>()
    const [dirty, setDirty] = useState<boolean>(false)

    if (!initialized) {
        setInitialized(true);
        controller.findAll().then(response => {
            setItems(response.data)
        })
        if (initializer) {
            initializer();
        }
    }

    const showCreateItemDialog = () => {
        setEditItem(emptyItem);
    }

    const showEditItemDialog = (item: T) => {
        setEditItem(item);
    }

    const showConfirmDeleteItemDialog = (item: T) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Conformation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => {
                if (controller.delete) {
                    controller.delete(item).then(() => setInitialized(false))
                }
            }
        });
    }

    const showConfirmAbortEditItemDialog = () => {
        // Only show the dialog, if the editor is dirty.
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

    const listToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                {/* If we can't delete, we usually also can't create */}
                {controller.delete &&
                    <Button label="New" icon="pi pi-plus" severity="success" onClick={showCreateItemDialog}/>
                }
            </div>
        )
    }

    const listItemActionsTemplate = (item: T) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => showEditItemDialog(item)}/>
                {controller.delete &&
                    <Button icon="pi pi-trash" rounded outlined className="mr-2"
                            onClick={() => showConfirmDeleteItemDialog(item)}/>
                }
            </React.Fragment>
        )
    }

    const editorToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Save" icon="pi pi-save" severity="success" className="mr-2" onClick={() => {
                    if (editItem) {
                        controller.save(editItem).then(() => {
                            setDirty(false);
                            setEditItem(undefined);
                            setInitialized(false);
                        });
                    }
                }}/>
                <Button label="Abort" icon="pi pi-times-circle" severity="danger" className="mr-2"
                        onClick={() => editItem && showConfirmAbortEditItemDialog()}/>
            </div>
        )
    }

    function renderEditor(index: number, column: EditorColumn<T>, editItem: T) {
        let value: any;
        let onChange: (value: any) => void;
        if (column.field) {
            onChange = (changedValue: any) => {
                const updatedItem = {...editItem, [column.field as string]: changedValue};
                setEditItem(updatedItem);
                setDirty(true);
            }
            value = editItem[column.field];
        } else if (column.getter) {
            console.log("Using `getter` not implemented yet")
            /*if(editItem && column && column.setter && value) {
                onChange = (value: any) => {
                    column.setter(editItem, value);
                    setDirty(true);
                }
            }*/
            value = column.getter(editItem);
        }

        // Just output the text, if the column is not editable
        /*if(!column.editable) {
            return value;
        }*/

        switch (column.fieldType) {
            case "Date":
                return <Calendar id={"field" + index}
                                 value={value}
                                 onChange={(event) => onChange(event.value)}
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "DateTime":
                return <Calendar id={"field" + index}
                                 value={value}
                                 onChange={(event) => onChange(event.value)}
                                 showTime={true}
                                 hourFormat="24"
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "Editor":
                return <Editor id={"field" + index}
                               value={value}
                               onTextChange={(event: EditorTextChangeEvent) => onChange(event.htmlValue)}
                               disabled={!column.editable}
                               required={column.required}
                               className={classNames({'p-invalid': column.required && !value})}
                               style={{height: '320px', background: 'white', color: 'black'}}/>
            case "Email":
                return <InputText id={"field" + index}
                                  value={value}
                                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
                                  disabled={!column.editable}
                                  required={column.required}
                                  className={classNames({'p-invalid': column.required && !value})}/>
            case "Enum":
                return <Dropdown id={"field" + index}
                                 value={value}
                                 options={column.selectOptions}
                                 onChange={(event: DropdownChangeEvent) => onChange(event.value)}
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "Number":
                return <InputNumber id={"field" + index}
                                    value={value}
                                    onChange={(event: InputNumberChangeEvent) => onChange(event.value)}
                                    disabled={!column.editable}
                                    required={column.required}
                                    className={classNames({'p-invalid': column.required && !value})}/>
            case "Password":
                return <Password id={"field" + index}
                                 value={value}
                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "Select":
                return <Dropdown id={"field" + index}
                                 value={value}
                                 options={column.selectOptions}
                                 optionLabel={column.optionLabel}
                                 onChange={(event: DropdownChangeEvent) => onChange(event.value)}
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "Text":
                return <InputText id={"field" + index}
                                  value={value}
                                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
                                  disabled={!column.editable}
                                  required={column.required}
                                  className={classNames({'p-invalid': column.required && !value})}/>
            case "Time":
                return <Calendar id={"field" + index}
                                 value={value}
                                 onChange={(event) => onChange(event.value)}
                                 timeOnly={true} hourFormat="24"
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "MultiSelect":
                console.log("Options", column.selectOptions)
                return <MultiSelect id={"field" + index}
                                    value={value}
                                    options={column.selectOptions}
                                    optionLabel={column.optionLabel}
                                    onChange={(event: MultiSelectChangeEvent) => onChange(event.value)}
                                    disabled={!column.editable}
                                    required={column.required}
                                    className={classNames({'p-invalid': column.required && !value})}/>
        }
        return <></>
    }

    return (
        <>
            <Toast ref={toast}/>

            <ConfirmDialog/>

            {!editItem ? (
                /* List view */
                <>
                    <Toolbar className="mb-4" start={listToolbarTemplate}/>
                    <DataTable value={items} sortField={listSortColumn} sortOrder={-1} showGridlines stripedRows
                               tableStyle={{minWidth: '50rem'}}>
                        {listColumns.map((column) => {
                            if (column.field) {
                                return <Column header={column.header}
                                               field={column.field}
                                               sortable={column.sortable}/>
                            } else if (column.getter) {
                                return <Column header={column.header}
                                               body={column.getter}
                                               sortable={column.sortable}/>
                            }
                        })}
                        <Column body={listItemActionsTemplate}/>
                    </DataTable>
                </>
            ) : (
                /* Editor view */
                <>
                    <Toolbar className="mb-4" start={editorToolbarTemplate}/>
                    <div className="p-fluid">
                        {editorColumns.map((column, index) => {
                            return <div className="field">
                                <label htmlFor={"field" + index} className="font-bold">
                                    {column.label}
                                </label>
                                {renderEditor(index, column, editItem)}
                            </div>
                        })}
                    </div>
                </>
            )}
        </>
    )
}