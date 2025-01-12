package com.toddysoft.ui.image.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public
class Image
{
    private int width;
    private int height;

    @Column(columnDefinition = "LONGTEXT")
    protected String imageData;

    public Image() {
    }

    public Image(int width, int height, String imageData) {
        this.width = width;
        this.height = height;
        this.imageData = imageData;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public String getImageData() {
        return imageData;
    }

    public void setImageData(String imageData) {
        this.imageData = imageData;
    }
}
