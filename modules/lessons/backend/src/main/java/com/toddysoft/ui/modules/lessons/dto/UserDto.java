package com.toddysoft.ui.modules.lessons.dto;

import com.toddysoft.ui.security.entity.Sex;
import com.toddysoft.ui.security.entity.User;

public class UserDto {

    protected long id;
    protected String name;
    protected Sex sex;
    protected Integer size;

    public UserDto() {
    }

    public UserDto(long id, String name, Sex sex, Integer size) {
        this.id = id;
        this.name = name;
        this.sex = sex;
        this.size = size;
    }

    public UserDto(User user) {
        this.id = user.getId();
        this.name = user.getLastName() + ", " + user.getFirstName();
        this.sex = user.getSex();
        this.size = user.getSize();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
