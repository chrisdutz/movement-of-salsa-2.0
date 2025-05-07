package com.toddysoft.ui.modules.lessons.validation;

import com.toddysoft.ui.modules.lessons.dto.CourseRegistrationDto;
import com.toddysoft.ui.modules.lessons.service.CourseRegistrationService;
import com.toddysoft.ui.validation.entity.ValidationRequest;
import com.toddysoft.ui.validation.service.ValidationClient;
import org.springframework.stereotype.Component;

@Component
public class CourseRegistraionValidationClient implements ValidationClient {

    private final CourseRegistrationService courseRegistrationService;

    public CourseRegistraionValidationClient(CourseRegistrationService courseRegistrationService) {
        this.courseRegistrationService = courseRegistrationService;
    }

    @Override
    public String getModuleName() {
        return "course-registration";
    }

    @Override
    public void handleValidatedRequest(ValidationRequest request) {
        // Get the validation request
        if(!(request.getPayload() instanceof CourseRegistrationDto courseRegistration)) {
            throw new RuntimeException("Invalid payload");
        }
        courseRegistrationService.createItem(courseRegistration.toEntity());
    }

}
