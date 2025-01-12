package com.toddysoft.ui.modules.lessons.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lessons_course_type_rate")
public class CourseTypeRate implements Comparable<CourseTypeRate> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected long id;

    protected Integer listOrder;

    protected String title;

    protected Float price;

    protected boolean coupleRate;

    @ManyToOne
    protected CourseType courseType;

    public CourseTypeRate() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Integer getListOrder() {
        return listOrder;
    }

    public void setListOrder(Integer listOrder) {
        this.listOrder = listOrder;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public boolean getCoupleRate() {
        return coupleRate;
    }

    public void setCoupleRate(boolean coupleRate) {
        this.coupleRate = coupleRate;
    }

    public CourseType getCourseType() {
        return courseType;
    }

    public void setCourseType(CourseType courseType) {
        this.courseType = courseType;
    }

    @Override
    public int compareTo(CourseTypeRate o) {
        if((getListOrder() == null) && (o.getListOrder() == null)) {
            return 0;
        }
        if(getListOrder() == null) {
            return -1;
        }
        if(o.getListOrder() == null) {
            return 1;
        }
        return getListOrder().compareTo(o.getListOrder());
    }

}
