package com.toddysoft.ui.permissions.repository;

import com.toddysoft.ui.permissions.entity.Permission;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface PermissionRepository extends CrudRepository<Permission, Integer> {

    Optional<Permission> findByModuleNameAndActionName(String moduleName, String actionName);

}
