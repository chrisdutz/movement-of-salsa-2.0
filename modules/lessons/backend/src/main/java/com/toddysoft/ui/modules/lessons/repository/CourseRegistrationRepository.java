package com.toddysoft.ui.modules.lessons.repository;

import com.toddysoft.ui.modules.lessons.entity.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {
    List<CourseRegistration> findByCourse_Id(long courseId);
}
