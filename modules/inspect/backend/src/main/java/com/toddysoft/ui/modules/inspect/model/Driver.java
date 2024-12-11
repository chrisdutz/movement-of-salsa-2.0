
package com.toddysoft.ui.modules.inspect.model;

import org.apache.plc4x.java.api.metadata.PlcDriverMetadata;

public class Driver {

    private final String code;
    private final String name;
    private final PlcDriverMetadata metadata;

    public Driver(String code, String name, PlcDriverMetadata metadata) {
        this.code = code;
        this.name = name;
        this.metadata = metadata;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public PlcDriverMetadata getMetadata() {
        return metadata;
    }

}
