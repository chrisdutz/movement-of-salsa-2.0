package com.toddysoft.ui.permissions.api;

import java.util.Map;

public interface Term<T> {

    T evaluate(Map<String, Object> context);

}
