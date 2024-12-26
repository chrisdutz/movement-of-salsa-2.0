package com.toddysoft.ui.components.admin;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public interface AdminController<T> {

    @GetMapping
    List<T> findAll();

    @GetMapping("/{id}")
    T findById(@PathVariable long id);

    @PostMapping
    T save(@RequestBody T item);

    @DeleteMapping("/{id}")
    void deleteById(@PathVariable long id);

}
