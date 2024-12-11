package com.toddysoft.ui.permissions.parser.terms;

import com.toddysoft.ui.permissions.api.Term;
import org.apache.commons.beanutils.PropertyUtils;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;

public class VariableTerm  {

    private final String name;
    private final VariableTerm child;

    public VariableTerm(String name, VariableTerm child) {
        this.name = name;
        this.child = child;
    }

    public String getName() {
        return name;
    }

    public VariableTerm getChild() {
        return child;
    }

    protected Object evaluate(Object value) {
        if(child != null) {
            return child.evaluate(getPropertyValue(value));
        }
        return value;
    }

    protected Object getPropertyValue(Object parent) {
        try {
            return PropertyUtils.getSimpleProperty(parent, name);
        } catch (InvocationTargetException | IllegalAccessException e) {
            throw new RuntimeException("Couldn't access property " + name + " of type " + parent.getClass().getName());
        } catch (NoSuchMethodException e) {
            throw new RuntimeException("Property " + name + " not found in type " + parent.getClass().getName());
        }
    }

    public static class VariableTermHolder implements Term<Object> {
        private final VariableTerm term;

        public VariableTermHolder(VariableTerm term) {
            this.term = term;
        }

        public VariableTerm getTerm() {
            return term;
        }

        @Override
        public Object evaluate(Map<String, Object> context) {
            return null;
        }
    }

}
