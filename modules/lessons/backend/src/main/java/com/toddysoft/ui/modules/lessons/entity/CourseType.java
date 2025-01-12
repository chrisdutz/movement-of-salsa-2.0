package com.toddysoft.ui.modules.lessons.entity;

import com.toddysoft.ui.image.entity.Image;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "lessons_course_type")
public class CourseType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected long id;

    protected long listOrder;

    protected String code;

    protected String title;

    @Lob
    protected String description;

    @Embedded
    protected Image image;

    @OneToMany(mappedBy = "courseType", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("listOrder")
    protected List<CourseTypeRate> rates;

    public CourseType() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getListOrder() {
        return listOrder;
    }

    public void setListOrder(long listOrder) {
        this.listOrder = listOrder;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public List<CourseTypeRate> getRates() {
        return rates;
    }

    public void setRates(List<CourseTypeRate> rates) {
        this.rates = rates;
    }

}
