package com.toddysoft.ui.modules.inspect;

import com.toddysoft.ui.modules.model.FrontendModule;
import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class InspectModule implements FrontendModuleProvider {

    @Override
    public List<FrontendModule> getFrontendModules() {
        return Collections.emptyList();
        /*return List.of(
                // General purpose module
                new FrontendModule("Main", "Inspect", "fa-radar", "/inspect", "/modules/inspect/assets/inspectModule.js", "InspectModule"),
                // Settings module, where an admin can configure which drivers and transports are available
                new FrontendModule("Settings", "Inspect", "fa-radar", "/settings/inspect", "/modules/inspect/assets/inspectModule.js", "InspectSettingsModule"));*/
    }

}
