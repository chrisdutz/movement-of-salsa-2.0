package com.toddysoft.ui.permissions.parser.terms;

import com.toddysoft.ui.permissions.api.Term;
import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Objects;

public class BooleanTermAnd implements BooleanTerm {

    private final Term<Boolean> termA;
    private final Term<Boolean> termB;

    public BooleanTermAnd(@NonNull Term<Boolean> termA, @NonNull Term<Boolean> termB) {
        this.termA = Objects.requireNonNull(termA);
        this.termB = Objects.requireNonNull(termB);
    }

    @Override
    public Boolean evaluate(Map<String, Object> context) {
        return termA.evaluate(context) && termB.evaluate(context);
    }

}
