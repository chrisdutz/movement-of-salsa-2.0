import {Card} from "primereact/card";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import axios from "axios";
import {RootState} from "mainApp/Store";
import {CourseType, RestApplicationClient} from "../generated/tools-ui-frontend.ts";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Image} from "primereact/image";
import {Chip} from "primereact/chip";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

export default function NewsMainModule() {
    const authToken = useSelector((state: RootState)=> {
        return state.authentication.authToken
    })
    const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);

    useEffect(() => {
        // Make all axios requests use the bearer token from now on.
        axios.defaults.headers.common['Authorization'] = "Bearer " + authToken
        restClient.findAllNotHidden().then(courseTypesResponse => {
            setCourseTypes(courseTypesResponse.data)
        })
    }, [authToken]);

    return (
        <div className="flex flex-column gap-4">
            {courseTypes && courseTypes.map(value => {
                return (<Card title={value.title}>
                        <div className="flex flex-column md:flex-row gap-4 w-full">
                            <div><Image width="240" height="240" src={value.image.imageData}/></div>
                            <div className="flex flex-column gap-2">
                                <div dangerouslySetInnerHTML={{__html: value.description}}/>
                                <h4 className="mt-1 mb-1">Tarife:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {value.rates.map(rate => {
                                        return <Chip label={rate.title + " " + rate.price + "€"}/>
                                    })}
                                </div>
                            </div>
                        </div>
                    </Card>
                )})}
        </div>
    )
}