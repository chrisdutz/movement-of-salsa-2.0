
package com.toddysoft.ui.modules.inspect.event;

import com.toddysoft.ui.websocket.event.UiApplicationEvent;
import com.toddysoft.ui.modules.inspect.entity.Device;

public class DeviceEvent extends UiApplicationEvent<Device> {

    public DeviceEvent(String actionName, Device device) {
        super("inspect", actionName, device);
    }

}
