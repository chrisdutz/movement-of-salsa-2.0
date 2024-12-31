import logo from "../assets/logo.png";
import {Image} from "primereact/image";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store/store.ts";
import {Menubar} from "primereact/menubar";
import {MenuItem} from "primereact/menuitem";
import {FrontendModule} from "../generated/plc4j-tools-ui-frontend.ts";
import {NavigateFunction} from "react-router";
import {Dispatch, SetStateAction, useState} from "react";
import {Card} from "primereact/card";

const mapFrontendModuleToMenuItem = (module: FrontendModule, title: string, navigate: NavigateFunction, titleSetter: Dispatch<SetStateAction<string>>): MenuItem => ({
    label: module.name,
    icon: "fa-solid " + module.icon,
    command() {
        navigate(module.routerUrl);
        titleSetter(title);
    }
});

const groupModulesByType = (modules: FrontendModule[], navigate: NavigateFunction, titleSetter: Dispatch<SetStateAction<string>>): MenuItem[] => {
    const menuItems: MenuItem[] = [];
    const userMenuItems: MenuItem[] = [];
    const adminMenuItems: MenuItem[] = [];

    // Sort the modules by type (Main, User, Admin)
    modules.forEach((module) => {
        switch (module.type) {
            case "Main": {
                const menuItem = mapFrontendModuleToMenuItem(module, module.name, navigate, titleSetter);
                menuItems.push(menuItem)
                break;
            }
            case "User": {
                const menuItem = mapFrontendModuleToMenuItem(module, "User: " + module.name, navigate, titleSetter);
                userMenuItems.push(menuItem)
                break;
            }
            case "Admin": {
                const menuItem = mapFrontendModuleToMenuItem(module, "Admin: " + module.name, navigate, titleSetter);
                adminMenuItems.push(menuItem)
                break;
            }
        }
    });

    // If there's at least one user menu, add a menu entry for "user" modules
    if(userMenuItems.length > 0) {
        menuItems.push({
            label: "User",
            items: userMenuItems
        })
    }

    // If there's at least one admin menu, add a menu entry for "admin" modules
    if(adminMenuItems.length > 0) {
        menuItems.push({
            label: "Admin",
            items: adminMenuItems
        })
    }

    return menuItems;
}

export default function MainLayout() {
    const navigate = useNavigate();
    const [selectedModuleTitle, setSelectedModuleTitle] = useState<string>('Selected Module');
    const moduleList:MenuItem[] = useSelector<RootState, MenuItem[]>((state: RootState) => {
        return groupModulesByType(state.moduleList.moduleList, navigate, setSelectedModuleTitle)
    })
    return (
        <div className="flex flex-column">
            {/* Header Section */}
            <div className="flex flex-wrap align-items-stretch p-3 flex-column md:flex-row">
                {/* Logo */}
                <div style={{height: '200px', width: '200px'}} className="flex-shrink-0">
                    <Image src={logo} width="100%"/>
                </div>

                {/* Title and Menu Section */}
                <div className="flex flex-column flex-grow-1 justify-content-between ml-0 md:ml-3 mt-3">
                    {/* Title */}
                    <div>
                        <h1 className="m-0 text-left">{selectedModuleTitle}</h1>
                    </div>

                    {/* Navigation Menu */}
                    <div className="align-self-stretch mt-3">
                        <Menubar model={moduleList}/>
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <div className="p-3">
                <Outlet/>
            </div>

            <Card className="m-3">
                <div className="flex flex-column md:flex-row gap-4">
                    <div className="flex flex-column">
                        <p className="m-0"><b>MOVEMENT OF SALSA</b></p>
                        <p className="m-0">Telefon: +49 163 7353172</p>
                        <p className="m-0">E-Mail: <a href="mailto:olli@movement-of-salsa.de">olli@movement-of-salsa.de</a></p>
                    </div>
                    <div className="flex md:flex-row ml-auto">
                        <ul className="list-none flex md:flex-row flex-column gap-4 m-0 p-0">
                            <li className="flex">
                                <Link to="/terms" className="text-decoration-none">Terms and Conditions</Link>
                            </li>
                            <li className="flex">
                                <Link to="/contact" className="text-decoration-none">Contact</Link>
                            </li>
                            <li className="flex">
                                <Link to="/imprint" className="text-decoration-none">Imprint</Link>
                            </li>
                            <li className="flex">
                                <Link to="/privacy" className="text-decoration-none">Privacy</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    )
}