package com.toddysoft.ui.modules.inspect.model;

import java.util.Map;

public class DeviceAddress {

    private final String name;
    private final String address;
    private final String type;
    private final ArrayInfo[] arrayInfo;
    private final boolean readable;
    private final boolean writable;
    private final boolean subscribable;
    private final boolean publishable;
    private final Map<String, DeviceAddress> children;

    public DeviceAddress(String name, String address, String type, ArrayInfo[] arrayInfo, boolean readable, boolean writable, boolean subscribable, boolean publishable, Map<String, DeviceAddress> children) {
        this.name = name;
        this.address = address;
        this.type = type;
        this.arrayInfo = arrayInfo;
        this.readable = readable;
        this.writable = writable;
        this.subscribable = subscribable;
        this.publishable = publishable;
        this.children = children;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getType() {
        return type;
    }

    public ArrayInfo[] getArrayInfo() {
        return arrayInfo;
    }

    public boolean isReadable() {
        return readable;
    }

    public boolean isWritable() {
        return writable;
    }

    public boolean isSubscribable() {
        return subscribable;
    }

    public boolean isPublishable() {
        return publishable;
    }

    public Map<String, DeviceAddress> getChildren() {
        return children;
    }

    public static class ArrayInfo {
        private final long lowerBound;
        private final long upperBound;

        public ArrayInfo(long lowerBound, long upperBound) {
            this.lowerBound = lowerBound;
            this.upperBound = upperBound;
        }

        public long getLowerBound() {
            return lowerBound;
        }

        public long getUpperBound() {
            return upperBound;
        }

    }

}
