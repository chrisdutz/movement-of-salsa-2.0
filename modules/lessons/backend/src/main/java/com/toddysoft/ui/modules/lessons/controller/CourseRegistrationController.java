
package com.toddysoft.ui.modules.lessons.controller;

import com.toddysoft.ui.modules.lessons.dto.CourseRegistrationDto;
import com.toddysoft.ui.modules.lessons.dto.UserDto;
import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.modules.lessons.entity.CourseRegistration;
import com.toddysoft.ui.modules.lessons.service.CourseRegistrationService;
import com.toddysoft.ui.modules.lessons.service.CourseService;
import com.toddysoft.ui.security.entity.Sex;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.security.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

//@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/registrations")
public class CourseRegistrationController {

    private final CourseRegistrationService courseRegistrationService;
    private final CourseService courseService;
    private final UserService userService;

    public CourseRegistrationController(CourseRegistrationService courseRegistrationService, CourseService courseService, UserService userService) {
        this.courseRegistrationService = courseRegistrationService;
        this.courseService = courseService;
        this.userService = userService;
    }

    @GetMapping("/{course-id}")
    public List<CourseRegistrationDto> findRegistrationsForCourse(@PathVariable("course-id") long id) {
        List<CourseRegistration> courseRegistrations = courseRegistrationService.listItems(id);
        return courseRegistrations.stream().map(CourseRegistrationDto::new).toList();
    }

    @GetMapping("/registrars")
    public List<UserDto> findUsers() {
        return userService.list().stream().map(UserDto::new).toList();
    }

    @GetMapping("/partners/{user-id}")
    public List<UserDto> findFindPartnersForUser(@PathVariable("user-id") long id) {
        Optional<User> registrar = userService.readById(id);
        if (registrar.isPresent()) {
            Sex registrarSex = registrar.get().getSex();
            Sex partnerSex = (registrarSex == Sex.MALE) ? Sex.FEMALE : Sex.MALE;
            // TODO: Order by the number of times they have danced together.
            return userService.list().stream().filter(user -> user.getSex() == partnerSex).map(UserDto::new).toList();
        }
        return Collections.emptyList();
    }

    @PostMapping
    public CourseRegistrationDto save(@RequestBody CourseRegistrationDto item) {
        CourseRegistration courseRegistration = new CourseRegistration();
        courseRegistration.setId(item.getId());
        courseRegistration.setCourseRegistrationType(item.getCourseRegistrationType());
        courseRegistration.setRateName(item.getRateName());
        courseRegistration.setPrice(item.getPrice());
        courseRegistration.setDiscount(item.getDiscount());
        courseRegistration.setDiscountRemarks(item.getDiscountRemarks());
        courseRegistration.setRemarks(item.getRemarks());

        Course course = courseService.readItem(item.getCourseId());
        courseRegistration.setCourse(course);

        Optional<User> registrar = userService.readById(item.getRegistrar().getId());
        courseRegistration.setRegistrar(registrar.orElse(null));

        Optional<User> partner = item.getPartner().isPresent() ? userService.readById(item.getPartner().get().getId()) : Optional.empty();
        courseRegistration.setPartner(partner.orElse(null));

        if(item.getId() == 0) {
            return new CourseRegistrationDto(courseRegistrationService.createItem(courseRegistration));
        } else {
            return new CourseRegistrationDto(courseRegistrationService.updateItem(courseRegistration));
        }
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable("id") long id) {
        CourseRegistration item = courseRegistrationService.readItem(id);
        courseRegistrationService.deleteItem(item);
    }

}
