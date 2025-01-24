import logo from "../assets/logo.png";
import {Image} from "primereact/image";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import store, {RootState, updateMainLayoutTitle} from "../store/store.ts";
import {Menubar} from "primereact/menubar";
import {MenuItem} from "primereact/menuitem";
import {FrontendModule} from "../generated/plc4j-tools-ui-frontend.ts";
import {NavigateFunction} from "react-router";
import {useEffect, useState} from "react";
import {Card} from "primereact/card";
import {UpdateMainLayoutTitleAction} from "../store/store.ts";

const mapFrontendModuleToMenuItem = (module: FrontendModule, title: string, navigate: NavigateFunction): MenuItem => ({
    label: module.name,
    icon: "fa-solid " + module.icon,
    command() {
        navigate(module.routerUrl);
        const action: UpdateMainLayoutTitleAction = {title: title}
        store.dispatch(updateMainLayoutTitle(action))
    }
});

const groupModulesByType = (modules: FrontendModule[], navigate: NavigateFunction): MenuItem[] => {
    const menuItems: MenuItem[] = [];
    const userMenuItems: MenuItem[] = [];
    const adminMenuItems: MenuItem[] = [];

    // Sort the modules by type (Main, User, Admin)
    modules.forEach((module) => {
        switch (module.type) {
            case "Main": {
                const menuItem = mapFrontendModuleToMenuItem(module, module.name, navigate);
                menuItems.push(menuItem)
                break;
            }
            case "User": {
                const menuItem = mapFrontendModuleToMenuItem(module, "User: " + module.name, navigate);
                userMenuItems.push(menuItem)
                break;
            }
            case "Admin": {
                const menuItem = mapFrontendModuleToMenuItem(module, "Admin: " + module.name, navigate);
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

    const [menuItems, setMenuItems] = useState<MenuItem[]>()

    const moduleList = useSelector((state: RootState) =>
        state.moduleList.moduleList
    );

    const pageTitle = useSelector((state: RootState) =>
        state.mainLayout.title
    );

    // Double check, if the currently selected route is currently available to the user.
    // If this is not the case, redirect to the first main module in the list.
    useEffect(() => {
        // Doesn't yet make sense to do anything.
        if(moduleList.length == 0) {
            return
        }

        // Update the menu settings
        setMenuItems(groupModulesByType(moduleList, navigate))

        const builtInModules = ["/terms", "/contact", "/imprint", "/privacy"]
        const isValidRoute = builtInModules.includes(location.pathname) ||
            (moduleList.length > 0 ? moduleList.map(module => module.routerUrl).includes(location.pathname) : false);
        // If no currently available route is selected,
        // select the first main module as a default.
        if(!isValidRoute) {
            const mainModules = moduleList.filter(module => module.type === "Main")
            let fallbackRoute = "/";
            let fallbackTitle = ""
            if(mainModules.length > 0) {
                fallbackRoute = mainModules[0].routerUrl
                fallbackTitle = mainModules[0].name
            }
            const action: UpdateMainLayoutTitleAction = {title: fallbackTitle}
            store.dispatch(updateMainLayoutTitle(action))
            navigate(fallbackRoute, {replace: true})
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
                        <h1 className="m-0 text-left">{pageTitle}</h1>
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
                                <Link to="/terms" className="text-decoration-none" onClick={() => {
                                    const action: UpdateMainLayoutTitleAction = {title: "AGB"}
                                    store.dispatch(updateMainLayoutTitle(action))
                                }}>AGB</Link>
                            </li>
                            <li className="flex">
                                <Link to="/contact" className="text-decoration-none" onClick={() => {
                                    const action: UpdateMainLayoutTitleAction = {title: "Kontakt"}
                                    store.dispatch(updateMainLayoutTitle(action))
                                }}>Kontakt</Link>
                            </li>
                            <li className="flex">
                                <Link to="/imprint" className="text-decoration-none" onClick={() => {
                                    const action: UpdateMainLayoutTitleAction = {title: "Impressum"}
                                    store.dispatch(updateMainLayoutTitle(action))
                                }}>Impressum</Link>
                            </li>
                            <li className="flex">
                                <Link to="/privacy" className="text-decoration-none" onClick={() => {
                                    const action: UpdateMainLayoutTitleAction = {title: "Datenschutz"}
                                    store.dispatch(updateMainLayoutTitle(action))
                                }}>Datenshutz</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    )
}