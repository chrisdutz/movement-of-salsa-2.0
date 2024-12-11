
package com.toddysoft.ui.modules.news.controller;

import com.toddysoft.ui.modules.news.entity.NewsEntry;
import com.toddysoft.ui.modules.news.service.NewsService;
import org.springframework.http.ResponseEntity;
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
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsEntry> getNewsEntryById(@PathVariable(name = "id") Long id) {
        NewsEntry newsEntry = newsService.readItem(id);
        return ResponseEntity.ok(newsEntry);
    }

    @GetMapping
    public ResponseEntity<List<NewsEntry>> getAllNewsEntries() {
        List<NewsEntry> allDevices = newsService.listItems();
        return ResponseEntity.ok(allDevices);
    }

    @PostMapping
    public ResponseEntity<NewsEntry> saveNewsEntry(@RequestBody NewsEntry newsEntry) {
        if (newsEntry.getId() == 0) {
            newsEntry = newsService.createItem(newsEntry);
        } else {
            newsEntry = newsService.updateItem(newsEntry);
        }
        return ResponseEntity.ok(newsEntry);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteNewsEntry(@RequestBody NewsEntry newsEntry) {
        newsService.deleteItem(newsEntry);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/read/{id}")
    public ResponseEntity<NewsEntry> readNewsEntry(@PathVariable(name = "id") Long id) {
        NewsEntry newsEntry = newsService.readItem(id);
        return ResponseEntity.ok(newsEntry);
    }

}
