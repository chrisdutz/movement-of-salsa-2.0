package com.toddysoft.ui.permissions.parser.terms;

import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Objects;

public class NumericTermValue implements NumericTerm {

    private final Number value;

    public NumericTermValue(@NonNull Number value) {
        this.value = Objects.requireNonNull(value);
    }

    @Override
    public Double evaluate(Map<String, Object> context) {
        return value.doubleValue();
    }

}
