import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {FrontendModule, type User} from "../generated/plc4j-tools-ui-frontend.ts"
import {useDispatch} from "react-redux"
import {createContext} from "react";
import {ApplicationModule} from "../utils/ApplicationModule.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MainLayout related
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type UpdateMainLayoutTitleAction = {
    title: string
}

export type MainLayoutState = {
    title: string
}

export const mainLayoutInitialState:MainLayoutState = {
    title: "",
}

const mainLayoutSlice = createSlice({
    name: "mainLayout",
    initialState: mainLayoutInitialState,
    reducers: {
        updateMainLayoutTitle: (state, action: PayloadAction<UpdateMainLayoutTitleAction>) => {
            state.title = action.payload.title
        }
    }
})

export const {updateMainLayoutTitle} = mainLayoutSlice.actions

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Module list related
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type SetModulesAction = {
    modules: ApplicationModule[];
}

export type ModulesState = {
    modules?: ApplicationModule[];
}

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

export type SetAuthenticationTokenAction = {
    authToken: string;
}

export type SetAuthenticationUserAction = {
    user: User;
}

export type AuthenticationState = {
    authToken?: string
    user?: User
}

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
        mainLayout: mainLayoutSlice.reducer,
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
