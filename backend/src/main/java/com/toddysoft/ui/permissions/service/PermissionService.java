package com.toddysoft.ui.permissions.service;

import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import com.toddysoft.ui.modules.model.FrontendModule;
import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.Term;
import com.toddysoft.ui.permissions.entity.Permission;
import com.toddysoft.ui.permissions.parser.PermissionTermParser;
import com.toddysoft.ui.permissions.repository.PermissionRepository;
import org.apache.commons.collections4.IterableUtils;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public class PermissionService implements FrontendModuleProvider {

    private final PermissionRepository permissionRepository;
    private final Map<String, TermFunction<?>> functions;

    public PermissionService(PermissionRepository permissionRepository, Map<String, TermFunction<?>> functions) {
        this.permissionRepository = permissionRepository;
        this.functions = functions;
    }

    @Override
    public List<FrontendModule> getFrontendModules() {
        return List.of(
                // Settings module, where an admin can manage users
                new FrontendModule("Admin", "Permissions", "fa-shield-keyhole", "/admin/permissions", "", "Permissions", 30));
    }

    @Transactional(readOnly = true)
    public List<Permission> list() {
        return IterableUtils.toList(permissionRepository.findAll());
    }

    @Transactional
    public Permission save(Permission permission) {
        return permissionRepository.save(permission);
    }

    public Term<Boolean> getBooleanTerm(Permission permission) {
        String ruleString = permission.getRule();
        return new PermissionTermParser(functions).parseBooleanExpression(ruleString);
    }

    public Term<Boolean> getBooleanTerm(String moduleName, String actionName) {
        Optional<Permission> permissionOptional = permissionRepository.findByModuleNameAndActionName(moduleName, actionName);
        if (permissionOptional.isPresent()) {
            String ruleString = permissionOptional.get().getRule();
            return new PermissionTermParser(functions).parseBooleanExpression(ruleString);
        } else {
            return context -> false;
        }
    }

    public Term<Number> getNumericTerm(Permission permission) {
        String ruleString = permission.getRule();
        return new PermissionTermParser(functions).parseNumericExpression(ruleString);
    }

    public Term<String> getStringTerm(Permission permission) {
        String ruleString = permission.getRule();
        return new PermissionTermParser(functions).parseStringExpression(ruleString);
    }
}
