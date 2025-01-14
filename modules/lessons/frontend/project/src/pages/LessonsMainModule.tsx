import {Card} from "primereact/card";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import axios from "axios";
import {BaseStore} from "mainApp/Types";
import {CourseType, RestApplicationClient} from "../generated/tools-ui-frontend.ts";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Image} from "primereact/image";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

export default function NewsMainModule() {
    const authToken = useSelector((baseState: BaseStore) => {
        return baseState.authentication.authToken
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
                            <div><Image src={value.image.imageData}/></div>
                            <div dangerouslySetInnerHTML={{__html: value.description}}/>
                        </div>
                    </Card>
                )})}
        </div>
    )
}