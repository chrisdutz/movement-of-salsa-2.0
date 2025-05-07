package com.toddysoft.ui.modules.lessons.service;

import com.toddysoft.ui.modules.lessons.entity.Couple;
import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.modules.lessons.entity.CourseRegistration;
import com.toddysoft.ui.modules.lessons.repository.CourseRegistrationRepository;
import com.toddysoft.ui.modules.lessons.types.CourseRegistrationType;
import com.toddysoft.ui.security.entity.Role;
import com.toddysoft.ui.security.entity.Sex;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.security.service.RoleService;
import com.toddysoft.ui.security.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class CourseRegistrationService
{
    private final Logger logger = LoggerFactory.getLogger(CourseRegistrationService.class);

    private final CourseRegistrationRepository courseRegistrationRepository;
    private final UserService userService;
    private final RoleService roleService;
    private final CourseService courseService;
    private final CourseCoupleService courseCoupleService;

    public CourseRegistrationService(CourseRegistrationRepository courseRegistrationRepository, UserService userService, RoleService roleService, CourseService courseService, CourseCoupleService courseCoupleService) {
        this.courseRegistrationRepository = courseRegistrationRepository;
        this.userService = userService;
        this.roleService = roleService;
        this.courseService = courseService;
        this.courseCoupleService = courseCoupleService;
    }

    //////////////////////////////////////////////
    // Service methods.
    //////////////////////////////////////////////

    @Transactional
    public CourseRegistration createItem(CourseRegistration courseRegistration) {
        // Replace the half course object with the full version.
        Course course = courseService.readItem(courseRegistration.getCourse().getId());
        courseRegistration.setCourse(course);

        // If it's a couple registration, make sure the partner is persisted.
        if(courseRegistration.getCourseRegistrationType() == CourseRegistrationType.COUPLE) {
            User gent = null;
            User lady = null;
            // Updated the partner with the full version.
            if(courseRegistration.getPartner().getId() != 0) {
                Optional<User> partner = userService.readById(courseRegistration.getPartner().getId());
                // This should never really happen.
                courseRegistration.setPartner(partner.orElse(null));
            }
            // Otherwise create a new user with the "Partner" role.
            else {
                // Add the "Guest" role to the new user.
                Optional<Role> partnerRole = roleService.list().stream().filter(role -> "Partner".equalsIgnoreCase(role.getName())).findFirst();
                User partner = courseRegistration.getPartner();
                partner.setRoles(Collections.singletonList(partnerRole.orElse(null)));
                partner = userService.save(partner);
                courseRegistration.setPartner(partner);
            }

            // Create and save a new couple
            if(courseRegistration.getRegistrar().getSex() == Sex.MALE) {
                gent = courseRegistration.getRegistrar();
                lady = courseRegistration.getPartner();
            } else {
                lady = courseRegistration.getRegistrar();
                gent = courseRegistration.getPartner();
            }
            Couple couple = new Couple();
            couple.setCourse(course);
            couple.setGent(gent);
            couple.setLady(lady);
            couple.setDescription(courseRegistration.getRemarks());
            couple.setConfirmed(false);
            courseCoupleService.createItem(couple);
        } else {
            courseRegistration.setPartner(null);
        }

        // Replace the half initialized user with the full version
        if(courseRegistration.getRegistrar().getId() != 0) {
            Optional<User> user = userService.readById(courseRegistration.getRegistrar().getId());
            // This should never really happen.
            courseRegistration.setRegistrar(user.orElse(null));
        }
        // Create a new user with the "Guest" role.
        else {
            Optional<Role> guestRole = roleService.list().stream().filter(role -> "Guest".equalsIgnoreCase(role.getName())).findFirst();
            User registrar = courseRegistration.getRegistrar();
            registrar.setRoles(Collections.singletonList(guestRole.orElse(null)));
            // Reset the email as that is also our username
            // (Otherwise after logging in as guest a user could never create an account)
            registrar.setEmail(null);
            registrar = userService.save(registrar);
            courseRegistration.setRegistrar(registrar);
        }

        // Save the registration.
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