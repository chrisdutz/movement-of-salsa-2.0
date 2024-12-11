package com.toddysoft.ui.permissions.parser.terms;

import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Objects;

public class NumericTermVar implements NumericTerm {

    private final VariableTerm variableTerm;

    public NumericTermVar(@NonNull VariableTerm variableTerm) {
        this.variableTerm = Objects.requireNonNull(variableTerm);
    }

    public VariableTerm getVariableTerm() {
        return variableTerm;
    }

    @Override
    public Double evaluate(Map<String, Object> context) {
        if(!context.containsKey(variableTerm.getName())) {
            throw new IllegalArgumentException("Variable '" + variableTerm.getName() + "' not found in context");
        }
        Object root = context.get(variableTerm.getName());
        Object result = variableTerm.evaluate(root);
        if(!(result instanceof Number)) {
            throw new IllegalArgumentException("Variable value of " + variableTerm.getName() + " is not a numeric value");
        }
        return ((Number) result).doubleValue();
    }

}
