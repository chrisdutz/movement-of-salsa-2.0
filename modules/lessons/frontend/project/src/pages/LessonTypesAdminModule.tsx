import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import AdminList from "mainApp/components/AdminList";
import {CourseType, CourseTypeRate, RestApplicationClient, RestResponse} from "../generated/tools-ui-frontend.ts";
import axios, {AxiosRequestConfig} from "axios";
import {DataTable} from "primereact/datatable";
import {Column, ColumnEditorOptions} from "primereact/column";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {InputNumber, InputNumberChangeEvent} from "primereact/inputnumber";
import {Checkbox, CheckboxChangeEvent} from "primereact/checkbox";
import React from "react";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

export default function LessonTypesAdminModule() {
    return AdminList<CourseType>({
        emptyItem: {
            id: 0, code: "", description: "", image: {
                height: 0, width: 0, imageData: ""
            }, listOrder: 0, rates: [], title: ""
        },
        listColumns: [
            {sortable: true, header: "Pos", field: "listOrder"},
            {sortable: true, header: "Code", field: "code"},
            {sortable: true, header: "Title", field: "title"}
        ],
        listSortColumn: "listPosition",
        editorColumns: [
            {label: "Position", required: true, editable: true, fieldType: "Number", field: "listOrder"},
            {label: "Code", required: true, editable: true, fieldType: "Text", field: "code"},
            {label: "Title", required: true, editable: true, fieldType: "Text", field: "title"},
            {label: "Description", required: true, editable: true, fieldType: "Editor", field: "description"},
            {label: "Image", required: true, editable: true, fieldType: "Image", field: "image"},
            {
                label: "Rates", required: false, editable: true, fieldType: "Custom", field: "rates", fieldEditor:
                    (value, setValue) => {
                        // Handler for adding a new rate
                        function addRate() {
                            console.log("Before adding", value)
                            const updatedRates = [...value.rates, {
                                id: 0, listOrder: 0, title: "", price: 0, coupleRate: false
                            }]
                            const updatedCourseType = {
                                ...value,
                                rates: updatedRates
                            }
                            setValue(updatedCourseType)
                            console.log("After adding", updatedCourseType)
                        }

                        // Template for the buttons for deleting a given rate
                        const listItemActionsTemplate = (item: CourseTypeRate) => {
                            return (
                                <React.Fragment>
                                    <Button icon="pi pi-trash" rounded outlined className="mr-2"
                                            onClick={() => {
                                                const index = value.rates.indexOf(item, 0);
                                                if (index > -1) {
                                                    console.log("value.rates before", value.rates)
                                                    value.rates.splice(index, 1);
                                                    const updatedCourseType = {
                                                        ...value,
                                                        rates: value.rates
                                                    }
                                                    setValue(updatedCourseType)
                                                    console.log("value.rates after", value.rates.length)
                                                }
                                            }}/>
                                </React.Fragment>
                            )
                        }

                        function listOrderEditor(options: ColumnEditorOptions) {
                            return <InputNumber value={options.value} maxFractionDigits={0}
                                                onChange={(e: InputNumberChangeEvent) => {
                                                    const updatedRates = [...value.rates];
                                                    if (e.value) {
                                                        updatedRates[options.rowIndex].listOrder = e.value;
                                                    }
                                                    const updatedCourseType = {
                                                        ...value,
                                                        rates: updatedRates
                                                    }
                                                    setValue(updatedCourseType)
                                                    console.log("value.rates after", updatedCourseType)
                                                }}/>;
                        }

                        function titleEditor(options: ColumnEditorOptions) {
                            return <InputText type="text" value={options.value}
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                  const updatedRates = [...value.rates];
                                                  console.log("Title", e.target.value, e)
                                                  if (e.target.value) {
                                                      updatedRates[options.rowIndex].title = e.target.value;
                                                  }
                                                  const updatedCourseType = {
                                                      ...value,
                                                      rates: updatedRates
                                                  }
                                                  setValue(updatedCourseType)
                                                  console.log("value.rates after", updatedCourseType)
                                              }}/>;
                        }

                        function priceEditor(options: ColumnEditorOptions) {
                            return <InputNumber value={options.value} maxFractionDigits={2}
                                                onChange={(e: InputNumberChangeEvent) => {
                                                    const updatedRates = [...value.rates];
                                                    if (e.value) {
                                                        updatedRates[options.rowIndex].price = e.value;
                                                    }
                                                    const updatedCourseType = {
                                                        ...value,
                                                        rates: updatedRates
                                                    }
                                                    setValue(updatedCourseType)
                                                    console.log("value.rates after", updatedCourseType)
                                                }}/>;
                        }

                        function coupleRateEditor(options: ColumnEditorOptions) {
                            return <Checkbox checked={options.value} onChange={(e: CheckboxChangeEvent) => {
                                const updatedRates = [...value.rates];
                                console.log("Event", e)
                                console.log("Options", options)
                                console.log("Rates", updatedRates)
                                console.log("Row", options.rowIndex)
                                console.log("Checked", e.checked, e)
                                if (e.checked != undefined) {
                                    console.log("Before Update", updatedRates[options.rowIndex])
                                    updatedRates[options.rowIndex].coupleRate = e.checked;
                                    console.log("After Update", updatedRates[options.rowIndex])
                                }
                                const updatedCourseType = {
                                    ...value,
                                    rates: updatedRates
                                }
                                setValue(updatedCourseType)
                            }}/>;
                        }

                        return <div>
                            <Button label="Add" onClick={() => addRate()}/>
                            <DataTable value={value.rates} editMode="cell">
                                <Column key="ratePos" field="listOrder" header="Position"
                                        editor={(options) => listOrderEditor(options)}/>
                                <Column key="rateTitle" field="title" header="Title"
                                        editor={(options) => titleEditor(options)}/>
                                <Column key="ratePrice" field="price" header="Price"
                                        editor={(options) => priceEditor(options)}/>
                                <Column key="rateCoupleRate" field="coupleRate" header="Couple Rate"
                                        editor={(options) => coupleRateEditor(options)}/>
                                <Column key="rateDelete" body={listItemActionsTemplate}/>
                            </DataTable>
                        </div>
                    }
            }
        ],
        controller: {
            findAll(options?: AxiosRequestConfig | undefined): RestResponse<CourseType[]> {
                return restClient.findAll(options);
            },
            save(entry: CourseType, options?: AxiosRequestConfig | undefined): RestResponse<CourseType> {
                return restClient.save(entry, options);
            },
            delete: function (entry: CourseType, options?: AxiosRequestConfig): RestResponse<void> {
                return restClient.deleteById(entry.id.toString(), options)
            }
        },
    })
}
