
package com.toddysoft.ui.modules.inspect.service;

import com.toddysoft.ui.modules.inspect.entity.Device;
import com.toddysoft.ui.modules.inspect.model.Driver;
import org.apache.plc4x.java.api.PlcDriver;
import org.apache.plc4x.java.api.PlcDriverManager;
import org.apache.plc4x.java.api.exceptions.PlcConnectionException;
import org.apache.plc4x.java.api.messages.PlcDiscoveryRequest;
import org.apache.plc4x.java.api.metadata.PlcDriverMetadata;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DriverService {

    private static final String ALL_DRIVERS = "all";

    private final PlcDriverManager driverManager;
    private final DeviceService deviceService;

    public DriverService(PlcDriverManager driverManager, DeviceService deviceService) {
        this.driverManager = driverManager;
        this.deviceService = deviceService;
    }

    public List<Driver> getDriverList() {
        List<Driver> drivers = new ArrayList<>();
        for (String protocolCode : driverManager.getProtocolCodes()) {
            try {
                PlcDriver driver = driverManager.getDriver(protocolCode);
                PlcDriverMetadata metadata = driver.getMetadata();
                drivers.add(new Driver(protocolCode, driver.getProtocolName(), metadata));
            } catch (Exception e) {
                throw new RuntimeException("Error retrieving driver list", e);
            }
        }
        return drivers;
    }

    public void discover(String protocolCode) {
        if(ALL_DRIVERS.equals(protocolCode)) {
            for (String curProtocolCode : driverManager.getProtocolCodes()) {
                try {
                    // TODO: Fix discovery in modbus
                    if("modbus-tcp".equals(curProtocolCode)) {
                        continue;
                    }
                    PlcDriver driver = driverManager.getDriver(curProtocolCode);
                    if (driver.getMetadata().isDiscoverySupported()) {
                        discoverProtocol(curProtocolCode);
                    }
                } catch (PlcConnectionException e) {
                    throw new RuntimeException(e);
                }
            }
        } else {
            discoverProtocol(protocolCode);
        }
    }

    private void discoverProtocol(String protocolCode) {
        try {
            PlcDriver driver = driverManager.getDriver(protocolCode);
            if (!driver.getMetadata().isDiscoverySupported()) {
                throw new RuntimeException("Driver doesn't support discovery");
            } else {
                PlcDiscoveryRequest request = driver.discoveryRequestBuilder().addQuery("all", "*").build();
                // Execute the discovery request and have all connections found be added as connections.
                request.executeWithHandler(discoveryItem -> {
                    // Create the new device.
                    Device device = new Device();
                    device.setName(discoveryItem.getName());
                    device.setProtocolCode(discoveryItem.getProtocolCode());
                    device.setTransportCode(discoveryItem.getTransportCode());
                    device.setTransportUrl(discoveryItem.getTransportUrl());
                    device.setOptions(discoveryItem.getOptions());
                    Map<String, String> attributes = new HashMap<>();
                    for (String attributeName : discoveryItem.getAttributes().keySet()) {
                        String attributeValue = discoveryItem.getAttributes().get(attributeName).getString();
                        attributes.put(attributeName, attributeValue);
                    }
                    device.setAttributes(attributes);

                    // Save the found device in the database, if this is a new device,
                    // that is not stored in our system before.
                    if(deviceService.isNewDevice(device)) {
                        deviceService.createDevice(device);
                    }
                }).whenComplete((plcDiscoveryResponse, throwable) -> {
                    if(throwable != null) {
                        throw new RuntimeException("Error executing discovery", throwable);
                    }
                });
            }
        } catch (PlcConnectionException e) {
            throw new RuntimeException("Error getting driver", e);
        }
    }

}
