package com.toddysoft.ui.modules.controller;

import com.toddysoft.ui.permissions.api.Term;
import com.toddysoft.ui.permissions.service.PermissionService;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.modules.model.FrontendModule;
import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/application")
public class ApplicationController {

    private final List<FrontendModuleProvider> frontendModuleProviders;
    private final PermissionService permissionService;

    public ApplicationController(List<FrontendModuleProvider> frontendModuleProviders, PermissionService permissionService) {
        this.frontendModuleProviders = frontendModuleProviders;
        this.permissionService = permissionService;
    }

    /**
     * @return list of modules the currently logged-in user is allowed to use.
     */
    @GetMapping("/modules")
    public ResponseEntity<List<FrontendModule>> applicationModules() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> context = new HashMap<>();
        context.put("user", authentication.getPrincipal());

        List<FrontendModule> frontendModules = new ArrayList<>(frontendModuleProviders.size());
        frontendModuleProviders.forEach(frontendModuleProvider -> {
            frontendModuleProvider.getFrontendModules().forEach(frontendModule -> {
                String moduleName = frontendModule.getName().toLowerCase();
                String moduleType = frontendModule.getType().toLowerCase();
                String ruleName = "use " + moduleType + " module";

                // Check, if the current user is allowed to use the current module.
                Term<Boolean> booleanTerm = permissionService.getBooleanTerm(moduleName, ruleName);
                if (booleanTerm.evaluate(context)) {
                    frontendModules.add(frontendModule);
                }
            });
        });

        // TODO: It should be possible to filter the modules to only contain the ones the user has access for.
        //User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(frontendModules);
    }

    /**
     * @return user-object of the currently logged-in user.
     */
    @GetMapping("/user")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(currentUser);
    }

}
