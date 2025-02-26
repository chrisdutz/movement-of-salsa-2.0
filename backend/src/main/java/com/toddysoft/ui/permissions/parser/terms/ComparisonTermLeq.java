package com.toddysoft.ui.permissions.parser.terms;

import com.toddysoft.ui.permissions.api.Term;
import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Objects;

public class ComparisonTermLeq extends ComparisonTerm {

    private final Term<Number> termA;
    private final Term<Number> termB;

    public ComparisonTermLeq(@NonNull Term<Number> termA, @NonNull Term<Number> termB) {
        this.termA = Objects.requireNonNull(termA);
        this.termB = Objects.requireNonNull(termB);
    }

    @Override
    public Boolean evaluate(Map<String, Object> context) {
        return termA.evaluate(context).doubleValue() <= termB.evaluate(context).doubleValue();
    }

}
