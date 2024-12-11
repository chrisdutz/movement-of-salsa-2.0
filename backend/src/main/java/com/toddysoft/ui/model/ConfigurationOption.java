
package com.toddysoft.ui.model;

public class ConfigurationOption {

    public final String name;
    public final String typeName;
    public final boolean required;
    public final Object defaultValue;

    public ConfigurationOption(String name, String typeName, boolean required, Object defaultValue) {
        this.name = name;
        this.typeName = typeName;
        this.required = required;
        this.defaultValue = defaultValue;
    }

    public String getName() {
        return name;
    }

    public String getTypeName() {
        return typeName;
    }

    public boolean isRequired() {
        return required;
    }

    public Object getDefaultValue() {
        return defaultValue;
    }

}
