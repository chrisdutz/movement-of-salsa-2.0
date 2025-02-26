package com.toddysoft.ui.modules.lessons.service;

import com.toddysoft.ui.image.entity.Image;
import com.toddysoft.ui.image.service.ImageService;
import com.toddysoft.ui.modules.lessons.entity.CourseType;
import com.toddysoft.ui.modules.lessons.repository.CourseTypeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class CourseTypeService
{
    private final CourseTypeRepository courseTypeRepository;
    private final ImageService imageService;

    public CourseTypeService(CourseTypeRepository courseTypeRepository, ImageService imageService) {
        this.courseTypeRepository = courseTypeRepository;
        this.imageService = imageService;
    }

    //////////////////////////////////////////////
    // Service methods.
    //////////////////////////////////////////////

    @Transactional
    public CourseType createItem(CourseType courseType) {
        // If some image-data was provided ... resize it.
        if((courseType.getImage() != null) && (courseType.getImage().getImageData() != null)) {
            final Image resizedImage = imageService.resizeImage(courseType.getImage().getImageData(), 240, 240);
            courseType.setImage(resizedImage);
        }

        return courseTypeRepository.save(courseType);
    }

    @Transactional(readOnly = true)
    public CourseType readItem(long id) {
        return courseTypeRepository.getReferenceById(id);
    }

    @Transactional
    public CourseType updateItem(CourseType courseType) {
        // If some image-data was provided ... resize it.
        if((courseType.getImage() != null) && (courseType.getImage().getImageData() != null)) {
            final Image resizedImage = imageService.resizeImage(courseType.getImage().getImageData(), 240, 240);
            courseType.setImage(resizedImage);
        }
        return courseTypeRepository.save(courseType);
    }

    @Transactional
    public void deleteItem(CourseType courseType) {
        courseTypeRepository.delete(courseType);
    }

    @Transactional(readOnly = true)
    public List<CourseType> listItems() {
        return courseTypeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<CourseType> listNotHiddenItems() {
        return courseTypeRepository.findByHiddenOrderByListOrder(false);
    }

}