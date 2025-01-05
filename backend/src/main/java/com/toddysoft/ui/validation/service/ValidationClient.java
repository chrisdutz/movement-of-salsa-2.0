package com.toddysoft.ui.validation.service;

import com.toddysoft.ui.validation.entity.ValidationRequest;

public interface ValidationClient {

    String getModuleName();
    void handleValidatedRequest(ValidationRequest request);

}
