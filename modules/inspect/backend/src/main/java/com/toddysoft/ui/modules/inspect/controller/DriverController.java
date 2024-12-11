
package com.toddysoft.ui.modules.inspect.controller;

import com.toddysoft.ui.modules.inspect.model.Driver;
import com.toddysoft.ui.modules.inspect.service.DriverService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Allow from the default port 8080 as well as the one node usually uses for it's dev-mode 5173
//@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping
    public List<Driver> getAllDrivers() {
        return driverService.getDriverList();
    }

    @GetMapping("/discover/{protocolCode}")
    public void discover(@PathVariable("protocolCode") String protocolCode) {
        driverService.discover(protocolCode);
    }

}
