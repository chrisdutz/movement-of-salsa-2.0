
package com.toddysoft.ui.modules.news.controller;

import com.toddysoft.ui.components.admin.AdminController;
import com.toddysoft.ui.modules.news.entity.NewsEntry;
import com.toddysoft.ui.modules.news.service.NewsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

//@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/news")
public class NewsController implements AdminController<NewsEntry> {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public List<NewsEntry> findAll() {
        return newsService.listItems();
    }

    @GetMapping("/{id}")
    public NewsEntry findById(@PathVariable long id) {
        return newsService.readItem(id);
    }

    @PostMapping
    public NewsEntry save(@RequestBody NewsEntry item) {
        if (item.getId() == 0) {
            return newsService.createItem(item);
        } else {
            return newsService.updateItem(item);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable long id) {
        NewsEntry newsEntry = newsService.readItem(id);
        newsService.deleteItem(newsEntry);
    }

}
