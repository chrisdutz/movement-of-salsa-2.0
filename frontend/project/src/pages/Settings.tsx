import {Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store/store.ts";
import {TabPanel, TabView} from "primereact/tabview";
import {loadExternalComponent, loadInternalComponent} from "./ComponentLoader.tsx";
import {FrontendModule} from "../generated/plc4j-tools-ui-frontend.ts";
import React from "react";

function loadModule(module:FrontendModule):React.ReactNode {
    console.log("Loading Admin Module: ", module)
    return module.moduleUrl == "" ? loadInternalComponent(module.moduleComponentName) : loadExternalComponent(module.moduleUrl, module.moduleComponentName)
}

export default function Settings() {
    const moduleList = useSelector((state: RootState) => {
        return state.moduleList
    })

    return (
        <>
            <TabView>
                {moduleList.moduleList
                    .filter(module => module.type === "Admin")
                    .map(module => (<TabPanel header={module.name} leftIcon={"fa-solid " + module.icon + " mr-2"}>
                            {loadModule(module)}
                        </TabPanel>)
                    )
                }
            </TabView>
            <Outlet/>
        </>
    )
}
