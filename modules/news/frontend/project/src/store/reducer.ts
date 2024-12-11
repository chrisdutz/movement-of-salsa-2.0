import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {NewsEntry} from "../generated/tools-ui-frontend.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// News related
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type InitializeNewsAction = {
    newsList: NewsEntry[]
}

export type NewsAction = {
    newsEntry: NewsEntry
}

export interface NewsState {
    newsList: NewsEntry[]
}

const newsInitialState: NewsState = {
    newsList: [] as NewsEntry[],
}

const newsSlice = createSlice({
    name: 'news',
    initialState: newsInitialState,
    reducers: {
        initializeLists: (state, action: PayloadAction<InitializeNewsAction>) => {
            state.newsList = action.payload.newsList
        },
        addNewsEntry: (state, action: PayloadAction<NewsAction>) => {
            console.log("ADD " + JSON.stringify(action))
            state.newsList = [...state.newsList, action.payload.newsEntry]
        },
        updateNewsEntry: (state, action: PayloadAction<NewsAction>) => {
            console.log("UPDATE " + JSON.stringify(action))
            const newsEntry = state.newsList.find(value => value.id == action.payload.newsEntry.id);
            if (newsEntry) {
                const index = state.newsList.indexOf(newsEntry);
                if (index) {
                    state.newsList.splice(index, 1, action.payload.newsEntry);
                }
            }
        },
        deleteNewsEntry: (state, action: PayloadAction<NewsAction>) => {
            console.log("DELETE " + JSON.stringify(action))
            const newsEntry = state.newsList.find(value => value.id == action.payload.newsEntry.id);
            if (newsEntry) {
                const index = state.newsList.indexOf(newsEntry);
                if (index) {
                    state.newsList.splice(index, 1);
                }
            }
        }
    }
})

export const {initializeLists, addNewsEntry, updateNewsEntry, deleteNewsEntry} = newsSlice.actions

export {newsSlice}

export default newsSlice
