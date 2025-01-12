package com.toddysoft.ui.modules.newsletter;

import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import com.toddysoft.ui.modules.model.FrontendModule;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class NewsletterModule implements FrontendModuleProvider {

    @Override
    public List<FrontendModule> getFrontendModules() {
        return List.of(
                new FrontendModule("User", "Newsletter", "fa-mailbox", "/user/newsletter", "/modules/newsletter/assets/newsletterModule.js", "NewsletterUserModule", 30),
                new FrontendModule("Admin", "Newsletter", "fa-mailbox", "/admin/newsletter", "/modules/newsletter/assets/newsletterModule.js", "NewsletterAdminModule", 50));
    }

}
