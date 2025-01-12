package com.toddysoft.ui.modules.lessons.repository;

import com.toddysoft.ui.modules.lessons.entity.CourseType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseTypeRepository extends JpaRepository<CourseType, Long> {
}
