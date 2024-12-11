package com.toddysoft.ui.modules.news.entity;

//import de.cware.cweb.services.image.model.Image;
//import de.cware.cweb.services.zones.model.Zone;

import jakarta.persistence.*;

import java.util.Calendar;

/**
 * Created by IntelliJ IDEA.
 * User: cdutz
 * Date: 09.04.2010
 * Time: 18:23:41
 */
@Entity
@Table(name="NEWS_NEWS_ENTRY")
public
class NewsEntry
{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    protected long id;

    protected String title;

    @Temporal(TemporalType.TIMESTAMP)
    protected Calendar newsDate;

    @Lob
    protected String description;

/*    @ManyToOne
    protected Zone zone;*/

    //@Embedded
    //protected Image image;

    public NewsEntry() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Calendar getNewsDate() {
        return newsDate;
    }

    public void setNewsDate(Calendar newsDate) {
        this.newsDate = newsDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    /*public Zone getZone() {
        return zone;
    }

    public void setZone(Zone zone) {
        this.zone = zone;
    }*/

    /*public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }*/
}