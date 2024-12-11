package com.toddysoft.ui.security.service;

import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.modules.model.FrontendModule;
import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import com.toddysoft.ui.security.repository.UserRepository;
import org.apache.commons.collections4.IterableUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UsersService implements FrontendModuleProvider {

    private final UserRepository userRepository;

    public UsersService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<FrontendModule> getFrontendModules() {
        return List.of(
                // Settings module, where an admin can manage users
                new FrontendModule("Admin", "Users", "fa-users", "/admin/users", "", "Users"));
    }

    @Transactional(readOnly = true)
    public List<User> list() {
        return IterableUtils.toList(userRepository.findAll());
    }

    @Transactional(readOnly = true)
    public Optional<User> readByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public User save(User user) {
        // TODO: Prevent that changes on the roles can be saved by updating them in the user object
        return userRepository.save(user);
    }

    @Transactional
    public void delete(User user) {
        userRepository.delete(user);
    }

}
