package com.toddysoft.ui.modules.lessons.dto;

import com.toddysoft.ui.security.entity.Sex;
import com.toddysoft.ui.security.entity.User;

public class UserDto {

    protected long id;
    protected String firstName;
    protected String lastName;
    protected Sex sex;
    protected Integer size;

    public UserDto() {
    }

    public UserDto(long id, String firstName, String lastName, Sex sex, Integer size) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.sex = sex;
        this.size = size;
    }

    public UserDto(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.sex = user.getSex();
        this.size = user.getSize();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Sex getSex() {
        return sex;
    }

    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}
