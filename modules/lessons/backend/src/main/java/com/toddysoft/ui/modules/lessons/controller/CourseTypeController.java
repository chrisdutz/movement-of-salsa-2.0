
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

    @GetMapping("/{id}")
    public CourseType findById(@PathVariable long id) {
        return courseTypeService.readItem(id);
    }

    @PostMapping
    public CourseType save(@RequestBody CourseType item) {
        if (item.getId() == 0) {
            return courseTypeService.createItem(item);
        } else {
            return courseTypeService.updateItem(item);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable long id) {
        CourseType item = courseTypeService.readItem(id);
        courseTypeService.deleteItem(item);
    }

}
