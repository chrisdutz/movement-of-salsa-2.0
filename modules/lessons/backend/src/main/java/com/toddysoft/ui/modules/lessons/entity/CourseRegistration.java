package com.toddysoft.ui.modules.lessons.entity;

import com.toddysoft.ui.modules.lessons.types.CourseRegistrationType;
import com.toddysoft.ui.security.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "lessons_course_registration")
public class CourseRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected long id;

    @ManyToOne(optional = false)
    protected Course course;

    @Enumerated(EnumType.STRING)
    protected CourseRegistrationType courseRegistrationType;

    protected String rateName;

    @OneToOne(optional = false)
    private User registrar;

    @OneToOne
    private User partner;

    @Lob
    private String remarks;

    private Float price;

    private Float discount;

    @Lob
    private String discountRemarks;

    @Transient
    private CourseTypeRate courseTypeRate;

    public CourseRegistration() {
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

    public User getRegistrar() {
        return registrar;
    }

    public void setRegistrar(User registrar) {
        this.registrar = registrar;
    }

    public User getPartner() {
        return partner;
    }

    public void setPartner(User partner) {
        this.partner = partner;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
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

    public CourseTypeRate getCourseTypeRate() {
        return courseTypeRate;
    }

    public void setCourseTypeRate(CourseTypeRate courseTypeRate) {
        this.courseTypeRate = courseTypeRate;

        // Update some of the derived fields. This is needed in order to de-couple. Otherwise changing the
        // Price of a rate in the future or deleting it, would corrupt the old data.
        this.rateName = courseTypeRate.getTitle();
        this.courseRegistrationType = courseTypeRate.getCoupleRate() ?
                CourseRegistrationType.COUPLE : CourseRegistrationType.SINGLE;
        this.price = courseTypeRate.getPrice();
    }
}
