
package com.toddysoft.ui.modules.lessons.controller;

import com.toddysoft.ui.components.admin.AdminController;
import com.toddysoft.ui.modules.lessons.dto.CourseDto;
import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.modules.lessons.entity.CourseType;
import com.toddysoft.ui.modules.lessons.entity.Lesson;
import com.toddysoft.ui.modules.lessons.service.CourseService;
import com.toddysoft.ui.modules.lessons.service.CourseTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/courses")
public class CourseController implements AdminController<CourseDto> {

    private final CourseService courseService;
    private final CourseTypeService courseTypeService;

    public CourseController(CourseService courseService, CourseTypeService courseTypeService) {
        this.courseService = courseService;
        this.courseTypeService = courseTypeService;
    }

    @GetMapping
    public List<CourseDto> findAll() {
        return courseService.listItems().stream().map(course -> new CourseDto(course.getId(), course.isClosed(), course.getCourseType().getId(), course.getCourseType().getCode(), course.getLessons())).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public CourseDto findById(@PathVariable("id") long id) {
        Course entity = courseService.readItem(id);
        return new CourseDto(entity.getId(), entity.isClosed(), entity.getCourseType().getId(), entity.getCourseType().getCode(), entity.getLessons());
    }

    @PostMapping
    public CourseDto save(@RequestBody CourseDto item) {
        CourseType courseType = courseTypeService.readItem(item.getCourseTypeId());

        // Save the entity.
        Course course;
        if (item.getId() <= 0) {
            course = new Course();
            course.setId(0);
        } else {
            course = courseService.readItem(item.getId());
        }

        course.setClosed(item.isClosed());
        course.setCourseType(courseType);
        List<Lesson> newLessons = item.getLessons();
        newLessons.forEach(lesson -> {
            if(lesson.getId() < 0) {
                lesson.setId(0);
            }
            lesson.setCourse(course);
        });
        if(course.getLessons() == null) {
            course.setLessons(new ArrayList<>());
        } else {
            course.getLessons().clear();
        }
        course.getLessons().addAll(newLessons);

        Course persistedCourse;
        if(course.getId() == 0) {
            persistedCourse = courseService.createItem(course);
        } else {
            persistedCourse = courseService.updateItem(course);
        }
        return new CourseDto(persistedCourse.getId(), persistedCourse.isClosed(), persistedCourse.getCourseType().getId(),
                persistedCourse.getCourseType().getCode(), persistedCourse.getLessons());
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable("id") long id) {
        Course item = courseService.readItem(id);
        courseService.deleteItem(item);
    }

}
