import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Device, Driver} from "../generated/plc4j-tools-ui-frontend.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Driver and Device-List related
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type InitializeConnectionsAction = {
    driverList: Driver[]
    deviceList: Device[]
}

export type DeviceAction = {
    device: Device
}

export interface ConnectionsState {
    driverList: Driver[]
    deviceList: Device[]
}

const connectionsInitialState: ConnectionsState = {
    driverList: [] as Driver[],
    deviceList: [] as Device[],
}

const connectionsSlice = createSlice({
    name: 'connections',
    initialState: connectionsInitialState,
    reducers: {
        initializeLists: (state, action: PayloadAction<InitializeConnectionsAction>) => {
            state.driverList = action.payload.driverList
            state.deviceList = action.payload.deviceList
        },
        addDevice: (state, action: PayloadAction<DeviceAction>) => {
            console.log("ADD " + JSON.stringify(action))
            state.deviceList = [...state.deviceList, action.payload.device]
        },
        updateDevice: (state, action: PayloadAction<DeviceAction>) => {
            console.log("UPDATE " + JSON.stringify(action))
            const device = state.deviceList.find(value => value.id == action.payload.device.id);
            if (device) {
                const index = state.deviceList.indexOf(device);
                if (index) {
                    state.deviceList.splice(index, 1, action.payload.device);
                }
            }
        },
        deleteDevice: (state, action: PayloadAction<DeviceAction>) => {
            console.log("DELETE " + JSON.stringify(action))
            const device = state.deviceList.find(value => value.id == action.payload.device.id);
            if (device) {
                const index = state.deviceList.indexOf(device);
                if (index) {
                    state.deviceList.splice(index, 1);
                }
            }
        }
    }
})

export const {initializeLists, addDevice, updateDevice, deleteDevice } = connectionsSlice.actions

export {connectionsSlice}

export default connectionsSlice
