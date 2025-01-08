package com.toddysoft.ui.security.service;

import com.toddysoft.ui.email.service.EmailSenderService;
import com.toddysoft.ui.security.dto.LoginUserDto;
import com.toddysoft.ui.security.dto.ResetPasswordDto;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.security.repository.UserRepository;
import com.toddysoft.ui.validation.entity.ValidationRequest;
import com.toddysoft.ui.validation.service.ValidationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthenticationService {

    private final String appBaseUrl;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final ValidationService validationService;
    private final EmailSenderService emailSenderService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthenticationService(
            @Value("${app.baseUrl}") String appBaseUrl,
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            ValidationService validationService,
            EmailSenderService emailSenderService,
            BCryptPasswordEncoder passwordEncoder) {
        this.appBaseUrl = appBaseUrl;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.validationService = validationService;
        this.emailSenderService = emailSenderService;
        this.passwordEncoder = passwordEncoder;
    }

    public User authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return userRepository.findByEmail(input.getEmail())
                .orElseThrow();
    }

    /**
     * Try to find a given user and if he exists, send an email with a link to reset the password.
     *
     * @param resetPasswordDto the dto containing all information to reset the password.
     */
    @Async
    public void sendResetPasswordEmail(ResetPasswordDto resetPasswordDto) {
        // Check if the user with the given email address exists.
        // If not, abort.
        Optional<User> byEmail = userRepository.findByEmail(resetPasswordDto.getEmail());
        if(byEmail.isEmpty()){
            return;
        }

        // Encode the password so it's not stored in clear text in the validation tables.
        resetPasswordDto.setPassword(passwordEncoder.encode(resetPasswordDto.getPassword()));

        // If user exists, then send the reset password email.
        ValidationRequest resetPasswordValidationRequest = validationService.createValidationRequest("reset-password", resetPasswordDto);

        Map<String, Object> varMap = new HashMap<>();
        varMap.put("appBaseUrl", appBaseUrl);
        varMap.put("token", resetPasswordValidationRequest.getTokenCode());
        varMap.put("username", resetPasswordDto.getEmail());
        emailSenderService.sendEmail(resetPasswordDto.getEmail(), "reset-password-request", varMap);
    }

}