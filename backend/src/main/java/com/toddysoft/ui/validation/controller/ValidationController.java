package com.toddysoft.ui.validation.controller;

import com.toddysoft.ui.validation.entity.ValidationRequest;
import com.toddysoft.ui.validation.exception.ErrorExecutingValidationException;
import com.toddysoft.ui.validation.exception.InvalidValidationTokenException;
import com.toddysoft.ui.validation.service.ValidationService;
import freemarker.template.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/validation")
public class ValidationController {

    private final ValidationService service;
    private final Configuration freemarkerConfig;
    private final String appBaseUrl;

    public ValidationController(ValidationService service, Configuration freemarkerConfig, @Value("${app.baseUrl}") String appBaseUrl) {
        this.service = service;
        this.freemarkerConfig = freemarkerConfig;
        this.appBaseUrl = appBaseUrl;
    }

    @GetMapping(produces = "text/html")
    public ResponseEntity<String> validate(@RequestParam("token") String token) {
        try {
            ValidationRequest validationRequest = service.validateValidationRequest(token);
            return generateResponse(validationRequest.getModuleName() + "-success", HttpStatus.OK, validationRequest);
        } catch (InvalidValidationTokenException e) {
            return generateResponse("failure", HttpStatus.BAD_REQUEST, null);
        } catch (ErrorExecutingValidationException e) {
            return generateResponse("failure", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    protected ResponseEntity<String> generateResponse(String templateName, HttpStatus httpStatus, ValidationRequest validationRequest) {
        try {
            final Template temp = freemarkerConfig.getTemplate("validation/" + templateName + ".ftl");

            // Create the template output.
            final StringWriter out = new StringWriter();
            final Map<String, Object> varMap = new HashMap<>();
            if(validationRequest != null) {
                varMap.put("validationRequest", validationRequest);
            }
            varMap.put("appBaseUrl", appBaseUrl);
            varMap.put("httpStatus", httpStatus);
            temp.process(varMap, out);

            return ResponseEntity.status(httpStatus).body(out.toString());
        } catch (IOException | TemplateException e) {
            throw new RuntimeException(e);
        }
    }

}
