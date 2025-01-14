package com.toddysoft.ui.modules.lessons.repository;

import com.toddysoft.ui.modules.lessons.entity.CourseType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseTypeRepository extends JpaRepository<CourseType, Long> {
    List<CourseType> findByHiddenOrderByListOrder(boolean hidden);
}
