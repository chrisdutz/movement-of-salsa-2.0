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

import java.util.Date;
import java.util.List;
import java.util.Map;

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

        // Get the "User" role
        Role userRole = roleRepository.findByName("User")
                .orElseThrow(() -> new RuntimeException("Role 'User' not found"));

        // Create the new user
        User user = new User();
        user.setEmail(payload.getEmail());
        user.setPassword(payload.getPassword());
        user.setFirstName(payload.getFirstName());
        user.setLastName(payload.getLastName());
        user.setSex(payload.getSex());
        user.setRoles(List.of(userRole));
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());
        userService.save(user);

        // Send notification email
        emailSenderService.sendEmail(defaultFromAddress,
                "registration-notification",
                Map.of("user", user));
    }

}
