import About from "./About.tsx"
import Login from "./Login.tsx"
import Settings from "./Settings.tsx"
import React, {Suspense} from "react"
import axios from "axios"
import {
    __federation_method_getRemote,
    __federation_method_setRemote,
    // @ts-ignore
} from "__federation__"
import Logout from "./Logout.tsx"
import Users from "./Users.tsx";
import Roles from "./Roles.tsx";
import Permissions from "./Permissions.tsx";

const componentMap: { [key: string]: React.FC } = {
    Login: Login,
    Logout: Logout,
    About: About,
    Permissions: Permissions,
    Roles: Roles,
    Settings: Settings,
    Users: Users,
};

export const loadInternalComponent = (moduleName: string): React.ReactNode => {
    const Component = componentMap[moduleName];
    if(!Component) {
        console.log("Error loading Component: " + moduleName);
    }
    return Component ? <Component /> : <div>Component not found</div>;
};

export const loadExternalComponent = (moduleUrl: string, moduleComponentName: string) => {
    const remoteName = 'remote'
    const fullModuleUrl = axios.defaults.baseURL + moduleUrl
    const Module = React.lazy(async () => {
        __federation_method_setRemote(remoteName, {
            url: fullModuleUrl,
            format: 'esm',
            from: 'vite',
        });
        const ret = await __federation_method_getRemote(remoteName, `./${moduleComponentName}`)
        if(ret.default === undefined) {
            return {default: ret}
        }
        return ret
    })
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Module/>
        </Suspense>
    )
}
