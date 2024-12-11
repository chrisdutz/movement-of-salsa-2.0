
package com.toddysoft.ui.modules.inspect.repository;

import com.toddysoft.ui.modules.inspect.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Integer> {
    List<Device> findByProtocolCodeAndTransportCodeAndTransportUrl(String protocolCode, String transportCode, String transportUrl);

}
