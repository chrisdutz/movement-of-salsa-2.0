package com.toddysoft.ui.security.service;

import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import com.toddysoft.ui.modules.model.FrontendModule;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoginService implements FrontendModuleProvider {

    @Override
    public List<FrontendModule> getFrontendModules() {
        return List.of(
                // Settings module, where an admin can manage users
                new FrontendModule("Main", "Login", "fa-user", "/login", "", "Login", 100),
                new FrontendModule("Main", "Logout", "fa-right-from-bracket", "/logout", "", "Logout", 101));
    }

}
