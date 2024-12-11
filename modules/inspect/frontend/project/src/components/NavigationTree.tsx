import {TreeItemData} from "../model/TreeItemData.ts";
import {Tree, TreeNodeDoubleClickEvent} from "primereact/tree";
import {TreeNode} from "primereact/treenode";
import {IconType} from "primereact/utils";
import 'primeicons/primeicons.css';
import {useRef, useState} from "react";
import {Device, RestApplicationClient} from "../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import {Counter} from "../utils/Counter.ts";
import DeviceDialog from "./DeviceDialog.tsx";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {ContextMenu} from "primereact/contextmenu";
import {MenuItem} from "primereact/menuitem";

type NavigationTreeProps = {
    treeItems: TreeItemData[],
    onOpenDevice?: (device:Device) => void,
}

const restClient = new RestApplicationClient(axios);

export default function NavigationTree({treeItems, onOpenDevice}: NavigationTreeProps) {
    const [dialogDevice, setDialogDevice] = useState<Device>({
        id: 0,
        name: "",
        protocolCode: "",
        transportCode: "",
        transportUrl: "",
        options: {},
        attributes: {},
    })
    const [showDeviceDialog, setShowDeviceDialog] = useState(false)

    const cm = useRef<ContextMenu>(null);
    const menu = [
        {
            key: "1",
            label: 'Discover',
            data: "discover-data",
            icon: 'fa-solid fa-radar',
            disabled: false,
        } as MenuItem,
        {
            key: "2",
            label: 'Add',
            data: "add-data",
            icon: 'fa-solid fa-file',
            disabled: false,
        } as MenuItem,
        {
            key: "3",
            label: 'Edit',
            data: "edit-data",
            icon: 'fa-solid fa-pen',
            disabled: false,
        } as MenuItem,
        {
            key: "4",
            label: 'Delete',
            data: "delete-data",
            icon: 'fa-solid fa-trash',
            disabled: false,
        } as MenuItem,
        {
            key: "5",
            label: 'Open',
            data: "open-data",
            icon: 'fa-solid fa-plug',
            disabled: false,
        } as MenuItem
    ] as MenuItem[]

    function updateMenu(selectedItem: TreeItemData) {
        // Discover
        menu[0].disabled = !selectedItem.supportsDiscovery && selectedItem.type != "ROOT"
        menu[0].command = () => {
            restClient.discover(selectedItem.id)
        }

        // Add
        menu[1].disabled = selectedItem.type != "DRIVER"
        menu[1].command = () => {
            dialogDevice.id = 0;
            dialogDevice.name = "";
            dialogDevice.transportCode = "";
            dialogDevice.transportUrl = "";
            dialogDevice.protocolCode = selectedItem.id;
            dialogDevice.options = {};
            dialogDevice.attributes = {};
            setShowDeviceDialog(true);
        }

        // Edit
        menu[2].disabled = selectedItem.type != "DEVICE"
        menu[2].command = () => {
            if (selectedItem.device) {
                dialogDevice.id = selectedItem.device.id;
                dialogDevice.name = selectedItem.device.name;
                dialogDevice.transportCode = selectedItem.device.transportCode;
                dialogDevice.transportUrl = selectedItem.device.transportUrl;
                dialogDevice.protocolCode = selectedItem.device.protocolCode;
                dialogDevice.options = selectedItem.device.options;
                dialogDevice.attributes = selectedItem.device.attributes;
                setShowDeviceDialog(true);
            }
        }
        // Delete
        menu[3].disabled = selectedItem.type != "DEVICE"
        menu[3].command = () => {
            if (selectedItem.device) {
                dialogDevice.id = selectedItem.device.id;
                dialogDevice.name = selectedItem.device.name;
                dialogDevice.transportCode = selectedItem.device.transportCode;
                dialogDevice.transportUrl = selectedItem.device.transportUrl;
                dialogDevice.protocolCode = selectedItem.device.protocolCode;
                dialogDevice.options = selectedItem.device.options;
                dialogDevice.attributes = selectedItem.device.attributes;
                confirmDelete()
            }
        }
        // Open
        menu[4].disabled = selectedItem.type != "DEVICE"
        menu[4].command = () => {
            // Open a new tab with the connection.
            if (selectedItem.device && onOpenDevice) {
                onOpenDevice(selectedItem.device);
            }
        }
    }

    function getIcon(curItem: TreeItemData): IconType<TreeNode> {
        switch (curItem.type) {
            case "DRIVER":
                return "fa-solid fa-folder-open"//"material-icons md-18 folder_open"
            case "CONNECTION":
                return "fa-solid fa-plug"//"material-icons md-18 tty"
            case "DEVICE":
                return "fa-solid fa-microchip"//"material-icons md-18 computer"

            // discover:  "Radar"
            // browse:    "Manage Search"
            // read:      "Keyboard Arrow Down"
            // write:     "Keyboard Arrow Up"
            // subscribe: "Keyboard Double Arrow Down"
            // publish:   "Keyboard Double Arrow Up"
        }
    }

    function createTreeNode(curItem: TreeItemData, keyGenerator: Counter): TreeNode {
        return {
            key: keyGenerator.getAndIncrement(),
            id: curItem.id,
            label: curItem.name,
            icon: getIcon(curItem),
            data: curItem,
            children: curItem.children?.map(value => createTreeNode(value, keyGenerator))
        }
    }

    const confirmDeleteAccept = () => {
        restClient.deleteDevice(dialogDevice)
    }

    const confirmDeleteReject = () => {
    }

    function confirmDelete() {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: confirmDeleteAccept,
            reject: confirmDeleteReject
        });
    }

    function handleNodeDoubleClick(event: TreeNodeDoubleClickEvent) {
        // Open a new tab with the connection.
        if(event.node?.data && (event.node.data as Device) && event.node.data.type === "DEVICE" && onOpenDevice) {
            onOpenDevice(event.node.data as Device)
        }
    }

    const treeNodes: TreeNode[] = treeItems.map(value => createTreeNode(value, new Counter()))
    return (
        <div>
            <DeviceDialog device={dialogDevice} visible={showDeviceDialog}
                          onUpdate={device => {
                              setDialogDevice(device)
                          }}
                          onSave={device => {
                              restClient.saveDevice(device).then(value => {
                                  if (value.status == 200) {
                                      setShowDeviceDialog(false)
                                  }
                              })
                          }}
                          onCancel={() => setShowDeviceDialog(false)}/>
            <ConfirmDialog/>
            <ContextMenu model={menu} ref={cm}/>
            <Tree value={treeNodes}
                  selectionMode="single"
                  onNodeDoubleClick={handleNodeDoubleClick}
                  onContextMenu={event => {
                      if (cm.current) {
                          // Update the state of the menu (enabling/disabling some menu items)
                          updateMenu(event.node.data as TreeItemData)
                          //cm.current.props.model = menu
                          cm.current.show(event.originalEvent);
                      }
                  }}/>
        </div>)
}