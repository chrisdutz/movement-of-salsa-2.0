
package com.toddysoft.ui.modules.inspect.model;

import java.util.Map;

public class Transport {

    private final String code;
    private final String name;

    private final Map<String, Object> options;

    public Transport(String code, String name, Map<String, Object> options) {
        this.code = code;
        this.name = name;
        this.options = options;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public Map<String, Object> getOptions() {
        return options;
    }

}
