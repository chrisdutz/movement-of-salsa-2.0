package com.toddysoft.ui.permissions.api;

public interface TermFunction<T> {

    String getName();

    String getDescription();

    TermType[] getArgTypes();

    Term<T> createTerm(Term<?>[] args);

}
