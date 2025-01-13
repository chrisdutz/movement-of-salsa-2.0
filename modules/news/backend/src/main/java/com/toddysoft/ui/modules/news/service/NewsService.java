package com.toddysoft.ui.modules.news.service;

import com.toddysoft.ui.image.entity.Image;
import com.toddysoft.ui.image.service.ImageService;
import com.toddysoft.ui.modules.news.entity.NewsEntry;
import com.toddysoft.ui.modules.news.repository.NewsRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class NewsService
{
    private final NewsRepository newsRepository;
    private final ImageService imageService;

    public NewsService(NewsRepository newsRepository, ImageService imageService) {
        this.newsRepository = newsRepository;
        this.imageService = imageService;
    }

    //////////////////////////////////////////////
    // Service methods.
    //////////////////////////////////////////////

    @Transactional
    public NewsEntry createItem(NewsEntry newsEntry) {
        // If some image-data was provided ... resize it.
        if((newsEntry.getImage() != null) && (newsEntry.getImage().getImageData() != null)) {
            final Image resizedImage = imageService.resizeImage(newsEntry.getImage().getImageData(), 240, 240);
            newsEntry.setImage(resizedImage);
        }

        return newsRepository.save(newsEntry);
    }

    @Transactional(readOnly = true)
    public NewsEntry readItem(long newsEntryId) {
        return newsRepository.getReferenceById(newsEntryId);
    }

    @Transactional
    public NewsEntry updateItem(NewsEntry newsEntry) {
        // If some image-data was provided ... resize it.
        if((newsEntry.getImage() != null) && (newsEntry.getImage().getImageData() != null)) {
            final Image resizedImage = imageService.resizeImage(newsEntry.getImage().getImageData(), 240, 240);
            newsEntry.setImage(resizedImage);
        }
        return newsRepository.save(newsEntry);
    }

    @Transactional
    public void deleteItem(NewsEntry newsEntry) {
        newsRepository.delete(newsEntry);
    }

    @Transactional(readOnly = true)
    public List<NewsEntry> listItems() {
        return newsRepository.findAll();
    }

}