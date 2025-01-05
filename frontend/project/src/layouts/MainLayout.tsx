import logo from "../assets/logo.png";
import {Image} from "primereact/image";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store/store.ts";
import {Menubar} from "primereact/menubar";
import {MenuItem} from "primereact/menuitem";
import {FrontendModule} from "../generated/plc4j-tools-ui-frontend.ts";
import {NavigateFunction} from "react-router";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
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
        // Little hack to position the logout link after all others.
        if(menuItems[menuItems.length - 1].label === "Logout") {
            const insertIndex = menuItems.length - 1; // Index before the last item
            menuItems.splice(insertIndex, 0, {
                label: "User",
                items: userMenuItems
            });
        } else {
            menuItems.push({
                label: "User",
                items: userMenuItems
            })
        }
    }

    // If there's at least one admin menu, add a menu entry for "admin" modules
    if(adminMenuItems.length > 0) {
        // Little hack to position the logout link after all others.
        if(menuItems[menuItems.length - 1].label === "Logout") {
            const insertIndex = menuItems.length - 1; // Index before the last item
            menuItems.splice(insertIndex, 0, {
                label: "Admin",
                items: adminMenuItems
            });
        } else {
            menuItems.push({
                label: "Admin",
                items: adminMenuItems
            })
        }
    }

    return menuItems;
}

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedModuleTitle, setSelectedModuleTitle] = useState<string>('Selected Module');

    // Check if the currently selected route is available, if not
    // navigate to the first module in the list.
    const moduleList = useSelector((state: RootState) =>
        state.moduleList.moduleList
    );
    const menuItems:MenuItem[] = useSelector<RootState, MenuItem[]>((state: RootState) => {
        return groupModulesByType(state.moduleList.moduleList, navigate, setSelectedModuleTitle)
    })

    // Double check, if the currently selected route is currently available to the user.
    // If this is not the case, redirect to the first main module in the list.
    useEffect(() => {
        const isValidRoute = moduleList.map(module => module.routerUrl).includes(location.pathname);
       if(!isValidRoute) {
           const mainModules = moduleList.filter(module => module.type === "Main")
           let fallbackRoute = "/";
           let fallbackTitle = ""
           if(mainModules.length > 0) {
               fallbackRoute = mainModules[0].routerUrl
               fallbackTitle = mainModules[0].name
           }
           navigate(fallbackRoute, {replace: true});
           setSelectedModuleTitle(fallbackTitle)
        }
    }, [location.pathname, moduleList, navigate]);

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
                        <Menubar model={menuItems}/>
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
                                <Link to="/terms" onClick={() => setSelectedModuleTitle("AGB")} className="text-decoration-none">AGB</Link>
                            </li>
                            <li className="flex">
                                <Link to="/contact" onClick={() => setSelectedModuleTitle("Kontakt")} className="text-decoration-none">Kontakt</Link>
                            </li>
                            <li className="flex">
                                <Link to="/imprint" onClick={() => setSelectedModuleTitle("Impressum")} className="text-decoration-none">Impressum</Link>
                            </li>
                            <li className="flex">
                                <Link to="/privacy" onClick={() => setSelectedModuleTitle("Datenschutz")} className="text-decoration-none">Datenshutz</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    )
}