import {ScrollPanel} from "primereact/scrollpanel";
import {DataView} from "primereact/dataview";
import {NewsEntry, RestApplicationClient} from "../generated/tools-ui-frontend.ts";
import {useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import {BaseStore} from "mainApp/Types";

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

    const itemTemplate = (newsEntry: NewsEntry) => {
        return (
            <div className="col-12" key={newsEntry.id}>
                <div className="text-2xl font-bold text-900">{newsEntry.title}</div>
                <span className="text-2xl font-semibold">{newsEntry.description}</span>
            </div>
        );
    };

    const listTemplate = (items: NewsEntry[]) => {
        if (!items || items.length === 0) return null;

        let list = items.map((item) => {
            return itemTemplate(item);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    return (
        <ScrollPanel style={{width: '100%', height: '100%'}} className="h-full">
            <DataView value={news} listTemplate={listTemplate}/>
        </ScrollPanel>
    )
}
