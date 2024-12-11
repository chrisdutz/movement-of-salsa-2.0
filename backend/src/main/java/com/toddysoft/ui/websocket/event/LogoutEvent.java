package com.toddysoft.ui.websocket.event;

public class LogoutEvent extends UiApplicationEvent<String> {

    public LogoutEvent(String userName) {
        super("security", "logout", userName);
    }

}
