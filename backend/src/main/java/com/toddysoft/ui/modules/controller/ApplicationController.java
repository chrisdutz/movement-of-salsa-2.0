package com.toddysoft.ui.modules.controller;

import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.modules.model.FrontendModule;
import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/application")
public class ApplicationController {

    private final List<FrontendModuleProvider> frontendModuleProviders;

    public ApplicationController(List<FrontendModuleProvider> frontendModuleProviders) {
        this.frontendModuleProviders = frontendModuleProviders;
    }

    /**
     * @return list of modules the currently logged-in user is allowed to use.
     */
    @GetMapping("/modules")
    public ResponseEntity<List<FrontendModule>> applicationModules() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.ok(Collections.emptyList());
        } else {
            List<FrontendModule> frontendModules = new ArrayList<>(frontendModuleProviders.size());
            frontendModuleProviders.forEach(frontendModuleProvider -> {
                frontendModules.addAll(frontendModuleProvider.getFrontendModules());
            });

            // TODO: It should be possible to filter the modules to only contain the ones the user has access for.
            //User currentUser = (User) authentication.getPrincipal();
            return ResponseEntity.ok(frontendModules);
        }
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
