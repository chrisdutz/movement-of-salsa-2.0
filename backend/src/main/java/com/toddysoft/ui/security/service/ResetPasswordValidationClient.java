package com.toddysoft.ui.security.service;

import com.toddysoft.ui.security.dto.ResetPasswordDto;
import com.toddysoft.ui.validation.entity.ValidationRequest;
import com.toddysoft.ui.validation.service.ValidationClient;
import org.springframework.stereotype.Service;

@Service
public class ResetPasswordValidationClient implements ValidationClient {

    private final UserService userService;

    public ResetPasswordValidationClient(UserService userService) {
        this.userService = userService;
    }

    @Override
    public String getModuleName() {
        return "reset-password";
    }

    @Override
    public void handleValidatedRequest(ValidationRequest request) {
        // Get the validation request
        if(!(request.getPayload() instanceof ResetPasswordDto payload)) {
            throw new RuntimeException("Invalid payload");
        }

        userService.updateUserPassword(payload.getEmail(), payload.getPassword());
    }

}
