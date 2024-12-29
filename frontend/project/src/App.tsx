import './App.css'
import axios from 'axios';
import {createBrowserRouter, Navigate, RouteObject, RouterProvider} from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import {useSelector} from "react-redux";
import {loadExternalComponent, loadInternalComponent} from "./pages/ComponentLoader.tsx";
import store, {logout, RootState} from "./store/store.ts";
import Login from "./pages/Login.tsx";
import Logout from "./pages/Logout.tsx";
import useWebSocket from "react-use-websocket";
import {LogoutEvent} from "./generated/plc4j-tools-ui-frontend.ts";
import {Toast} from "primereact/toast";
import React, {useRef} from "react";
import {useServerEvents} from "./utils/ServerEvents.tsx";

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

    // Create a websocket connection to the server, which allows server push messages.
    useWebSocket('ws://localhost:8080/ws', {
        queryParams: {
            "token": token.toString()
        },
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        onMessage: event => {
            const deviceEvent = JSON.parse(event.data);
            // If we got a logout event from the server, logout
            if(deviceEvent as LogoutEvent) {
                const logoutEvent = deviceEvent as LogoutEvent;
                if(logoutEvent.actionName == "logout") {
                    // Logout
                    store.dispatch(logout())
                    toast.current?.show({ severity: 'warn', summary: 'Successful', detail: 'Logged Out', life: 3000 })
                }
            }
            console.log("Websocket event: ", event)
            useServerEvents.emitter.emit("new-server-event", deviceEvent)
            /*
                    if(deviceEvent != null) {
                        switch (deviceEvent.eventType) {
                            case "CREATED": {
                                const action:DeviceAction = {device: deviceEvent.source}
                                store.dispatch(addDevice(action));
                                break;
                            }
                            case "UPDATED": {
                                const action:DeviceAction = {device: deviceEvent.source}
                                store.dispatch(updateDevice(action));
                                break;
                            }
                            case "DELETED": {
                                const action: DeviceAction = {device: deviceEvent.source}
                                store.dispatch(deleteDevice(action));
                                break;
                            }
                        }
                    }*/
        }
    }, token.length > 0)
    return (
        <>
            <Toast ref={toast} />
            <RouterProvider router={router}/>
        </>
    )
}

export default App
