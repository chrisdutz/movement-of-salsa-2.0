package com.toddysoft.ui.modules.lessons.dto;

import com.toddysoft.ui.modules.lessons.entity.Couple;

public class CourseCoupleDto {

    protected long id;
    protected Long courseId;
    protected UserDto gent;
    protected boolean gentPaying;
    protected UserDto lady;
    protected boolean ladyPaying;
    protected boolean confirmed;
    protected String remarks;

    public CourseCoupleDto() {
    }

    public CourseCoupleDto(long id, Long courseId, UserDto gent, boolean gentPaying, UserDto lady, boolean ladyPaying, boolean confirmed, String remarks) {
        this.id = id;
        this.courseId = courseId;
        this.gent = gent;
        this.gentPaying = gentPaying;
        this.lady = lady;
        this.ladyPaying = ladyPaying;
        this.confirmed = confirmed;
        this.remarks = remarks;
    }

    public CourseCoupleDto(Couple couple, boolean gentPaying, boolean ladyPaying) {
        this.id = couple.getId();
        this.courseId = couple.getCourse().getId();
        if(couple.getGent() != null) {
            this.gent = new UserDto(couple.getGent());
        } else {
            this.lady = new UserDto();
        }
        this.gentPaying = gentPaying;
        if(couple.getLady() != null) {
            this.lady = new UserDto(couple.getLady());
        } else {
            this.lady = new UserDto();
        }
        this.ladyPaying = ladyPaying;
        this.confirmed = couple.isConfirmed();
        this.remarks = couple.getDescription();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public UserDto getGent() {
        return gent;
    }

    public void setGent(UserDto gent) {
        this.gent = gent;
    }

    public boolean isGentPaying() {
        return gentPaying;
    }

    public void setGentPaying(boolean gentPaying) {
        this.gentPaying = gentPaying;
    }

    public UserDto getLady() {
        return lady;
    }

    public void setLady(UserDto lady) {
        this.lady = lady;
    }

    public boolean isLadyPaying() {
        return ladyPaying;
    }

    public void setLadyPaying(boolean ladyPaying) {
        this.ladyPaying = ladyPaying;
    }

    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
