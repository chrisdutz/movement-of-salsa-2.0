package com.toddysoft.ui.validation.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class JsonToBlobConverter implements AttributeConverter<Object, byte[]> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    static {
        // Configure ObjectMapper to use polymorphic deserialization
        objectMapper.activateDefaultTyping(
                BasicPolymorphicTypeValidator.builder()
                        .allowIfBaseType(Object.class)
                        .build(),
                ObjectMapper.DefaultTyping.EVERYTHING
        );
    }

    @Override
    public byte[] convertToDatabaseColumn(Object attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsBytes(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error serializing payload to JSON", e);
        }
    }

    @Override
    public Object convertToEntityAttribute(byte[] dbData) {
        if (dbData == null || dbData.length == 0) {
            return null;
        }
        try {
            return objectMapper.readValue(dbData, Object.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error deserializing JSON to payload", e);
        }
    }
}
