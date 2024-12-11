package com.toddysoft.ui.permissions.parser.terms;

import com.toddysoft.ui.permissions.api.Term;
import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Objects;

public class BooleanTermNot implements BooleanTerm {

    private final Term<Boolean> termA;

    public BooleanTermNot(@NonNull Term<Boolean> termA) {
        this.termA = Objects.requireNonNull(termA);
    }

    @Override
    public Boolean evaluate(Map<String, Object> context) {
        return !termA.evaluate(context);
    }

}
