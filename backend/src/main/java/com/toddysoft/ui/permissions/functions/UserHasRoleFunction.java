package com.toddysoft.ui.permissions.functions;

import com.toddysoft.ui.permissions.api.Term;
import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.TermType;
import com.toddysoft.ui.permissions.parser.terms.BooleanTerm;
import com.toddysoft.ui.security.entity.Role;
import com.toddysoft.ui.security.entity.User;

public class UserHasRoleFunction implements TermFunction<Boolean>
{

    @Override
    public String getName() {
        return "UserHasRole";
    }

    @Override
    public String getDescription() {
        return "UserHasRole({role-name})";
    }

    @Override
    public TermType[] getArgTypes() {
        return new TermType[] {TermType.STRING};
    }

    @Override
    public BooleanTerm createTerm(Term<?>[] args) {
        return context -> {
            if(context == null) {
                return false;
            }

            final Object userObj = context.get("user");
            if((userObj instanceof User user)) {
                final String roleName = (String) args[0].evaluate(context);

                if((roleName != null) && (user.getRoles() != null) && (!user.getRoles().isEmpty())) {
                    for(final Role role : user.getRoles()) {
                        if(role.getName().equals(roleName)) {
                            return true;
                        }
                    }
                }
            }

            return false;
        };
    }
}
