package com.toddysoft.ui.validation.utils;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Base64;

@Converter
public class Base64ToBlobConverter implements AttributeConverter<String, byte[]> {

    @Override
    public byte[] convertToDatabaseColumn(String attribute) {
        if (attribute == null) return null;
        return Base64.getDecoder().decode(attribute);
    }

    @Override
    public String convertToEntityAttribute(byte[] dbData) {
        if (dbData == null) return null;
        return Base64.getEncoder().encodeToString(dbData);
    }

}
