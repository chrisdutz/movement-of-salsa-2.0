import './App.css'
import axios from 'axios';
import {createBrowserRouter, Navigate, RouteObject, RouterProvider} from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import {useSelector} from "react-redux";
import {loadExternalComponent, loadInternalComponent} from "./pages/ComponentLoader.tsx";
import {RootState} from "./store/store.ts";
import Login from "./pages/Login.tsx";
import Logout from "./pages/Logout.tsx";
import {Toast} from "primereact/toast";
import React, {useRef} from "react";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

axios.defaults.baseURL = 'http://localhost:8080';

// Make sure date-strings are correctly parsed as Date objects.
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

function App() {
    const toast = useRef<Toast>(null)

    // Create a new browserRouter object based on the modules available to the current user.
    const router = useSelector((state: RootState) => {
        // Prepare the routes for all main modules
        let moduleRoutes = state.moduleList.moduleList
            .map(module => ({
                    path: module.routerUrl,
                    // Modules with empty moduleUrl are embedded modules, that are loaded via lookup in a static map.
                    // Others need to be dynamically loaded.
                    element: module.moduleUrl == "" ? loadInternalComponent(module.moduleComponentName) : loadExternalComponent(module.moduleUrl, module.moduleComponentName)
                } as RouteObject)
            )

        // Build the main routes
        const routerDefinition = [
            {
                path: '/',
                element: <MainLayout/>,
                // Add a default route, that simply redirects to the main page.
                children: [...moduleRoutes,
                    {
                        path: "/login",
                        element: <Login/>
                    },
                    {
                        path: "/logout",
                        element: <Logout/>
                    },
                    {
                        path: "*",
                        element: <Navigate to="/"/>
                    }]
            }]
        return createBrowserRouter(routerDefinition)
    })

    // Make the access token available as we're using that to decide if the websocket connection should be
    // established as well as being used to authenticate at the server.
    const token = useSelector((state: RootState) => {
        if(state.authentication?.authToken) {
            return state.authentication.authToken
        }
        return ""
    })

    return (
        <>
            <Toast ref={toast} />
            <RouterProvider router={router}/>
        </>
    )
}

export default App
