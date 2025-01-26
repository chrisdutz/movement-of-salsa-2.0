package com.toddysoft.ui.modules.lessons.dto;

import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.modules.lessons.entity.Lesson;

import java.util.Calendar;
import java.util.List;

public class CourseDto {

    protected long id;
    protected boolean closed;
    protected Long courseTypeId;
    protected String courseTypeCode;
    protected List<Lesson> lessons;

    public CourseDto() {
    }

    public CourseDto(long id, boolean closed, Long courseTypeId, String courseTypeCode, List<Lesson> lessons) {
        this.id = id;
        this.closed = closed;
        this.courseTypeId = courseTypeId;
        this.courseTypeCode = courseTypeCode;
        this.lessons = lessons;
    }

    public CourseDto(Course course) {
        this.id = course.getId();
        this.closed = course.isClosed();
        this.courseTypeId = course.getCourseType().getId();
        this.courseTypeCode = course.getCourseType().getCode();
        this.lessons = course.getLessons();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public boolean isClosed() {
        return closed;
    }

    public void setClosed(boolean closed) {
        this.closed = closed;
    }

    public Long getCourseTypeId() {
        return courseTypeId;
    }

    public void setCourseTypeId(Long courseTypeId) {
        this.courseTypeId = courseTypeId;
    }

    public String getCourseTypeCode() {
        return courseTypeCode;
    }

    public void setCourseTypeCode(String courseTypeCode) {
        this.courseTypeCode = courseTypeCode;
    }

    public List<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

}
