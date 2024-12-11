package com.toddysoft.ui.permissions.controller;

import com.toddysoft.ui.permissions.entity.Permission;
import com.toddysoft.ui.permissions.service.PermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping("/permissions")
    public ResponseEntity<List<Permission>> listPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.ok(Collections.emptyList());
        } else {
            return ResponseEntity.ok(permissionService.list());
        }
    }

    @PostMapping("/permission")
    public ResponseEntity<Permission> savePermission(@RequestBody Permission permission) {
        return ResponseEntity.ok(permissionService.save(permission));
    }

}
