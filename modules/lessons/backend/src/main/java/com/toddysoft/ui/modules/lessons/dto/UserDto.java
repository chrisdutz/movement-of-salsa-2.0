package com.toddysoft.ui.modules.lessons.dto;

import com.toddysoft.ui.security.entity.Sex;
import com.toddysoft.ui.security.entity.User;

public class UserDto {

    protected long id;
    protected String firstName;
    protected String lastName;
    protected Sex sex;
    protected Integer size;

    protected String email;
    protected String street;
    protected String zip;
    protected String city;
    protected String country;
    protected String phone;

    public UserDto() {
    }

    public UserDto(long id, String firstName, String lastName, Sex sex, Integer size, String email, String street, String zip, String city, String country, String phone) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.sex = sex;
        this.size = size;
        this.email = email;
        this.street = street;
        this.zip = zip;
        this.city = city;
        this.country = country;
        this.phone = phone;
    }

    public UserDto(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.sex = user.getSex();
        this.size = user.getSize();
        this.email = user.getEmail();
        this.street = user.getStreet();
        this.zip = user.getZip();
        this.city = user.getCity();
        this.country = user.getCountry();
        this.phone = user.getPhone();
    }

    public User toEntity() {
        User user = new User();
        user.setId(id);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setSex(sex);
        user.setSize(size);
        user.setEmail(email);
        user.setStreet(street);
        user.setZip(zip);
        user.setCity(city);
        user.setCountry(country);
        user.setPhone(phone);
        return user;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
