package com.toddysoft.ui.permissions.functions;

import com.toddysoft.ui.permissions.api.Term;
import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.TermType;
import com.toddysoft.ui.permissions.parser.terms.BooleanTerm;
import com.toddysoft.ui.permissions.parser.terms.NumericTerm;
import com.toddysoft.ui.permissions.parser.terms.StringTerm;

public class StringLengthFunction implements TermFunction<Number>
{

    @Override
    public String getName() {
        return "StringLength";
    }

    @Override
    public String getDescription() {
        return "StringLength({string})";
    }

    @Override
    public TermType[] getArgTypes() {
        return new TermType[] {TermType.STRING};
    }

    @Override
    public NumericTerm createTerm(Term<?>[] args) {
        return context -> {
            String str = ((StringTerm) args[0]).evaluate(context);
            if(str == null) {
                return 0;
            }
            return str.length();
        };
    }
}