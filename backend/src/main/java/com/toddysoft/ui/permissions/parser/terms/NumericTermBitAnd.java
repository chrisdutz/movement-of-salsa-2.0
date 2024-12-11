package com.toddysoft.ui.permissions.parser.terms;

import com.toddysoft.ui.permissions.api.Term;
import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Objects;

public class NumericTermBitAnd implements NumericTerm {

    private final Term<Number> termA;
    private final Term<Number> termB;

    public NumericTermBitAnd(@NonNull Term<Number> termA, @NonNull Term<Number> termB) {
        this.termA = Objects.requireNonNull(termA);
        this.termB = Objects.requireNonNull(termB);
    }

    @Override
    public Double evaluate(Map<String, Object> context) {
        return (double) (termA.evaluate(context).longValue() & termB.evaluate(context).longValue());
    }

}
