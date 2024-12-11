package com.toddysoft.ui.permissions.parser.terms;

import java.util.List;

public class VariableTermArray extends VariableTerm {

    private final int index;

    public VariableTermArray(String name, VariableTerm child, int index) {
        super(name, child);
        this.index = index;
    }

    public int getIndex() {
        return index;
    }

    @Override
    protected Object evaluate(Object value) {
        Object curVariableValue = value;
        if(curVariableValue.getClass().isArray()) {
            Object[] array = (Object[]) curVariableValue;
            if(array.length <= index) {
                throw new IllegalArgumentException("Index exceeds array size");
            }
            curVariableValue = array[index];
        } else if(curVariableValue instanceof List) {
            List<?> list = (List<?>) curVariableValue;
            if(list.size() >= index) {
                throw new IllegalArgumentException("Index exceeds list size");
            }
            curVariableValue = list.get(index);
        } else {
            throw new IllegalArgumentException("Variable term array contains invalid value");
        }
        if(getChild() != null) {
            return getChild().evaluate(getChild().getPropertyValue(curVariableValue));
        }
        return curVariableValue;
    }

}
