
package com.toddysoft.ui.modules.inspect.service;

import com.toddysoft.ui.modules.inspect.entity.Device;
import org.apache.plc4x.java.api.PlcConnection;
import org.apache.plc4x.java.api.PlcDriverManager;
import com.toddysoft.ui.modules.inspect.event.DeviceEvent;
import com.toddysoft.ui.modules.inspect.repository.DeviceRepository;
import org.apache.plc4x.java.api.messages.PlcBrowseItem;
import org.apache.plc4x.java.api.messages.PlcBrowseResponse;
import org.apache.plc4x.java.api.messages.PlcReadRequest;
import org.apache.plc4x.java.api.messages.PlcReadResponse;
import org.apache.plc4x.java.api.types.PlcResponseCode;
import org.apache.plc4x.java.api.value.PlcValue;
import org.apache.plc4x.java.spi.values.PlcNull;
import org.apache.plc4x.java.utils.cache.CachedPlcConnectionManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Component
public class DeviceService {

    private final Logger logger = LoggerFactory.getLogger(DeviceService.class);

    private final DeviceRepository deviceRepository;
    private final ApplicationEventPublisher publisher;
    private final CachedPlcConnectionManager cachedPlcConnectionManager;

    public DeviceService(DeviceRepository deviceRepository, ApplicationEventPublisher publisher, PlcDriverManager driverManager) {
        this.deviceRepository = deviceRepository;
        this.publisher = publisher;
        this.cachedPlcConnectionManager = CachedPlcConnectionManager.getBuilder(driverManager.getConnectionManager()).build();
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    /**
     * We consider a device a "new device", if there is no device with the same protocol code, transport code and transport url.
     * @param device the device we want to know if it's "new".
     * @return true if it's a "new" device.
     */
    public boolean isNewDevice(Device device) {
        List<Device> foundDevices = deviceRepository.findByProtocolCodeAndTransportCodeAndTransportUrl(device.getProtocolCode(), device.getTransportCode(), device.getTransportUrl());
        return foundDevices.isEmpty();
    }

    public Device createDevice(Device device) {
        Device savedDevice = deviceRepository.save(device);
        publisher.publishEvent(new DeviceEvent("create", device));
        return savedDevice;
    }

    public Optional<Device> readDevice(Integer id) {
        return deviceRepository.findById(id);
    }

    public Device updateDevice(Device device) {
        Device savedDevice = deviceRepository.save(device);
        publisher.publishEvent(new DeviceEvent("update", savedDevice));
        return savedDevice;
    }

    public void deleteDevice(Device device) {
        deviceRepository.delete(device);
        publisher.publishEvent(new DeviceEvent("delete", device));
    }

    public List<PlcBrowseItem> browseDevice(Device device) {
        try (PlcConnection connection = cachedPlcConnectionManager.getConnection(getConnectionString(device))) {
            if(connection.getMetadata().isBrowseSupported()) {
                PlcBrowseResponse browseResponse = connection.browseRequestBuilder().addQuery("all", "*")
                        .build().execute().get(1000, TimeUnit.MILLISECONDS);
                return browseResponse.getValues("all");
            }
        } catch (Exception e) {
            logger.warn("Error while browsing device", e);
        }
        return Collections.emptyList();
    }

    public Map<String, PlcValue> queryDevice(Device device, List<String> addresses) {
        try (PlcConnection connection = cachedPlcConnectionManager.getConnection(getConnectionString(device))) {
            if(connection.getMetadata().isReadSupported()) {
                PlcReadRequest.Builder builder = connection.readRequestBuilder();
                for (String address : addresses) {
                    builder.addTagAddress(address, address);
                }
                PlcReadResponse readResponse = builder.build().execute().get(1000, TimeUnit.MILLISECONDS);
                Map<String, PlcValue> results = new HashMap<>();
                for (String address : addresses) {
                    if(readResponse.getResponseCode(address) == PlcResponseCode.OK) {
                        results.put(address, readResponse.getPlcValue(address));
                    } else {
                        results.put(address, new PlcNull());
                    }
                }
                return results;
            }
        } catch (Exception e) {
            logger.warn("Error while browsing device", e);
        }
        return Collections.emptyMap();
    }

    protected String getConnectionString(Device device) {
        StringBuffer sb = new StringBuffer();
        sb.append(device.getProtocolCode()).append(":").append(device.getTransportCode()).append("://").append(device.getTransportUrl());
        if(device.getOptions() != null) {
            sb.append("?");
            device.getOptions().forEach((k, v) -> sb.append(k).append("=").append(v).append("&"));
            return sb.substring(0, sb.length() - 1);
        }
        return sb.toString();
    }

}
