package com.toddysoft.ui.modules.about;

import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import com.toddysoft.ui.modules.model.FrontendModule;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AboutModule implements FrontendModuleProvider {

    @Override
    public List<FrontendModule> getFrontendModules() {
        return List.of(
                // General purpose module
                new FrontendModule("Main", "About", "fa-info", "/about", "/modules/about/assets/aboutModule.js", "AboutMainModule", 20));
    }

}
