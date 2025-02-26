package com.toddysoft.ui.modules.model;

public class FrontendModule {

    private final String type;
    private final String name;
    private final String icon;
    private final String routerUrl;
    private final String moduleUrl;
    private final String moduleComponentName;
    private final int sort;

    public FrontendModule(String type, String name, String icon, String routerUrl, String moduleUrl, String moduleComponentName, int sort) {
        this.type = type;
        this.name = name;
        this.icon = icon;
        this.routerUrl = routerUrl;
        this.moduleUrl = moduleUrl;
        this.moduleComponentName = moduleComponentName;
        this.sort = sort;
    }

    public String getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public String getIcon() {
        return icon;
    }

    public String getRouterUrl() {
        return routerUrl;
    }

    public String getModuleUrl() {
        return moduleUrl;
    }

    public String getModuleComponentName() {
        return moduleComponentName;
    }

    public int getSort() {
        return sort;
    }
}
