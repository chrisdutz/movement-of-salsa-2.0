import {TabPanel, TabView} from "primereact/tabview";
import {Splitter, SplitterPanel} from "primereact/splitter";
import {ScrollPanel} from "primereact/scrollpanel";
import {Device, Driver, RestApplicationClient} from "../generated/plc4j-tools-ui-frontend.ts";
import {useState} from "react";
import axios from "axios";
import {TreeItemData} from "../model/TreeItemData.ts";
import NavigationTree from "../components/NavigationTree.tsx";
import PlcConnection from "../components/PlcConnection.tsx";
import {BaseStore} from "mainApp/Types";
import {useSelector} from "react-redux";
import {useServerEvents} from "mainApp/ServerEvents";

axios.defaults.baseURL = 'http://localhost:8080';
const restClient = new RestApplicationClient(axios);

function getByDriverTree(driverList: Driver[], deviceList: Device[]): TreeItemData[] {
    if (driverList && deviceList) {
        // First create the root nodes for every type of driver.
        const driverMap = new Map<string, TreeItemData>()
        let drivers: TreeItemData[] = []
        driverList.forEach(value => {
            const driverEntry: TreeItemData = {
                id: value.code,
                name: value.name,
                type: "DRIVER",
                driver: value,
                supportsDiscovery: value.metadata.discoverySupported,
                supportsBrowsing: false,
                supportsReading: false,
                supportsWriting: false,
                supportsSubscribing: false,
                supportsPublishing: false,
                children: []
            }
            driverMap.set(value.code, driverEntry)
            drivers = [...drivers, driverEntry]
        })
        drivers.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

        // Then go through the list of devices and add them to the matching driver.
        deviceList.forEach(value => {
            const curDriverTreeItem = driverMap.get(value.protocolCode);
            if (curDriverTreeItem && curDriverTreeItem.children) {
                if (curDriverTreeItem.children.find(curDevice => curDevice.device?.transportUrl == value.transportUrl) == null) {
                    curDriverTreeItem.children = [...curDriverTreeItem.children, {
                        id: value.id?.toString(),
                        name: value.name,
                        type: "DEVICE",
                        device: value,
                        // Even if most connections will support reading/writing, in order to really know, we need a
                        // connection first. As we're not offering any connection-actions here anyway we just set all
                        // to false.
                        supportsDiscovery: false,
                        supportsBrowsing: false,
                        supportsReading: false,
                        supportsWriting: false,
                        supportsSubscribing: false,
                        supportsPublishing: false
                    } as TreeItemData
                    ]
                }
            }
        })

        // Create a common root element.
        return [{
            id: "all",
            name: "Root",
            type: "ROOT",
            supportsDiscovery: true,
            supportsBrowsing: false,
            supportsReading: false,
            supportsWriting: false,
            supportsSubscribing: false,
            supportsPublishing: false,
            children: drivers
        }]
    }
    return []
}

function getByDeviceTree(deviceList: Device[]): TreeItemData[] {
    if (deviceList) {
        // Group the connections by transport-url.
        // TODO: Possibly create filters for the different types of urls (IP, Hostname, Port, Mac-Address, ...)
        const deviceMap = new Map<string, Device[]>
        deviceList.forEach(device => {
            // Extract only the part of the URL that identifies a system (not the port)
            let target = device.transportUrl
            if (target.indexOf(":") != -1) {
                target = target.substring(0, target.indexOf(":"))
            }
            const devices = deviceMap.get(target)
            if (devices) {
                deviceMap.set(target, [...devices, device])
            } else {
                deviceMap.set(target, [device])
            }
        })

        // Build a tree based on the grouped locations.
    }
    return []
}

export default function Inspect() {
    const authToken = useSelector((baseState:BaseStore) => {
        return baseState.authentication.authToken
    })
    const [initialized, setInitialized] = useState(false)
    const [driverList, setDriverList] = useState<Driver[]>([])
    const [deviceList, setDeviceList] = useState<Device[]>([])
    const [openDevices, setOpenDevices] = useState<Device[]>([]);

    function handleOpenDevice(device: Device) {
        // TODO: We should ask the server to open a connection to the given device and return a session id
        //  we then pass the connection id to the tab, which then uses this id to interact with the session.
        setOpenDevices(prevState => [...prevState, device]);
        // Make the new tab the selected one.
        setActiveIndex(openDevices.length)
    }

    const [activeIndex, setActiveIndex] = useState<number>(0);

    // Load the initial list of drivers and connections and initialize the store with that.
    if (!initialized) {
        // Make all axios requests use the bearer token from now on.
        axios.defaults.headers.common['Authorization'] = "Bearer " + authToken

        setInitialized(true);
        restClient.getAllDrivers().then(driverListResponse => {
            setDriverList(driverListResponse.data)
            restClient.getAllDevices().then(deviceListResponse => {
                setDeviceList(deviceListResponse.data)
            })
        })
    }

    useServerEvents({
        onNewServerEvent(serverEvent) {
            if(serverEvent.moduleName === "inspect") {
                switch (serverEvent.actionName) {
                    case "create":
                        setDeviceList(prevDeviceList => [...prevDeviceList, serverEvent.source as Device])
                        break
                    case "update":
                        const updatedDevice = serverEvent.source as Device
                        setDeviceList(prevDeviceList => [...prevDeviceList.filter(device => device.id !== updatedDevice.id), updatedDevice])
                        break
                    case "delete":
                        const deletedDevice = serverEvent.source as Device
                        setDeviceList(prevDeviceList => prevDeviceList.filter(device => device.id !== deletedDevice.id));
                        break
                }
            }
        }
    })

    return (
        <Splitter className="h-full">
            <SplitterPanel
                size={25} minSize={1}
                className="flex align-items-center justify-content-center">
                <TabView style={{width: '100%', height: '100%'}}>
                    <TabPanel header="By Driver" className="m-0">
                        <ScrollPanel style={{width: '100%', height: '100%'}} className="h-full">
                            <NavigationTree treeItems={getByDriverTree(driverList, deviceList)}
                                            onOpenDevice={handleOpenDevice}/>
                        </ScrollPanel>
                    </TabPanel>
                    <TabPanel header="By Device">
                        <ScrollPanel style={{width: '100%', height: '100%'}}>
                            <NavigationTree treeItems={getByDeviceTree(deviceList)}/>
                        </ScrollPanel>
                    </TabPanel>
                </TabView>
            </SplitterPanel>
            <SplitterPanel size={75} className="flex align-items-center justify-content-center">
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}
                         className="h-full w-full" panelContainerClassName="h-full">
                    {openDevices.map((device, index) => (
                        <TabPanel key={index} header={device.name} closable={true}>
                            <PlcConnection device={device}/>
                        </TabPanel>
                    ))}
                </TabView>
            </SplitterPanel>
        </Splitter>
    )
}
