
package com.toddysoft.ui.modules.news.repository;

import com.toddysoft.ui.modules.news.entity.NewsEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<NewsEntry, Long> {

}
