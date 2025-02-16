import {Toast} from "primereact/toast";
import {Toolbar} from "primereact/toolbar";
import {DataTable, DataTableStateEvent, DataTableValue, SortOrder} from "primereact/datatable";
import {Column} from "primereact/column";
import React, {JSX, ReactNode, useEffect, useRef, useState} from "react";
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
import {Message} from "primereact/message";

export interface AdminController<E> {
    findAll(options?: Axios.AxiosRequestConfig): RestResponse<E[]>

    save(entry: E, options?: Axios.AxiosRequestConfig): RestResponse<E>

    delete?(entry: E, options?: Axios.AxiosRequestConfig): RestResponse<void>
}

export interface GlobalAction {
    icon: string;
    label?: string;
    severity?: 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help' | 'contrast' | undefined;
    onClick: () => void;
}

export interface ItemAction<E> {
    icon: string;
    label?: string;
    tooltip?: string;
    onClick: (item:E, setItems: React.Dispatch<React.SetStateAction<E[]>>, setChildEditor:React.Dispatch<React.SetStateAction<ReactNode>>) => void;
}

export interface ListColumn<E> {
    header: string;
    sortable: boolean;
    fieldType?: 'Date' | 'DateTime' | 'Time' | 'HTML' | undefined;
    field?: string;
    getter?: (item: E) => any;
    styleFunction?: (item: E) => string;
}

export interface EditorColumn<E> {
    label: string;
    required: boolean;
    editable: boolean;
    fieldType: 'Boolean' | 'Custom' | 'Date' | 'DateTime' | 'Editor' | 'Email' | 'Enum' | 'Image' | 'Number' | 'Password' | 'Select' | 'Text' | 'Time' | 'MultiSelect' | undefined;
    field?: string;
    getter?: (item: E) => any;
    setter?: (item: E, value: any) => void;
    selectOptions?: any[];
    optionLabel?: string;
    optionLabelFunction?: (item: any) => string;
    optionValueFunction?: (item: any) => any;
    onOptionSelected?: (item: E, setValue: (newValue: E) => void, selectedItem: any) => void;
    fieldEditor?: (value: E, setValue: (newValue: E) => void) => JSX.Element;
}

interface AdminListProps<T> {
    controller: AdminController<T>;
    emptyItem: T;
    globalActions?: GlobalAction[];
    globalLabel?: string;
    listColumns: ListColumn<T>[];
    listSortColumn?: string;
    listSortOrder?: SortOrder;
    listActions?: ItemAction<T>[];
    onOpenEditor?: (selectedValue: T | undefined) => void;
    editorColumns: EditorColumn<T>[];
    editorActions?: ItemAction<T>[];
    initializer?: () => void;
}

export default function AdminList<T extends DataTableValue>({
                                                                controller,
                                                                emptyItem,
                                                                globalActions,
                                                                globalLabel,
                                                                listColumns,
                                                                listSortColumn,
                                                                listSortOrder,
                                                                listActions,
                                                                onOpenEditor,
                                                                editorColumns,
                                                                //editorActions,
                                                                initializer
                                                            }: AdminListProps<T>) {
    const toast = useRef<Toast>(null)

    const [initialized, setInitialized] = useState<boolean>(false)
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<T[]>([]);
    const [editItem, setEditItemInternal] = useState<T | undefined>()
    const [dirty, setDirty] = useState<boolean>(false)
    const [sortColumnName, setSortColumnName] = useState<string | undefined>(listSortColumn)
    const [sortOrder, setSortOrder] = useState<SortOrder>(listSortOrder)

    const [childEditor, setChildEditor] = useState<ReactNode>()

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
    useEffect(() => {
        if(sortColumnName && items && items.length > 0) {
            handleSort({
                filters: {},
                first: 0,
                multiSortMeta: undefined,
                rows: 0,
                sortOrder: sortOrder,
                sortField: sortColumnName
            })
        }
    }, [loading]);

    function setEditItem(value: T | undefined) {
        if(onOpenEditor) {
            onOpenEditor(value)
        }
        setEditItemInternal(value)
    }

    function setEditItemAndMarkDirty(value: T | undefined) {
        console.log("Updating", value)
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
                {globalActions &&
                    globalActions.map((value) =>
                        <Button icon={value.icon} severity={value.severity}
                                label={value.label} onClick={() => value.onClick()}/>
                    )
                }
            </div>
        )
    }

    const listToolbarMessagesTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                {globalLabel && globalLabel.length > 0 &&
                    <Message severity="warn" text={globalLabel} />
                }
            </div>
        )
    }

    const listItemActionsTemplate = (item: T) => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button icon="pi pi-pencil" tooltip="Edit" rounded outlined onClick={() => showEditItemDialog(item)}/>
                {controller.delete &&
                    <Button icon="pi pi-trash" tooltip="Delete" rounded outlined
                            onClick={() => showConfirmDeleteItemDialog(item)}/>
                }
                {listActions &&
                    listActions.map((value) =>
                        <Button icon={value.icon} rounded outlined
                                label={value.label} tooltip={value.tooltip} onClick={() => value.onClick(item, (value) => {
                                        setItems(value)
                                        // Mainly to ensure sorting it happening.
                                        setInitialized(false)
                                    }, setChildEditor)}/>
                    )
                }
            </div>
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

    function renderListColumn(data: any, column:ListColumn<T>) {
        const value = column.field ? data[column.field] : column.getter?.(data);

        const renderFunction = (fieldType: 'Date' | 'DateTime' | 'Time' | 'HTML' | undefined, value:any) => {
            switch (fieldType) {
                case "Date": {
                    return new Date(value).toLocaleDateString()
                }
                case "DateTime": {
                    return new Date(value).toLocaleString([], {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                }
                case "Time": {
                    return new Date(value).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                }
            }
            return value.toString();
        }

        if(column.styleFunction) {
            const computedClassNames = column.styleFunction(data)
            return <div className={computedClassNames}>
                {renderFunction(column.fieldType, value)}
            </div>
        }
        return renderFunction(column.fieldType, value)
    }

    function renderEditor(index: number, column: EditorColumn<T>, editItem: T) {
        const value = column.field ? editItem[column.field] : column.getter?.(editItem);
        const onChange = (changedValue: any) => {
            // Only actually execute a change, if it really changed.
            if(column.field && editItem[column.field] == changedValue) {
                return
            }
            // Create a new instance.
            // If the "field" option is set, update the given field directly.
            // Otherwise, simply create a copy of the old one.
            const updatedItem = column.field
                ? {...editItem, [column.field]: changedValue}
                : {...editItem};
            // If a setter is provided, call that to change the value on the clone.
            column.setter?.(updatedItem, changedValue);
            setEditItemAndMarkDirty(updatedItem);
        };

        switch (column.fieldType) {
            case "Boolean":
                return <>
                    <br/>
                    <Checkbox id={`field${index}`}
                              checked={value}
                              onChange={event => onChange(event.checked)}
                              disabled={!column.editable}
                              required={column.required}
                              className={classNames({'p-invalid': column.required && !value})}/>
                </>
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
                                     value={column.optionValueFunction ? column.selectOptions?.find(curOption => column.optionValueFunction && column.optionValueFunction(curOption) == value) : value}
                                     options={column.selectOptions}
                                     itemTemplate={column.optionLabelFunction}
                                     valueTemplate={column.optionLabelFunction}
                                     onChange={(event: DropdownChangeEvent) => {
                                         if(column.onOptionSelected) {
                                             column.onOptionSelected(editItem, setEditItemAndMarkDirty, event.value);
                                         } else {
                                             return column.optionValueFunction ? onChange(column.optionValueFunction(event.value)) : onChange(event.value);
                                         }
                                     }}
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

    const ChildEditorWrapper: React.FC<{ editor: ReactNode }> = ({ editor }) => {
        return <>{editor}</>;
    };

    function handleSort(event: DataTableStateEvent) {
        if (!event.sortField) {
            return;
        }

        const currentSortFieldName = event.sortField
        const sortColumn = listColumns.find(column => {
            let columnName = ""
            if(column.getter) {
                columnName = column.header.replace(" ", "")
            } else if (column.field) {
                columnName = column.field
            }
            return columnName == currentSortFieldName
        })
        if(!sortColumn) {
            return;
        }

        let currentSortOrder = sortOrder
        if(sortColumnName == currentSortFieldName) {
            currentSortOrder = (currentSortOrder == 1) ? -1 : 1
            setSortOrder(currentSortOrder)
        } else if (event.sortField) {
            currentSortOrder = 1
            setSortColumnName(currentSortFieldName)
            setSortOrder(currentSortOrder)
        }

        // Ensure that event.data is defined and is an array.
        if (!items || items.length === 0) {
            return;
        }

        if(sortColumn.getter) {
            // Create a new array copy from event.data.
            const sortedData = [...items].sort((a:T, b:T) => {
                const aValue = sortColumn.getter?.(a)
                const bValue = sortColumn.getter?.(b)

                let result = 0
                if(aValue < bValue) {
                    result = -1
                } else if (aValue > bValue) {
                    result = 1
                }
                result = ((currentSortOrder == 1) ? -1 : 1) * result
                return result
            })

            setItems(sortedData)
        } else if (sortColumn.field) {
            // Create a new array copy from event.data.
            const sortedData = [...items].sort((a:T, b:T) => {
                const sortFieldName = sortColumn.field
                const aIndexedType = a as Record<string, any>
                const bIndexedType = b as Record<string, any>

                let result = 0
                if(sortFieldName && aIndexedType && bIndexedType) {
                    const aValue = aIndexedType[sortFieldName]
                    const bValue = bIndexedType[sortFieldName]

                    if (aValue < bValue) {
                        result = -1
                    } else if (aValue > bValue) {
                        result = 1
                    }
                    result = ((currentSortOrder == 1) ? -1 : 1) * result
                }
                return result
            })

            console.log("Sorted", sortedData)
            setItems(sortedData)
        }
    }

    // Output a loading spinner as long as we're loading data
    if (loading) return <ProgressSpinner/>;

    // Otherwise render normally
    return (
        <>
            <Toast ref={toast}/>

            <ConfirmDialog/>

            {!editItem && !childEditor ? (
                /* List view */
                <>
                    <Toolbar className="mb-4" start={listToolbarTemplate} end={listToolbarMessagesTemplate}/>
                    <DataTable value={items}
                               sortMode="single" sortField={sortColumnName} sortOrder={sortOrder} onSort={handleSort}
                               showGridlines stripedRows
                               tableStyle={{minWidth: '50rem'}}>
                        {listColumns.map((column, index) => {
                            if (column.field) {
                                if(column.fieldType) {
                                    if(column.fieldType == "HTML") {
                                        return <Column key={"column" + index}
                                                       header={column.header}
                                                       field={column.field}
                                                       body={(data) =>
                                                            <div dangerouslySetInnerHTML={{ __html: renderListColumn(data, column) }}/>
                                                       }
                                                       sortable={column.sortable}/>
                                    } else {
                                        return <Column key={"column" + index}
                                                       header={column.header}
                                                       field={column.field}
                                                       body={(data) => renderListColumn(data, column)}
                                                       sortable={column.sortable}/>
                                    }
                                } else {
                                    return <Column key={"column" + index}
                                                   header={column.header}
                                                   field={column.field}
                                                   sortable={column.sortable}/>
                                }
                            } else if (column.getter) {
                                return <Column key={"column" + index}
                                               header={column.header}
                                               body={(data) => renderListColumn(data, column)}
                                               sortable={column.sortable}
                                               sortField={column.header.replace(" ", "")}/>
                            }
                        })}
                        <Column body={listItemActionsTemplate}/>
                    </DataTable>
                </>
            ) : editItem ? (
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
            ) : (
                <ChildEditorWrapper editor={childEditor} />
            )}
        </>
    )
}