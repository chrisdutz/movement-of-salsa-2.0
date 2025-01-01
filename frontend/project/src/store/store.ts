import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {FrontendModule} from "../generated/plc4j-tools-ui-frontend.ts"
import {useDispatch} from "react-redux"
import {createContext} from "react";
import {
    AuthenticationState,
    ModulesState,
    SetAuthenticationTokenAction,
    SetAuthenticationUserAction,
    SetModulesAction
} from "./types.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Module list related
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type UpdateModuleListAction = {
    moduleList: FrontendModule[]
}

export type ModuleListState = {
    moduleList: FrontendModule[]
}

export const moduleListInitialState: ModuleListState = {
    moduleList: []
}

const moduleListSlice = createSlice({
    name: "moduleList",
    initialState: moduleListInitialState,
    reducers: {
        updateModuleList: (state, action: PayloadAction<UpdateModuleListAction>) => {
            state.moduleList = action.payload.moduleList
        }
    }
})

export const {updateModuleList} = moduleListSlice.actions

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Authentication related
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const authenticationInitialState: AuthenticationState = {
}

const authenticationSlice = createSlice({
    name: "authentication",
    initialState: authenticationInitialState,
    reducers: {
        setAuthenticationToken: (state, action: PayloadAction<SetAuthenticationTokenAction>) => {
            state.authToken = action.payload.authToken
        },
        setAuthenticationUser: (state, action: PayloadAction<SetAuthenticationUserAction>) => {
            state.user = action.payload.user
        },
        logout: (state: AuthenticationState) => {
            state.authToken = undefined
            state.user = undefined
        }
    }
})

export const {setAuthenticationToken, setAuthenticationUser, logout} = authenticationSlice.actions

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Authentication related
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const modulesInitialState: ModulesState = {
}

const modulesSlice = createSlice({
    name: "modules",
    initialState: modulesInitialState,
    reducers: {
        setModules: (state, action: PayloadAction<SetModulesAction>) => {
            state.modules = action.payload.modules
        }
    }
})

export const {setModules} = modulesSlice.actions

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Store related
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const store = configureStore({
    reducer: {
        moduleList: moduleListSlice.reducer,
        authentication: authenticationSlice.reducer,
    }
})
export default store

export const StoreContext = createContext(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {connections: ConnectionsState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
