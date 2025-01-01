import {NewsEntry, RestApplicationClient} from "../generated/tools-ui-frontend.ts";
import {useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import {BaseStore} from "mainApp/Types";
import {Card} from "primereact/card";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

export default function NewsMainModule() {
    const authToken = useSelector((baseState: BaseStore) => {
        return baseState.authentication.authToken
    })
    const [initialized, setInitialized] = useState(false)
    const [news, setNews] = useState<NewsEntry[]>([]);

    // Load the initial list of drivers and connections and initialize the store with that.
    if (!initialized) {
        // Make all axios requests use the bearer token from now on.
        axios.defaults.headers.common['Authorization'] = "Bearer " + authToken
        setInitialized(true);
        restClient.findAll().then(newsResponse => {
            setNews(newsResponse.data)
        })
    }

    return (
        <div className="flex flex-column gap-4">
            {news && news.map(value => {
                return (<Card title={value.title}><div dangerouslySetInnerHTML={{__html: value.description}}/></Card>)})}
        </div>
    )
}
