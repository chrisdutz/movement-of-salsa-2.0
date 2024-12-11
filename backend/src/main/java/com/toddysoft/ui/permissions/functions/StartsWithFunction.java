package com.toddysoft.ui.permissions.functions;

import com.toddysoft.ui.permissions.api.Term;
import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.TermType;
import com.toddysoft.ui.permissions.parser.terms.BooleanTerm;
import com.toddysoft.ui.permissions.parser.terms.StringTerm;

public class StartsWithFunction implements TermFunction<Boolean>
{

    @Override
    public String getName() {
        return "StartsWith";
    }

    @Override
    public String getDescription() {
        return "StartsWith({string}, {reference-string})";
    }

    @Override
    public TermType[] getArgTypes() {
        return new TermType[] {TermType.STRING, TermType.STRING};
    }

    @Override
    public BooleanTerm createTerm(Term<?>[] args) {
        return context -> {
            String str = ((StringTerm) args[0]).evaluate(context);
            if(str == null) {
                return false;
            }
            String reference = ((StringTerm) args[1]).evaluate(context);
            if(reference == null) {
                return false;
            }
            return str.startsWith(reference);
        };
    }
}