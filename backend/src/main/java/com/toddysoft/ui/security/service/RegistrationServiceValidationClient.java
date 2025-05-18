package com.toddysoft.ui.security.service;

import com.toddysoft.ui.email.service.EmailSenderService;
import com.toddysoft.ui.security.dto.RegisterUserDto;
import com.toddysoft.ui.security.entity.Role;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.security.repository.RoleRepository;
import com.toddysoft.ui.validation.entity.ValidationRequest;
import com.toddysoft.ui.validation.service.ValidationClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RegistrationServiceValidationClient implements ValidationClient {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final EmailSenderService emailSenderService;
    private final String defaultFromAddress;

    public RegistrationServiceValidationClient(UserService userService, RoleRepository roleRepository,
                                               EmailSenderService emailSenderService, @Value("${mail.default-from-address}") String defaultFromAddress) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.emailSenderService = emailSenderService;
        this.defaultFromAddress = defaultFromAddress;
    }

    @Override
    public String getModuleName() {
        return "registration";
    }

    @Override
    public void handleValidatedRequest(ValidationRequest request) {
        // Get the validation request
        if(!(request.getPayload() instanceof RegisterUserDto payload)) {
            throw new RuntimeException("Invalid payload");
        }

        // Handle if the user already existed (He maybe registered as a guest in the past)
        User user;
        Optional<User> userOptional = userService.readByEmail(payload.getEmail());
        if(userOptional.isPresent()) {
            user = userOptional.get();
        }
        // Create the new user
        else {
            user = new User();
            user.setCreatedAt(new Date());
        }

        // Get the "User" role
        Role userRole = roleRepository.findByName("User")
                .orElseThrow(() -> new RuntimeException("Role 'User' not found"));
        ArrayList<Role> roles = new ArrayList<>();
        roles.add(userRole);

        user.setEmail(payload.getEmail());
        user.setPassword(payload.getPassword());
        user.setFirstName(payload.getFirstName());
        user.setLastName(payload.getLastName());
        user.setSex(payload.getSex());
        user.setRoles(roles);
        user.setUpdatedAt(new Date());
        userService.save(user);

        // Send notification email to the admin.
        emailSenderService.sendEmail(defaultFromAddress,
                "registration-notification",
                Map.of("user", user));
    }

}
