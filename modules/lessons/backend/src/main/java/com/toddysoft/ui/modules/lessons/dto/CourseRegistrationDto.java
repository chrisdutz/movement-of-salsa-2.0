package com.toddysoft.ui.modules.lessons.dto;

import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.modules.lessons.entity.CourseRegistration;
import com.toddysoft.ui.modules.lessons.types.CourseRegistrationType;
import com.toddysoft.ui.security.entity.User;

import java.time.LocalDateTime;
import java.util.Optional;

public class CourseRegistrationDto {

    protected long id;
    protected Long courseId;
    protected LocalDateTime courseStartDate;
    protected String courseTypeCode;
    protected CourseRegistrationType courseRegistrationType;
    protected String rateName;
    protected UserDto registrar;
    protected Optional<UserDto> partner;
    protected Float price;
    protected Float discount;
    protected String discountRemarks;
    protected String remarks;

    public CourseRegistrationDto() {
    }

    public CourseRegistrationDto(long id, Long courseId, LocalDateTime courseStartDate, String courseTypeCode, CourseRegistrationType courseRegistrationType, String rateName, UserDto registrar, Optional<UserDto> partner, Float price, Float discount, String discountRemarks, String remarks) {
        this.id = id;
        this.courseId = courseId;
        this.courseStartDate = courseStartDate;
        this.courseTypeCode = courseTypeCode;
        this.courseRegistrationType = courseRegistrationType;
        this.rateName = rateName;
        this.registrar = registrar;
        this.partner = partner;
        this.price = price;
        this.discount = discount;
        this.discountRemarks = discountRemarks;
        this.remarks = remarks;
    }

    public CourseRegistrationDto(CourseRegistration courseRegistration) {
        User registrarUser = courseRegistration.getRegistrar();
        User partnerUser = courseRegistration.getPartner();
        this.id = courseRegistration.getId();
        this.courseId = courseRegistration.getId();
        this.courseStartDate = courseRegistration.getCourse().getFirstLesson().getStartTime();
        this.courseTypeCode = courseRegistration.getCourse().getCourseType().getCode();
        this.courseRegistrationType = courseRegistration.getCourseRegistrationType();
        this.rateName = courseRegistration.getRateName();
        this.registrar = new UserDto(registrarUser);
        if(courseRegistration.getCourseRegistrationType() == CourseRegistrationType.COUPLE && partnerUser != null) {
            this.partner = Optional.of(new UserDto(partnerUser));
        } else {
            this.partner = Optional.empty();
        }
        this.price = courseRegistration.getPrice();
        this.discount = courseRegistration.getDiscount();
        this.discountRemarks = courseRegistration.getDiscountRemarks();
        this.remarks = courseRegistration.getRemarks();
    }

    public CourseRegistration toEntity() {
        CourseRegistration courseRegistration = new CourseRegistration();
        courseRegistration.setId(id);
        Course course = new Course();
        course.setId(courseId);
        courseRegistration.setCourse(course);
        courseRegistration.setCourseRegistrationType(courseRegistrationType);
        courseRegistration.setRateName(rateName);
        courseRegistration.setRegistrar(registrar.toEntity());
        if((courseRegistration.getCourseRegistrationType() == CourseRegistrationType.COUPLE) && (partner.isPresent())){
            courseRegistration.setPartner(partner.get().toEntity());
        }
        courseRegistration.setRemarks(remarks);
        courseRegistration.setPrice(price);
        courseRegistration.setDiscount(discount);
        courseRegistration.setDiscountRemarks(discountRemarks);
        return courseRegistration;
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

    public LocalDateTime getCourseStartDate() {
        return courseStartDate;
    }

    public void setCourseStartDate(LocalDateTime courseStartDate) {
        this.courseStartDate = courseStartDate;
    }

    public String getCourseTypeCode() {
        return courseTypeCode;
    }

    public void setCourseTypeCode(String courseTypeCode) {
        this.courseTypeCode = courseTypeCode;
    }

    public CourseRegistrationType getCourseRegistrationType() {
        return courseRegistrationType;
    }

    public void setCourseRegistrationType(CourseRegistrationType courseRegistrationType) {
        this.courseRegistrationType = courseRegistrationType;
    }

    public String getRateName() {
        return rateName;
    }

    public void setRateName(String rateName) {
        this.rateName = rateName;
    }

    public UserDto getRegistrar() {
        return registrar;
    }

    public void setRegistrar(UserDto registrar) {
        this.registrar = registrar;
    }

    public Optional<UserDto> getPartner() {
        return partner;
    }

    public void setPartner(Optional<UserDto> partner) {
        this.partner = partner;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Float getDiscount() {
        return discount;
    }

    public void setDiscount(Float discount) {
        this.discount = discount;
    }

    public String getDiscountRemarks() {
        return discountRemarks;
    }

    public void setDiscountRemarks(String discountRemarks) {
        this.discountRemarks = discountRemarks;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
