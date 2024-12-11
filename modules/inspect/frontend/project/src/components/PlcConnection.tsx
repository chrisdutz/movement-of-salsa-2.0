import 'primeicons/primeicons.css';
import {TreeTable, TreeTableCheckboxSelectionKeyType, TreeTableSelectionKeysType} from "primereact/treetable";
import {Column} from "primereact/column";
import React, {useEffect, useState} from "react";
import {TreeNode} from "primereact/treenode";
import {ArrayInfo, Device, DeviceAddress, RestApplicationClient} from "../generated/plc4j-tools-ui-frontend.ts";
import axios from "axios";
import {Button} from "primereact/button";

const restClient = new RestApplicationClient(axios);

type PlcConnectionProps = {
    device: Device;
}

function createTreeNodeFromDeviceAddress(deviceAddress:DeviceAddress, addressPrefix:string):TreeNode {
    // If there are array elements, process these first
    if(deviceAddress.arrayInfo.length > 0) {
        let arrayChildren: TreeNode[] = [];
        const type = deviceAddress.type;
        // Create a copy of the ArrayInfo
        const restArrayInfo: ArrayInfo[] = []
        deviceAddress.arrayInfo.forEach(val => restArrayInfo.push(Object.assign({}, val)));
        // Pop the first item from this copy
        const curArrayInfo = restArrayInfo.shift();
        if (curArrayInfo) {
            for (let i = curArrayInfo?.lowerBound; i <= curArrayInfo?.upperBound; i++) {
                // Create an artificial DeviceAddress for the current array item.
                const curArrayDeviceAddress: DeviceAddress = {
                    name: "[" + i + "]",
                    address: deviceAddress.address + "[" + i + "]",
                    type: type,
                    arrayInfo: restArrayInfo,
                    children: deviceAddress.children,
                    readable: deviceAddress.readable,
                    writable: deviceAddress.writable,
                    publishable: deviceAddress.publishable,
                    subscribable: deviceAddress.subscribable,
                }
                arrayChildren = [...arrayChildren, createTreeNodeFromDeviceAddress(curArrayDeviceAddress, addressPrefix + "[" + i + "]")]
            }
        }
        return {
            key: addressPrefix,
            label: deviceAddress.name,
            data: deviceAddress,
            children: arrayChildren,
        }
    }

    // Next process any possibly existing children
    let children: TreeNode[] = [];
    if(deviceAddress.children) {
        for (let childrenKey in deviceAddress.children) {
            const child = deviceAddress.children[childrenKey];
            children = [...children, createTreeNodeFromDeviceAddress(child, addressPrefix + "." + childrenKey)]
        }
    }

    // Build the TreeNode
    return {
        key: addressPrefix,
        label: deviceAddress.name,
        data: deviceAddress,
        children: children,
    }
}

export default function PlcConnection({device}: PlcConnectionProps) {
    const [deviceTags, setDeviceTags] = useState<TreeNode[]>([]);
    const [deviceTagValues, setDeviceTagValues] = useState<Map<string, any>>(new Map<string, any>);
    const [selectedNodeKeys, setSelectedNodeKeys] = useState<TreeTableSelectionKeysType>();
    const [, updateState] = React.useState<any>();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                restClient.browseDevice(device.id).then(response => {
                    let newDeviceTags: TreeNode[] = []
                    response.data.forEach(deviceAddress => {
                        const tag = createTreeNodeFromDeviceAddress(deviceAddress, deviceAddress.address)
                        newDeviceTags = [...newDeviceTags, tag];
                    })
                    setDeviceTags(newDeviceTags)
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        return () => {};
    }, []);

    const typeTemplate = (rowData:any) => {
        const data = rowData.data as DeviceAddress;
        if(data.arrayInfo) {
            let arrayInfo = data.type + " "
            data.arrayInfo.forEach(value => {
                arrayInfo = arrayInfo + "[" + value.lowerBound + ".." + value.upperBound + "]"
            })
            return arrayInfo
        }
        return data.type
    }

    const readTemplate = (rowData:any) => {
        const data = rowData.data as DeviceAddress;
        if(data.readable) {
            return (
                <i className={"fa-solid fa-circle-check"} style={{color:"green"}}/>
            )
        } else {
            return (
                <i className={"fa-solid fa-circle-xmark"} style={{color:"red"}}/>
            )
        }
    }

    const writeTemplate = (rowData:any) => {
        const data = rowData.data as DeviceAddress;
        if(data.writable) {
            return (
                <i className={"fa-solid fa-circle-check"} style={{color:"green"}}/>
            )
        } else {
            return (
                <i className={"fa-solid fa-circle-xmark"} style={{color:"red"}}/>
            )
        }
    }

    const subscribeTemplate = (rowData:any) => {
        const data = rowData.data as DeviceAddress;
        if(data.subscribable) {
            return (
                <i className={"fa-solid fa-circle-check"} style={{color:"green"}}/>
            )
        } else {
            return (
                <i className={"fa-solid fa-circle-xmark"} style={{color:"red"}}/>
            )
        }
    }

    const publishableTemplate = (node:any) => {
        const data = node.data as DeviceAddress;
        if(data.publishable) {
            return (
                <i className={"fa-solid fa-circle-check"} style={{color:"green"}}/>
            )
        } else {
            return (
                <i className={"fa-solid fa-circle-xmark"} style={{color:"red"}}/>
            )
        }
    }

    const valueTemplate = (node:any) => {
        const data = node.data as DeviceAddress;
        if(deviceTagValues) {
            return deviceTagValues.get(data.address)
        }
        return ""
    }

    const rowClassName = (node:any) => {
        const data = node.data as DeviceAddress
        if(data.arrayInfo.length > 0) {
            return {'p-highlight-list': true}
        }
        if(data.type === 'Struct') {
            return {'p-highlight-struct': true}
        }
        return {}
    }

    function handleReadButtonClick() {
        if(selectedNodeKeys) {
            let addresses:string[] = []
            for (let key of Object.keys(selectedNodeKeys)) {
                if(selectedNodeKeys[key] as TreeTableCheckboxSelectionKeyType) {
                    if((selectedNodeKeys[key] as TreeTableCheckboxSelectionKeyType).checked) {
                        addresses = [...addresses, key]
                    }
                }
            }
            restClient.readDevice(device.id, addresses).then(value => {
                for (let dataKey in value.data) {
                    setDeviceTagValues(prevState => {
                        prevState.set(dataKey, value.data[dataKey])
                        return prevState
                    })
                }
                forceUpdate()
            })
        }
    }

    return (
        <div className="card">
            <div className="flex justify-content-center mb-2">
                <Button
                disabled={!selectedNodeKeys || (Object.keys(selectedNodeKeys).length == 0)}
                onClick={handleReadButtonClick}>Read</Button>
            </div>
            <TreeTable value={deviceTags} selectionMode="checkbox"
                       selectionKeys={selectedNodeKeys} onSelectionChange={(e) => setSelectedNodeKeys(e.value)}
                       rowClassName={rowClassName} resizableColumns showGridlines>
                <Column field="name" header="Name" sortable filter filterPlaceholder="Filter by name"
                        style={{width: '600px', height: '0'}} expander/>
                <Column field="type" header="Datatype" body={typeTemplate}
                        style={{height: '0', paddingLeft: '1em'}}/>
                {/*<Column field="size" header="Size" style={{ height: '0' }}/>*/}
                <Column field="readable" header="Readable" body={readTemplate}
                        style={{height: '0', textAlign: 'center'}}/>
                <Column field="writable" header="Writable" body={writeTemplate}
                        style={{height: '0', textAlign: 'center'}}/>
                <Column field="subscribable" header="Subscribable" body={subscribeTemplate}
                        style={{height: '0', textAlign: 'center'}}/>
                <Column field="publishable" header="Publishable" body={publishableTemplate}
                        style={{height: '0', textAlign: 'center'}}/>
                <Column field="value" header="Value" body={valueTemplate}
                        style={{ height: '0', paddingLeft: '1em'}}/>
                {/*<Column field="setValue" header="Set Value" style={{ height: '0' }}/>*/}
            </TreeTable>
        </div>
    )
}