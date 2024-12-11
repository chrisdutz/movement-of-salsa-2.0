
package com.toddysoft.ui.websocket.event;

public abstract class UiApplicationEvent<T> extends org.springframework.context.ApplicationEvent {

    private final String moduleName;
    private final String actionName;

    public UiApplicationEvent(String moduleName, String actionName, T source) {
        super(source);
        this.moduleName = moduleName;
        this.actionName = actionName;
    }

    public String getModuleName() {
        return moduleName;
    }

    public String getActionName() {
        return actionName;
    }

    @Override
    public T getSource() {
        // We're only accepting objects of type T, so in this case it's safe to cast.
        //noinspection unchecked
        return (T) super.getSource();
    }

}
