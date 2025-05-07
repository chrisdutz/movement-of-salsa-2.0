
package com.toddysoft.ui.modules.lessons.controller;

import com.toddysoft.ui.email.service.EmailSenderService;
import com.toddysoft.ui.modules.lessons.dto.CourseRegistrationDto;
import com.toddysoft.ui.modules.lessons.dto.UserDto;
import com.toddysoft.ui.modules.lessons.service.CourseCoupleService;
import com.toddysoft.ui.modules.lessons.service.CourseRegistrationService;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.validation.entity.ValidationRequest;
import com.toddysoft.ui.validation.service.ValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/registrations/user")
public class CourseRegistrationUserController {

    private static final Logger log = LoggerFactory.getLogger(CourseRegistrationUserController.class);
    private final String appBaseUrl;
    private final CourseRegistrationService courseRegistrationService;
    private final CourseCoupleService courseCoupleService;
    private final ValidationService validationService;
    private final EmailSenderService emailSenderService;

    public CourseRegistrationUserController(@Value("${app.baseUrl}") String appBaseUrl, CourseRegistrationService courseRegistrationService, CourseCoupleService courseCoupleService, ValidationService validationService, EmailSenderService emailSenderService) {
        this.appBaseUrl = appBaseUrl;
        this.courseRegistrationService = courseRegistrationService;
        this.courseCoupleService = courseCoupleService;
        this.validationService = validationService;
        this.emailSenderService = emailSenderService;
    }

    /**
     * @return list of previous partners for this user.
     */
    @GetMapping("/partners")
    public List<UserDto> findCurrentUserPartners() {
        // Get the current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(authentication.getPrincipal() instanceof User user)) return Collections.emptyList();

        // Get all previous partners this user has had.
        List<User> partners = courseCoupleService.listPartners(user);
        return partners.stream().map(UserDto::new).toList();
    }

    @PostMapping
    public CourseRegistrationDto save(@RequestBody CourseRegistrationDto courseRegistration) {
        // Get the current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(authentication.getPrincipal() instanceof User)) {
            // TODO: If the registration is coming from an unauthenticated user, create a validation request and
            //       let the guest confirm the correctness of the email address.
            try {
                ValidationRequest validationRequest = validationService.createValidationRequest("course-registration", courseRegistration);
                Map<String, Object> varMap = new HashMap<>();
                varMap.put("appBaseUrl", appBaseUrl);
                varMap.put("token", validationRequest.getTokenCode());
                varMap.put("courseRegistration", courseRegistration);
                emailSenderService.sendEmail(courseRegistration.getRegistrar().getEmail(), "confirm-registration-request", varMap);
            } catch (Exception ex) {
                log.error("Error sending validation request", ex);
            }
            return courseRegistration;
        } else {
            return new CourseRegistrationDto(courseRegistrationService.createItem(courseRegistration.toEntity()));
        }
    }

}
