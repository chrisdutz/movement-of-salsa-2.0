
package com.toddysoft.ui.modules.lessons.controller;

import com.toddysoft.ui.modules.lessons.dto.CourseCoupleDto;
import com.toddysoft.ui.modules.lessons.dto.UserDto;
import com.toddysoft.ui.modules.lessons.entity.Couple;
import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.modules.lessons.service.CourseCoupleService;
import com.toddysoft.ui.modules.lessons.service.CourseRegistrationService;
import com.toddysoft.ui.modules.lessons.service.CourseService;
import com.toddysoft.ui.security.entity.Sex;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.security.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

//@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/couples")
public class CourseCoupleController {

    private static final Logger log = LoggerFactory.getLogger(CourseCoupleController.class);

    private final CourseCoupleService courseCoupleService;
    private final CourseService courseService;
    private final UserService userService;
    private final CourseRegistrationService courseRegistrationService;

    public CourseCoupleController(CourseCoupleService courseCoupleService, CourseService courseService, UserService userService, CourseRegistrationService courseRegistrationService) {
        this.courseCoupleService = courseCoupleService;
        this.courseService = courseService;
        this.userService = userService;
        this.courseRegistrationService = courseRegistrationService;
    }

    @GetMapping("/{course-id}")
    public List<CourseCoupleDto> findCouplesForCourse(@PathVariable("course-id") long id) {
        List<Couple> couples = courseCoupleService.listItems(id);
        List<User> payingUsers = courseRegistrationService.listPayingUsers(id);
        return couples.stream().map(couple -> new CourseCoupleDto(couple, payingUsers.contains(couple.getGent()), payingUsers.contains(couple.getLady()))).toList();
    }

    @PostMapping
    public CourseCoupleDto save(@RequestBody CourseCoupleDto item) {
        Course course = courseService.readItem(item.getCourseId());
        Optional<User> gent = userService.readById(item.getGent().getId());
        Optional<User> lady = userService.readById(item.getLady().getId());

        Couple couple = new Couple();
        couple.setId(item.getId());
        couple.setCourse(course);
        couple.setGent(gent.orElse(null));
        couple.setLady(lady.orElse(null));
        couple.setConfirmed(item.isConfirmed());
        couple.setDescription(item.getRemarks());

        List<User> payingUsers = courseRegistrationService.listPayingUsers(item.getCourseId());
        if(item.getId() == 0) {
            return new CourseCoupleDto(courseCoupleService.createItem(couple), payingUsers.contains(couple.getGent()), payingUsers.contains(couple.getLady()));
        } else {
            return new CourseCoupleDto(courseCoupleService.updateItem(couple), payingUsers.contains(couple.getGent()), payingUsers.contains(couple.getLady()));
        }
    }

    @DeleteMapping("/{couple-id}")
    public void deleteById(@PathVariable("couple-id") long coupleId) {
        log.info("Deleting couple with id {}", coupleId);
        Couple item = courseCoupleService.readItem(coupleId);
        courseCoupleService.deleteItem(item);
    }

    @GetMapping("/unpaired-gents/{course-id}")
    public List<UserDto> findUnpairedGents(@PathVariable("course-id") long courseId) {
        List<Long> pairedGentsIds = new ArrayList<>();
        List<Couple> couples = courseCoupleService.listItems(courseId);
        for (Couple couple : couples) {
            pairedGentsIds.add(couple.getGent().getId());
        }
        List<User> payingUsers = courseRegistrationService.listPayingUsers(courseId);
        return payingUsers.stream()
                .filter(user -> user.getSex() == Sex.MALE)
                .filter(user -> !pairedGentsIds.contains(user.getId()))
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/unpaired-ladies/{course-id}")
    public List<UserDto> findUnpairedLadies(@PathVariable("course-id") long courseId) {
        List<Long> pairedLadiesIds = new ArrayList<>();
        List<Couple> couples = courseCoupleService.listItems(courseId);
        for (Couple couple : couples) {
            pairedLadiesIds.add(couple.getLady().getId());
        }
        List<User> payingUsers = courseRegistrationService.listPayingUsers(courseId);
        return payingUsers.stream()
                .filter(user -> user.getSex() == Sex.FEMALE)
                .filter(user -> !pairedLadiesIds.contains(user.getId()))
                .map(UserDto::new)
                .toList();
    }

    @GetMapping("/possible-guest-gents/{course-id}")
    public List<UserDto> findPossibleGuestGents(@PathVariable("course-id") long courseId) {
        Map<Long, User> possibleGents = userService.list().stream()
                .filter(user -> user.getSex() == Sex.MALE)
                .collect(Collectors.toMap(User::getId, Function.identity()));
        // Remove all gents that are already paired.
        List<Couple> couples = courseCoupleService.listItems(courseId);
        for (Couple couple : couples) {
            possibleGents.remove(couple.getGent().getId());
        }
        // Remove the gents that are registered (They are provided by findUnpairedGents)
        List<User> payingUsers = courseRegistrationService.listPayingUsers(courseId);
        payingUsers.stream()
                .filter(user -> user.getSex() == Sex.MALE)
                .forEach(user -> possibleGents.remove(user.getId()));
        // Map what's left to UserDto
        return possibleGents.values().stream()
                .map(UserDto::new)
                .toList();
    }

    @GetMapping("/possible-guest-ladies/{course-id}")
    public List<UserDto> findPossibleGuestLadies(@PathVariable("course-id") long courseId) {
        Map<Long, User> possibleLadies = userService.list().stream()
                .filter(user -> user.getSex() == Sex.FEMALE)
                .collect(Collectors.toMap(User::getId, Function.identity()));
        // Remove all ladies that are already paired.
        List<Couple> couples = courseCoupleService.listItems(courseId);
        for (Couple couple : couples) {
            possibleLadies.remove(couple.getLady().getId());
        }
        // Remove the ladies that are registered (They are provided by findUnpairedLadies)
        List<User> payingUsers = courseRegistrationService.listPayingUsers(courseId);
        payingUsers.stream()
                .filter(user -> user.getSex() == Sex.FEMALE)
                .forEach(user -> possibleLadies.remove(user.getId()));
        // Map what's left to UserDto
        return possibleLadies.values().stream()
                .map(UserDto::new)
                .toList();
    }

}
