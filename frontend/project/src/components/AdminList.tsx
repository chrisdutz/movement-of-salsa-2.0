import {Toast} from "primereact/toast";
import {Toolbar} from "primereact/toolbar";
import {DataTable, DataTableValue} from "primereact/datatable";
import {Column} from "primereact/column";
import React, {JSX, useEffect, useRef, useState} from "react";
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
import ImageEditor, {ImageEditorEvent} from "./ImageEditor.tsx";
import {Checkbox} from "primereact/checkbox";
import {ProgressSpinner} from "primereact/progressspinner";

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
    optionLabel?: string,
    optionLabelFunction?: (item: any) => string,
    fieldEditor?: (value: E, setValue: (newValue: E) => void) => JSX.Element
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
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<T[]>([]);
    const [editItem, setEditItem] = useState<T | undefined>()
    const [dirty, setDirty] = useState<boolean>(false)

    useEffect(() => {
        if (!initialized) {
            setLoading(true);
            setInitialized(true);
            controller.findAll().then(response => {
                setItems(response.data)
                setLoading(false);
            })
            if (initializer) {
                initializer();
            }
        }
    }, [initialized, controller, initializer]);

    function setEditItemAndMarkDirty(value: T | undefined) {
        setEditItem(value)
        setDirty(true);
    }

    const showCreateItemDialog = () => setEditItem(emptyItem)

    const showEditItemDialog = (item: T) => setEditItem(item);

    const showConfirmDeleteItemDialog = (item: T) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Conformation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => {
                controller.delete?.(item).then(() => setInitialized(false));
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

    const handleSave = () => {
        if (editItem) {
            controller.save(editItem).then(() => {
                setDirty(false);
                setEditItem(undefined);
                setInitialized(false);
            });
        }
    };

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
            <div className="flex align-items-center gap-2">
                <Button label="Save" icon="pi pi-save" severity="success"
                        disabled={!dirty}
                        onClick={handleSave}/>
                <Button label="Abort" icon="pi pi-times-circle" severity="danger"
                        onClick={() => {
                            editItem && showConfirmAbortEditItemDialog()
                        }}/>
            </div>
        )
    }

    function renderEditor(index: number, column: EditorColumn<T>, editItem: T) {
        const value = column.field ? editItem[column.field] : column.getter?.(editItem);
        const onChange = (changedValue: any) => {
            const updatedItem = column.field
                ? {...editItem, [column.field]: changedValue}
                : {...editItem};
            column.setter?.(updatedItem, changedValue);
            setEditItemAndMarkDirty(updatedItem);
        };

        switch (column.fieldType) {
            case "Boolean":
                return <Checkbox id={`field${index}`}
                                 checked={value}
                                 onChange={event => onChange(event.checked)}
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "Custom":
                // Create a stable wrapper for the custom field editor to isolate the React hooks of any child
                // from those of the parent (Particularly important when using an AdminList as editor for a
                // field of the current AdminList instance).
                const CustomFieldWrapper = ({column, value, setValue}: {
                    column: EditorColumn<T>,
                    value: T,
                    setValue: (newValue: T) => void
                }) => {
                    // Ensure the fieldEditor function exists before calling it
                    return column.fieldEditor
                        ? column.fieldEditor(value, (updatedValue: T) => setValue(updatedValue))
                        : null;
                };

                return <CustomFieldWrapper
                    column={column}
                    value={editItem}
                    setValue={setEditItemAndMarkDirty}/>
            case "Date":
                return <Calendar id={`field${index}`}
                                 value={value}
                                 onChange={(event) => onChange(event.value)}
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "DateTime":
                return <Calendar id={`field${index}`}
                                 value={value}
                                 onChange={(event) => onChange(event.value)}
                                 showTime={true}
                                 hourFormat="24"
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "Editor":
                return <Editor id={`field${index}`}
                               value={value}
                               onTextChange={(event: EditorTextChangeEvent) => onChange(event.htmlValue)}
                               disabled={!column.editable}
                               required={column.required}
                               className={classNames({'p-invalid': column.required && !value})}
                               style={{height: '320px', background: 'white', color: 'black'}}/>
            case "Email":
                return <InputText id={`field${index}`}
                                  value={value}
                                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
                                  disabled={!column.editable}
                                  required={column.required}
                                  className={classNames({'p-invalid': column.required && !value})}/>
            case "Enum":
                return <Dropdown id={`field${index}`}
                                 value={value}
                                 options={column.selectOptions}
                                 onChange={(event: DropdownChangeEvent) => onChange(event.value)}
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "Image":
                return <ImageEditor id={`field${index}`}
                                    value={value}
                                    onChange={(event: ImageEditorEvent) => onChange(event.value)}
                                    disabled={!column.editable}
                                    required={column.required}
                                    className={classNames({'p-invalid': column.required && !value})}/>
            case "Number":
                return <InputNumber id={`field${index}`}
                                    value={value}
                                    onChange={(event: InputNumberChangeEvent) => onChange(event.value)}
                                    disabled={!column.editable}
                                    required={column.required}
                                    className={classNames({'p-invalid': column.required && !value})}/>
            case "Password":
                return <Password id={`field${index}`}
                                 value={value}
                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "Select":
                if(column.optionLabelFunction) {
                    return <Dropdown id={`field${index}`}
                                     value={value}
                                     options={column.selectOptions}
                                     itemTemplate={column.optionLabelFunction}
                                     valueTemplate={column.optionLabelFunction}
                                     onChange={(event: DropdownChangeEvent) => onChange(event.value)}
                                     disabled={!column.editable}
                                     required={column.required}
                                     className={classNames({'p-invalid': column.required && !value})}/>
                } else {
                    return <Dropdown id={`field${index}`}
                                     value={value}
                                     options={column.selectOptions}
                                     optionLabel={column.optionLabel}
                                     onChange={(event: DropdownChangeEvent) => onChange(event.value)}
                                     disabled={!column.editable}
                                     required={column.required}
                                     className={classNames({'p-invalid': column.required && !value})}/>
                }
            case "Text":
                return <InputText id={`field${index}`}
                                  value={value}
                                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
                                  disabled={!column.editable}
                                  required={column.required}
                                  className={classNames({'p-invalid': column.required && !value})}/>
            case "Time":
                return <Calendar id={`field${index}`}
                                 value={value}
                                 onChange={(event) => onChange(event.value)}
                                 timeOnly={true} hourFormat="24"
                                 disabled={!column.editable}
                                 required={column.required}
                                 className={classNames({'p-invalid': column.required && !value})}/>
            case "MultiSelect":
                console.log("Options", column.selectOptions)
                return <MultiSelect id={`field${index}`}
                                    value={value}
                                    options={column.selectOptions}
                                    optionLabel={column.optionLabel}
                                    onChange={(event: MultiSelectChangeEvent) => onChange(event.value)}
                                    disabled={!column.editable}
                                    required={column.required}
                                    className={classNames({'p-invalid': column.required && !value})}/>
            default:
                console.log(`Unhandled field type: ${column.fieldType}`)
                return <span>{value}</span>;
        }
    }

    // Output a loading spinner as long as we're loading data
    if (loading) return <ProgressSpinner/>;

    // Otherwise render normally
    return (
        <>
            <Toast ref={toast}/>

            <ConfirmDialog/>

            {!editItem ? (
                /* List view */
                <>
                    <Toolbar className="mb-4" start={listToolbarTemplate}/>
                    <DataTable value={items} sortField={listSortColumn} sortOrder={1} showGridlines stripedRows
                               tableStyle={{minWidth: '50rem'}}>
                        {listColumns.map((column, index) => {
                            if (column.field) {
                                return <Column key={"column" + index}
                                               header={column.header}
                                               field={column.field}
                                               sortable={column.sortable}/>
                            } else if (column.getter) {
                                return <Column key={"column" + index}
                                               header={column.header}
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