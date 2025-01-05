package com.toddysoft.ui.validation.entity;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.toddysoft.ui.validation.utils.JsonToBlobConverter;
import jakarta.persistence.*;

import java.util.Calendar;

@Entity
@Table(name = "val_validation_token")
public class ValidationRequest {

    public static final int MAX_PAYLOAD_SIZE = 1024;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected long id;

    protected String moduleName;
    protected String tokenCode;
    @Temporal(TemporalType.TIMESTAMP)
    protected Calendar created;
    @Lob
    @Column(length = MAX_PAYLOAD_SIZE)
    @Convert(converter = JsonToBlobConverter.class)
    @JsonTypeInfo(
            use = JsonTypeInfo.Id.CLASS,
            include = JsonTypeInfo.As.PROPERTY,
            property = "@type"
    )
    protected Object payload;

    public ValidationRequest() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String module) {
        this.moduleName = module;
    }

    public String getTokenCode() {
        return tokenCode;
    }

    public void setTokenCode(String tokenCode) {
        this.tokenCode = tokenCode;
    }

    public Calendar getCreated() {
        return created;
    }

    public void setCreated(Calendar created) {
        this.created = created;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}
