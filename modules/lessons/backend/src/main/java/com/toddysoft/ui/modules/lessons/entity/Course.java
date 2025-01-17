package com.toddysoft.ui.modules.lessons.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "lessons_course")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected long id;

    protected boolean closed;

    @ManyToOne
    protected CourseType courseType;

    @OrderBy("startTime")
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    protected List<Lesson> lessons;

    public Course() {
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

    public CourseType getCourseType() {
        return courseType;
    }

    public void setCourseType(CourseType courseType) {
        this.courseType = courseType;
    }

    public List<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

    @JsonIgnore
    public Lesson getFirstLesson() {
        if(lessons != null) {
            Lesson first = null;
            for(Lesson lesson : lessons) {
                if((first == null) || lesson.getStartTime().before(first.getStartTime())) {
                    first = lesson;
                }
            }
            return first;
        }
        return null;
    }

    @JsonIgnore
    public Lesson getLastLesson() {
        if(lessons != null) {
            Lesson last = null;
            for(Lesson lesson : lessons) {
                if((last == null) || lesson.getStartTime().after(last.getStartTime())) {
                    last = lesson;
                }
            }
            return last;
        }
        return null;
    }
}
