package com.toddysoft.ui.permissions.parser.terms;

import java.util.Map;

public class VariableTermMap extends VariableTerm {

    private final String key;

    public VariableTermMap(String name, VariableTerm child, String key) {
        super(name, child);
        this.key = key;
    }

    public String getKey() {
        return key;
    }

    @Override
    protected Object evaluate(Object value) {
        // Check this value is of type map
        if (!(value instanceof Map<?, ?>)) {
            throw new IllegalArgumentException("Variable term map is no valid map type");
        }

        // Check the desired map key exists
        Map<?, ?> map = (Map<?, ?>) value;
        if(!map.containsKey(key)) {
            throw new IllegalArgumentException("Map doesn't contain '" + key + "'");
        }
        Object curVariableValue = map.get(key);

        // Return the value assigned to the map key
        if(getChild() != null) {
            return getChild().evaluate(getPropertyValue(curVariableValue));
        }
        return curVariableValue;
    }

}
