package com.toddysoft.ui.migrationManager.model;

public class MigrationGroupData {

    private final String name;

    private final int version;

    public MigrationGroupData(String name, int version) {
        this.name = name;
        this.version = version;
    }

    public String getName() {
        return name;
    }

    public int getVersion() {
        return version;
    }

}
