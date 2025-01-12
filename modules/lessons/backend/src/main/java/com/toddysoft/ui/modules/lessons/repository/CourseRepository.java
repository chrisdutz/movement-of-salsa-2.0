package com.toddysoft.ui.modules.lessons.repository;

import com.toddysoft.ui.modules.lessons.entity.Course;
import org.springframework.data.repository.CrudRepository;

public interface CourseRepository extends CrudRepository<Course, Integer> {
}
