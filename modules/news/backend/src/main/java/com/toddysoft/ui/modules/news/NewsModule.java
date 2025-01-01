package com.toddysoft.ui.modules.news;

import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import com.toddysoft.ui.modules.model.FrontendModule;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class NewsModule implements FrontendModuleProvider {

    @Override
    public List<FrontendModule> getFrontendModules() {
        return List.of(
                // General purpose module
                new FrontendModule("Main", "News", "fa-newspaper", "/news", "/modules/news/assets/newsModule.js", "NewsMainModule", 10),
                // Settings module, where an admin can configure which drivers and transports are available
                new FrontendModule("Admin", "News", "fa-newspaper", "/admin/news", "/modules/news/assets/newsModule.js", "NewsAdminModule", 40));
    }

}
