package com.toddysoft.ui.security.service;

import com.toddysoft.ui.security.entity.Role;
import com.toddysoft.ui.modules.model.FrontendModule;
import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import com.toddysoft.ui.security.repository.RoleRepository;
import org.apache.commons.collections4.IterableUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RolesService implements FrontendModuleProvider {

    private final RoleRepository roleRepository;

    public RolesService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<FrontendModule> getFrontendModules() {
        return List.of(
                // Settings module, where an admin can manage users
                new FrontendModule("Admin", "Roles", "fa-users-gear", "/admin/roles", "", "Roles"));
    }

    @Transactional(readOnly = true)
    public List<Role> list() {
        return IterableUtils.toList(roleRepository.findAll());
    }

    @Transactional
    public Role save(Role role) {
        return roleRepository.save(role);
    }

    @Transactional
    public void delete(Role role) {
        roleRepository.delete(role);
    }

}
