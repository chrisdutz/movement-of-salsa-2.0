package com.toddysoft.ui.security.exceptions;

public class DuplicateRegistrationException extends Exception {

    public DuplicateRegistrationException(String emailAddress) {
        super("Email address already in use: " + emailAddress);
    }

}
