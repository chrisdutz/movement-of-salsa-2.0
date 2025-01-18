package com.toddysoft.ui.modules.lessons.service;

import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.modules.lessons.repository.CourseRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class CourseService
{
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    //////////////////////////////////////////////
    // Service methods.
    //////////////////////////////////////////////

    @Transactional
    public Course createItem(Course course) {
        return courseRepository.save(course);
    }

    @Transactional(readOnly = true)
    public Course readItem(long newsEntryId) {
        return courseRepository.getReferenceById(newsEntryId);
    }

    @Transactional
    public Course updateItem(Course course) {
        return courseRepository.save(course);
    }

    @Transactional
    public void deleteItem(Course course) {
        courseRepository.delete(course);
    }

    @Transactional(readOnly = true)
    public List<Course> listItems() {
        return courseRepository.findAll();
    }

}