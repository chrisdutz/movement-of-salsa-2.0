package com.toddysoft.ui.security.service;

import com.toddysoft.ui.email.service.EmailSenderService;
import com.toddysoft.ui.security.dto.LoginUserDto;
import com.toddysoft.ui.security.dto.RegisterUserDto;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.security.exceptions.DuplicateRegistrationException;
import com.toddysoft.ui.security.repository.RoleRepository;
import com.toddysoft.ui.security.repository.UserRepository;
import com.toddysoft.ui.validation.entity.ValidationRequest;
import com.toddysoft.ui.validation.service.ValidationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class RegistrationService {

    private final String appBaseUrl;
    private final EmailSenderService emailSenderService;
    private final ValidationService validationService;
    private final UserRepository userRepository;

    public RegistrationService(
            @Value("${app.baseUrl}") String appBaseUrl,
            EmailSenderService emailSenderService,
            ValidationService validationService,
            UserRepository userRepository
    ) {
        this.appBaseUrl = appBaseUrl;
        this.emailSenderService = emailSenderService;
        this.validationService = validationService;
        this.userRepository = userRepository;
    }

    @Transactional
    public void register(RegisterUserDto input) throws DuplicateRegistrationException {
        // Check if the email address used has been used before.
        Optional<User> byEmail = userRepository.findByEmail(input.getEmail());
        if(byEmail.isPresent()) {
            throw new DuplicateRegistrationException(input.getEmail());
        }

        ValidationRequest registrationValidationRequest = validationService.createValidationRequest(
                "registration", input);

        Map<String, Object> varMap = new HashMap<>();
        varMap.put("appBaseUrl", appBaseUrl);
        varMap.put("token", registrationValidationRequest.getTokenCode());
        varMap.put("email", input.getEmail());
        emailSenderService.sendEmail(input.getEmail(), "registration-request", varMap);
    }

}