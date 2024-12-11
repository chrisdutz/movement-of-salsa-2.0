package com.toddysoft.ui.permissions.parser.terms;

import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Objects;

public class StringTermVar implements StringTerm {

    private final VariableTerm variableTerm;

    public StringTermVar(@NonNull VariableTerm variableTerm) {
        this.variableTerm = Objects.requireNonNull(variableTerm);
    }

    public VariableTerm getVariableTerm() {
        return variableTerm;
    }

    @Override
    public String evaluate(Map<String, Object> context) {
        if(!context.containsKey(variableTerm.getName())) {
            throw new IllegalArgumentException("Variable '" + variableTerm.getName() + "' not found in context");
        }
        Object root = context.get(variableTerm.getName());
        Object result = variableTerm.evaluate(root);
        if(!(result instanceof String)) {
            throw new IllegalArgumentException("Variable value of " + variableTerm.getName() + " is not a string value");
        }
        return (String) result;
    }

}
