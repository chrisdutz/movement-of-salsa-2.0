import {NewsEntry, RestApplicationClient} from "../generated/tools-ui-frontend.ts";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import {BaseStore} from "mainApp/Types";
import {Card} from "primereact/card";
import {Image} from "primereact/image";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

export default function NewsMainModule() {
    const authToken = useSelector((baseState: BaseStore) => {
        return baseState.authentication.authToken
    })
    const [news, setNews] = useState<NewsEntry[]>([]);

    useEffect(() => {
        // Make all axios requests use the bearer token from now on.
        axios.defaults.headers.common['Authorization'] = "Bearer " + authToken
        restClient.findAll().then(newsResponse => {
            setNews(newsResponse.data)
        })
    }, [authToken]);

    return (
        <div className="flex flex-column gap-4">
            {news && news.map(value => {
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
