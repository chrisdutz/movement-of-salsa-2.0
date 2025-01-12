import TermsAndConditions from "./main/TermsAndConditions.tsx"
import React, {Suspense} from "react"
import axios from "axios"
import {
    __federation_method_getRemote,
    __federation_method_setRemote,
    // @ts-ignore
} from "__federation__"
import Login from "./Login.tsx"
import Logout from "./Logout.tsx"
import Users from "./admin/Users.tsx";
import Roles from "./admin/Roles.tsx";
import Permissions from "./admin/Permissions.tsx";
import Profile from "./user/Profile.tsx";

const componentMap: { [key: string]: React.FC } = {
    Login: Login,
    Logout: Logout,
    Permissions: Permissions,
    Roles: Roles,
    Users: Users,
    Profile: Profile,
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
