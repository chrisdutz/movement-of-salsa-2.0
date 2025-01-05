package com.toddysoft.ui.security.controller;

import com.toddysoft.ui.security.dto.RegisterUserDto;
import com.toddysoft.ui.security.service.RegistrationService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/auth")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterUserDto userRegistrationDto) {
        try {
            registrationService.register(userRegistrationDto);

            // TODO: Do something with the information

            return ResponseEntity.ok(null);
        } catch (ConstraintViolationException e) {
            // This usually is because a constraint as violated
            // (generally someone trying to register using the same email address again)
            return ResponseEntity.status(409).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}