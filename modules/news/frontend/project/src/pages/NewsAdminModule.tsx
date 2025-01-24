import AdminList from "mainApp/components/AdminList";
import {NewsEntry, RestApplicationClient, RestResponse} from "../generated/tools-ui-frontend.ts";
import axios, {AxiosRequestConfig} from "axios";
import {useSelector} from "react-redux";
import {RootState} from "mainApp/Store";
import {useEffect} from "react";

const restClient = new RestApplicationClient(axios);

// Make sure date-strings are correctly parsed as Date objects.
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
axios.interceptors.response.use((response) => {
    function transformDates(obj: any): any {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (typeof obj[key] === 'string' && isoDateRegex.test(obj[key])) {
                    obj[key] = new Date(obj[key]);
                } else if (typeof obj[key] === 'object') {
                    transformDates(obj[key]);
                }
            }
        }
        return obj;
    }

    response.data = transformDates(response.data);
    return response;
});

function dateFormat(date: Date): string {
    if (!date) {
        return "";
    }
    // NOTE: we need the interceptor above for Date types to be handled correctly.
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
}

export default function NewsAdminModule() {
    const authToken = useSelector((state: RootState) => {
        return state.authentication.authToken
    })

    useEffect(() => {
        // Make all axios requests use the bearer token from now on.
        axios.defaults.headers.common['Authorization'] = "Bearer " + authToken
    }, [authToken]);

    return AdminList<NewsEntry>({
        emptyItem: {
            id: 0,
            listPosition: 100,
            newsStartDate: new Date(),
            newsEndDate: new Date(),
            title: "",
            description: "",
            image: {
                width: 0, height: 0, imageData: ""
            }
        },
        listColumns: [
            {sortable: true, header: "Pos", field: "listPosition"},
            {
                sortable: true, header: "Start", getter: (item: NewsEntry) => {
                    return dateFormat(item.newsStartDate);
                }
            },
            {
                sortable: true, header: "End", getter: (item: NewsEntry) => {
                    return dateFormat(item.newsEndDate);
                }
            },
            {sortable: true, header: "Title", field: "title"}
        ],
        listSortColumn: "listPosition",
        editorColumns: [
            {label: "Position", required: true, editable: true, fieldType: "Number", field: "listPosition"},
            {label: "Start Date", required: true, editable: true, fieldType: "Date", field: "newsStartDate"},
            {label: "End Date", required: true, editable: true, fieldType: "Date", field: "newsEndDate"},
            {label: "Title", required: true, editable: true, fieldType: "Text", field: "title"},
            {label: "Description", required: true, editable: true, fieldType: "Editor", field: "description"},
            {label: "Image", required: true, editable: true, fieldType: "Image", field: "image"}
        ],
        controller: {
            findAll(options?: AxiosRequestConfig | undefined): RestResponse<NewsEntry[]> {
                return restClient.findAll(options);
            },
            save(entry: NewsEntry, options?: AxiosRequestConfig | undefined): RestResponse<NewsEntry> {
                return restClient.save(entry, options);
            },
            delete: function (entry: NewsEntry, options?: AxiosRequestConfig): RestResponse<void> {
                return restClient.deleteById(entry.id.toString(), options)
            }
        },
    })
}
