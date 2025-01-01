package com.toddysoft.ui.permissions.functions;

import com.toddysoft.ui.permissions.api.Term;
import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.TermType;
import com.toddysoft.ui.permissions.parser.terms.BooleanTerm;
import com.toddysoft.ui.security.entity.User;

public class LoggedInFunction implements TermFunction<Boolean>
{

    @Override
    public String getName() {
        return "LoggedIn";
    }

    @Override
    public String getDescription() {
        return "LoggedIn()";
    }

    @Override
    public TermType[] getArgTypes() {
        return new TermType[] {};
    }

    @Override
    public BooleanTerm createTerm(Term<?>[] args) {
        return context -> {
            if(context == null) {
                return false;
            }

            final Object userObj = context.get("user");
            return userObj instanceof User;
        };
    }
}
