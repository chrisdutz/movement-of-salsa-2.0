package com.toddysoft.ui.modules.lessons.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.modules.lessons.entity.CourseRegistration;
import com.toddysoft.ui.modules.lessons.entity.Lesson;
import com.toddysoft.ui.modules.lessons.repository.CourseRegistrationRepository;
import com.toddysoft.ui.modules.lessons.repository.CourseRepository;
import com.toddysoft.ui.modules.lessons.types.CourseRegistrationType;
import com.toddysoft.ui.security.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CourseRegistrationService
{
    private final Logger logger = LoggerFactory.getLogger(CourseRegistrationService.class);

    private final CourseRegistrationRepository courseRegistrationRepository;

    public CourseRegistrationService(CourseRegistrationRepository courseRegistrationRepository) {
        this.courseRegistrationRepository = courseRegistrationRepository;
    }

    //////////////////////////////////////////////
    // Service methods.
    //////////////////////////////////////////////

    @Transactional
    public CourseRegistration createItem(CourseRegistration courseRegistration) {
        return courseRegistrationRepository.save(courseRegistration);
    }

    @Transactional(readOnly = true)
    public CourseRegistration readItem(long id) {
        return courseRegistrationRepository.getReferenceById(id);
    }

    @Transactional
    public CourseRegistration updateItem(CourseRegistration courseRegistration) {
        return courseRegistrationRepository.save(courseRegistration);
    }

    @Transactional
    public void deleteItem(CourseRegistration courseRegistration) {
        courseRegistrationRepository.delete(courseRegistration);
    }

    @Transactional(readOnly = true)
    public List<CourseRegistration> listItems(long courseId) {
        return courseRegistrationRepository.findByCourse_Id(courseId);
    }

    @Transactional(readOnly = true)
    public List<User> listPayingUsers(long courseId) {
        List<CourseRegistration> courseRegistrations = listItems(courseId);
        Map<Long, User> users = new HashMap<>();
        for (CourseRegistration courseRegistration : courseRegistrations) {
            User registrar = courseRegistration.getRegistrar();
            users.put(registrar.getId(), registrar);
            if(courseRegistration.getCourseRegistrationType() == CourseRegistrationType.COUPLE) {
                User partner = courseRegistration.getPartner();
                users.put(partner.getId(), partner);
            }
        }
        return new ArrayList<>(users.values());
    }

}