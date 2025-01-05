package com.toddysoft.ui.modules.news.entity;


import jakarta.persistence.*;

import java.util.Calendar;

@Entity
@Table(name="news_news_entry")
public class NewsEntry {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    protected long id;

    protected long listPosition;

    protected String title;

    @Temporal(TemporalType.TIMESTAMP)
    protected Calendar newsStartDate;
    @Temporal(TemporalType.TIMESTAMP)
    protected Calendar newsEndDate;

    @Lob
    protected String description;

    public NewsEntry() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getListPosition() {
        return listPosition;
    }

    public void setListPosition(long listPosition) {
        this.listPosition = listPosition;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Calendar getNewsStartDate() {
        return newsStartDate;
    }

    public void setNewsStartDate(Calendar newsStartDate) {
        this.newsStartDate = newsStartDate;
    }

    public Calendar getNewsEndDate() {
        return newsEndDate;
    }

    public void setNewsEndDate(Calendar newsEndDate) {
        this.newsEndDate = newsEndDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}