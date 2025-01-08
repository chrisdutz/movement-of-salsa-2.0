package com.toddysoft.ui.security.controller;

import com.toddysoft.ui.security.dto.LoginUserDto;
import com.toddysoft.ui.security.dto.ResetPasswordDto;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.security.service.AuthenticationService;
import com.toddysoft.ui.security.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        // This method is run asynchronously in order to prevent request-runtime measurement attacks.
        authenticationService.sendResetPasswordEmail(resetPasswordDto);
        return ResponseEntity.ok(null);
    }

    public record LoginResponse(String token, long expiresIn) {
    }

}