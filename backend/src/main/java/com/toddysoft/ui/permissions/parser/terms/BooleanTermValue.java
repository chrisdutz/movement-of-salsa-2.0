package com.toddysoft.ui.permissions.parser.terms;

import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Objects;

public class BooleanTermValue implements BooleanTerm {

    private final Boolean value;

    public BooleanTermValue(@NonNull Boolean value) {
        this.value = Objects.requireNonNull(value);
    }

    @Override
    public Boolean evaluate(Map<String, Object> context) {
        return value;
    }

}
