package com.toddysoft.ui.modules.lessons.entity;

import com.toddysoft.ui.security.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "lessons_couple")
public class Couple {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected long id;

    @ManyToOne
    private Course course;

    @OneToOne
    private User gent;

    @OneToOne
    private User lady;

    private String description;

    private boolean confirmed;

    public Couple() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public User getGent() {
        return gent;
    }

    public void setGent(User gent) {
        this.gent = gent;
    }

    public User getLady() {
        return lady;
    }

    public void setLady(User lady) {
        this.lady = lady;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }

}
