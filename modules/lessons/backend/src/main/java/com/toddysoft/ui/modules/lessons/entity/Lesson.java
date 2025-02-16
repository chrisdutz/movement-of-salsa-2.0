package com.toddysoft.ui.modules.lessons.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.toddysoft.ui.modules.lessons.utils.LocalDateTimeConvertFromUTCDeserializer;
import com.toddysoft.ui.modules.lessons.utils.LocalTimeConvertFromUTCDeserializer;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "lessons_lesson")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected long id;

    @Column(name = "start_time")
    @JsonDeserialize(using = LocalDateTimeConvertFromUTCDeserializer.class)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    @JsonDeserialize(using = LocalTimeConvertFromUTCDeserializer.class)
    private LocalTime endTime;

    protected String location;
    protected Double locationLat;
    protected Double locationLon;

    @ManyToOne
    // Ignoring this, as otherwise we'd have a circular json dependency.
    @JsonIgnore
    protected Course course;

    public Lesson() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getLocationLat() {
        return locationLat;
    }

    public void setLocationLat(Double locationLat) {
        this.locationLat = locationLat;
    }

    public Double getLocationLon() {
        return locationLon;
    }

    public void setLocationLon(Double locationLon) {
        this.locationLon = locationLon;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}
