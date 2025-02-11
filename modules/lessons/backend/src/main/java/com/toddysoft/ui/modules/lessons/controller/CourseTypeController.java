
package com.toddysoft.ui.modules.lessons.controller;

import com.toddysoft.ui.components.admin.AdminController;
import com.toddysoft.ui.modules.lessons.entity.CourseType;
import com.toddysoft.ui.modules.lessons.service.CourseTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/course-types")
public class CourseTypeController implements AdminController<CourseType> {

    private final CourseTypeService courseTypeService;

    public CourseTypeController(CourseTypeService courseTypeService) {
        this.courseTypeService = courseTypeService;
    }

    @GetMapping
    public List<CourseType> findAll() {
        return courseTypeService.listItems();
    }

    @GetMapping("/not-hidden")
    public List<CourseType> findAllNotHidden() {
        return courseTypeService.listNotHiddenItems();
    }

    @GetMapping("/{id}")
    public CourseType findById(@PathVariable("id") long id) {
        return courseTypeService.readItem(id);
    }

    @PostMapping
    public CourseType save(@RequestBody CourseType item) {
        // Link the course-type objects.
        item.getRates().forEach(courseTypeRate -> courseTypeRate.setCourseType(item));

        // Save the entity.
        if (item.getId() == 0) {
            return courseTypeService.createItem(item);
        } else {
            return courseTypeService.updateItem(item);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable("id") long id) {
        CourseType item = courseTypeService.readItem(id);
        courseTypeService.deleteItem(item);
    }

}
