package com.toddysoft.ui.security.service;

import com.toddysoft.ui.modules.api.FrontendModuleProvider;
import com.toddysoft.ui.modules.model.FrontendModule;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.security.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
public class UserService implements FrontendModuleProvider {

    private final static String passwordMask = "___masked___";

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<FrontendModule> getFrontendModules() {
        return List.of(
                // Settings module, where an admin can manage users
                new FrontendModule("Admin", "Users", "fa-users", "/admin/users", "", "Users", 10));
    }

    @Transactional(readOnly = true)
    public List<User> list() {
        // TODO: Mask the password
        return StreamSupport
                .stream(userRepository.findAll().spliterator(), false)
                .map(this::maskedUserClone).toList();
    }

    @Transactional(readOnly = true)
    public Optional<User> readByEmail(String email) {
        // Mask the password
        Optional<User> user = userRepository.findByEmail(email);
        user.ifPresent(value -> value.setPassword(passwordMask));
        return user;
    }

    @Transactional
    public User save(User user) {
        // We're not returning the password to any client, so we're masking
        // it with "___masked___". So when saving, we need to check:
        // - If it's not set to "___masked___", a user is trying to change the PW
        //   In this case we need to encode the PW and update it in the entity.
        // - If it's not changed, we need to fetch the original PW from the
        //   real bean and update the masked value with that.
        if (!user.getPassword().equals(passwordMask)) {
            // Encode the password.
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            // Copy over the old password.
            Optional<User> original = userRepository.findById(user.getId());
            original.ifPresent(value -> user.setPassword(value.getPassword()));
        }
        return userRepository.save(user);
    }

    @Transactional
    public void delete(User user) {
        userRepository.delete(user);
    }

    protected User maskedUserClone(User user) {
        return new User(user.getId(), user.getFirstName(), user.getLastName(),
                user.getStreet(), user.getZip(), user.getCity(), user.getCountry(),
                user.getSex(), user.getSize(), user.getPhone(), user.getEmail(),
                passwordMask, user.getCreatedAt(), user.getUpdatedAt(), user.getRoles());
    }

}
