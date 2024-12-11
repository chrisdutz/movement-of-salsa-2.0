package com.toddysoft.ui.permissions.parser.terms;

import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Objects;

public class StringTermValue implements StringTerm {

    private final String value;

    public StringTermValue(@NonNull String value) {
        this.value = Objects.requireNonNull(value);
    }

    @Override
    public String evaluate(Map<String, Object> context) {
        return value;
    }

}
