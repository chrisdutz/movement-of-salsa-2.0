package com.toddysoft.ui.permissions.parser.terms;

import com.toddysoft.ui.permissions.api.Term;
import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Objects;

public class StringTermConcat implements StringTerm {

    private final Term<String> termA;
    private final Term<String> termB;

    public StringTermConcat(@NonNull Term<String> termA, @NonNull Term<String> termB) {
        this.termA = Objects.requireNonNull(termA);
        this.termB = Objects.requireNonNull(termB);
    }

    @Override
    public String evaluate(Map<String, Object> context) {
        return termA.evaluate(context) + termB.evaluate(context);
    }

}
