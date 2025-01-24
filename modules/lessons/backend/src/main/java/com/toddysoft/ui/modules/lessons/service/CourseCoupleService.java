package com.toddysoft.ui.modules.lessons.service;

import com.toddysoft.ui.modules.lessons.dto.CourseCoupleDto;
import com.toddysoft.ui.modules.lessons.entity.Couple;
import com.toddysoft.ui.modules.lessons.entity.CourseRegistration;
import com.toddysoft.ui.modules.lessons.repository.CourseCoupleRepository;
import com.toddysoft.ui.modules.lessons.repository.CourseRegistrationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class CourseCoupleService
{
    private final Logger logger = LoggerFactory.getLogger(CourseCoupleService.class);

    private final CourseCoupleRepository courseCoupleRepository;

    public CourseCoupleService(CourseCoupleRepository courseCoupleRepository) {
        this.courseCoupleRepository = courseCoupleRepository;
    }

    //////////////////////////////////////////////
    // Service methods.
    //////////////////////////////////////////////

    @Transactional
    public Couple createItem(Couple couple) {
        return courseCoupleRepository.save(couple);
    }

    @Transactional(readOnly = true)
    public Couple readItem(long id) {
        return courseCoupleRepository.getReferenceById(id);
    }

    @Transactional
    public Couple updateItem(Couple couple) {
        return courseCoupleRepository.save(couple);
    }

    @Transactional
    public void deleteItem(Couple couple) {
        courseCoupleRepository.delete(couple);
    }

    @Transactional(readOnly = true)
    public List<Couple> listItems(long courseId) {
        return courseCoupleRepository.findByCourse_Id(courseId);
    }

}