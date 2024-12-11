
package com.toddysoft.ui.modules.inspect.controller;

import com.toddysoft.ui.modules.inspect.entity.Device;
import com.toddysoft.ui.modules.inspect.model.DeviceAddress;
import com.toddysoft.ui.modules.inspect.service.DeviceService;
import org.apache.plc4x.java.api.messages.PlcBrowseItem;
import org.apache.plc4x.java.api.messages.PlcBrowseItemArrayInfo;
import org.apache.plc4x.java.api.model.ArrayInfo;
import org.apache.plc4x.java.api.value.PlcValue;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

//@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable(name = "id") Integer id) {
        Device device = deviceService.readDevice(id).orElseThrow(() -> new RuntimeException("Error finding connection with id: " + id));
        return ResponseEntity.ok(device);
    }

    @GetMapping
    public ResponseEntity<List<Device>> getAllDevices() {
        List<Device> allDevices = deviceService.getAllDevices();
        return ResponseEntity.ok(allDevices);
    }

    @PostMapping
    public ResponseEntity<Device> saveDevice(@RequestBody Device device) {
        if (device.getId() == null) {
            device = deviceService.createDevice(device);
        } else {
            device = deviceService.updateDevice(device);
        }
        return ResponseEntity.ok(device);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteDevice(@RequestBody Device device) {
        deviceService.deleteDevice(device);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/browse/{id}")
    public ResponseEntity<List<DeviceAddress>> browseDevice(@PathVariable(name = "id") Integer id) {
        Device device = deviceService.readDevice(id).orElseThrow(() -> new RuntimeException("Error finding connection with id: " + id));
        List<PlcBrowseItem> plcBrowseItems = deviceService.browseDevice(device);
        // Convert from PlcBrowseItem to DeviceAddress
        List<DeviceAddress> deviceAddresses = new ArrayList<>(plcBrowseItems.size());
        for (PlcBrowseItem plcBrowseItem : plcBrowseItems) {
            DeviceAddress deviceAddress = toDeviceAddress(plcBrowseItem);
            deviceAddresses.add(deviceAddress);
        }
        return ResponseEntity.ok(deviceAddresses);
    }

    @PostMapping("/read/{id}")
    public ResponseEntity<Map<String, Object>> readDevice(@PathVariable(name = "id") Integer id, @RequestBody List<String> addresses) {
        Device device = deviceService.readDevice(id).orElseThrow(() -> new RuntimeException("Error finding connection with id: " + id));
        Map<String, PlcValue> stringPlcValueMap = deviceService.queryDevice(device, addresses);
        Map<String, Object> frontendResponse = new HashMap<>();
        stringPlcValueMap.forEach((address, plcValue) -> frontendResponse.put(address, plcValue.getObject()));
        return ResponseEntity.ok(frontendResponse);
    }

    private DeviceAddress toDeviceAddress(PlcBrowseItem plcBrowseItem) {
        String name = plcBrowseItem.getName();
        String address = plcBrowseItem.getTag().getAddressString();
        String type = plcBrowseItem.getTag().getPlcValueType().name();
        List<ArrayInfo> arrayInformation = plcBrowseItem.getArrayInformation();
        DeviceAddress.ArrayInfo[] arrayInfo = new DeviceAddress.ArrayInfo[arrayInformation.size()];
        for(int i = 0; i < arrayInformation.size(); i++) {
            ArrayInfo arrayInfoElement = arrayInformation.get(i);
            arrayInfo[i] = new DeviceAddress.ArrayInfo(arrayInfoElement.getLowerBound(), arrayInfoElement.getUpperBound());
        }
        boolean readable = plcBrowseItem.isReadable();
        boolean writable = plcBrowseItem.isWritable();
        boolean subscribable = plcBrowseItem.isSubscribable();
        boolean publishable = false;
        Map<String, DeviceAddress> children = new LinkedHashMap<>(plcBrowseItem.getChildren().size());
        plcBrowseItem.getChildren().forEach((childName, childPlcBrowseItem) -> {
            DeviceAddress childDeviceAddress = toDeviceAddress(childPlcBrowseItem);
            children.put(childName, childDeviceAddress);
        });
        return new DeviceAddress(name, address, type, arrayInfo, readable, writable, subscribable, publishable, children);
    }

}
