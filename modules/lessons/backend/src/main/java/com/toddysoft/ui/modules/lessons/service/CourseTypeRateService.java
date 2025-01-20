package com.toddysoft.ui.modules.lessons.service;

import com.toddysoft.ui.modules.lessons.entity.CourseTypeRate;
import com.toddysoft.ui.modules.lessons.repository.CourseTypeRateRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class CourseTypeRateService {

    private final CourseTypeRateRepository courseTypeRateRepository;

    public CourseTypeRateService(CourseTypeRateRepository courseTypeRateRepository) {
        this.courseTypeRateRepository = courseTypeRateRepository;
    }

    @Transactional(readOnly = true)
    public CourseTypeRate readItem(long id) {
        return courseTypeRateRepository.getReferenceById(id);
    }

}
