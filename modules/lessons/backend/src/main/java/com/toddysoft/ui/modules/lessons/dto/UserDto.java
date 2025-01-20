package com.toddysoft.ui.modules.lessons.dto;

import com.toddysoft.ui.security.entity.Sex;

public class UserDto {

    private long id;
    private String name;
    private Sex sex;

    public UserDto() {
    }

    public UserDto(long id, String name, Sex sex) {
        this.id = id;
        this.name = name;
        this.sex = sex;
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
}
