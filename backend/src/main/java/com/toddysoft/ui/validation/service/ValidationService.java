package com.toddysoft.ui.validation.service;

import com.toddysoft.ui.validation.entity.ValidationRequest;
import com.toddysoft.ui.validation.exception.ErrorExecutingValidationException;
import com.toddysoft.ui.validation.exception.InvalidValidationTokenException;
import com.toddysoft.ui.validation.repository.ValidationRequestRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ValidationService {

    private static final Log log = LogFactory.getLog(ValidationService.class);

    private final ValidationRequestRepository validationRequestRepository;
    private final int maxAgeInMinutes;
    private final List<ValidationClient> validationClients;

    public ValidationService(ValidationRequestRepository validationRequestRepository, @Value("${validation.max-token-age}") int maxAgeInMinutes, List<ValidationClient> validationClients) {
        this.validationRequestRepository = validationRequestRepository;
        this.maxAgeInMinutes = maxAgeInMinutes;
        this.validationClients = validationClients;
    }

    @Transactional
    public ValidationRequest createValidationRequest(String moduleName, Object payload) {
        final ValidationRequest validationRequest = new ValidationRequest();
        validationRequest.setModuleName(moduleName);
        validationRequest.setTokenCode(UUID.randomUUID().toString());
        validationRequest.setCreated(Calendar.getInstance());
        validationRequest.setPayload(payload);

        validationRequestRepository.save(validationRequest);

        return validationRequest;
    }

    @Transactional
    public ValidationRequest validateValidationRequest(String tokenCode) throws InvalidValidationTokenException, ErrorExecutingValidationException {

        // Fetch matching validation requests from the database.
        Optional<ValidationRequest> byTokenKeyAndTokenCode =
                validationRequestRepository.findByTokenCode(tokenCode);

        // If at least one matching token was found, return true
        // and make sure the token is deleted.
        if (byTokenKeyAndTokenCode.isEmpty()) {
            throw new InvalidValidationTokenException();
        }

        ValidationRequest validationRequest = byTokenKeyAndTokenCode.get();

        // Call the validation client with the given name to handle the request.
        for (ValidationClient validationClient : validationClients) {
            if(validationClient.getModuleName().equals(validationRequest.getModuleName())) {
                try {
                    validationClient.handleValidatedRequest(validationRequest);
                } catch (Exception e) {
                    throw new ErrorExecutingValidationException(
                            "Error handling validation request by " + validationRequest.getModuleName(), e);
                }
            }
        }

        validationRequestRepository.delete(validationRequest);

        return validationRequest;
    }

    @Transactional
    public void cleanExpiredRequests() {
        // Calculate the maximum valid creation date based on the maxAgeInMinutes parameter.
        final Calendar expirationTime = Calendar.getInstance();
        expirationTime.add(Calendar.MINUTE, maxAgeInMinutes * -1);

        // Delete all the validation requests who were created before that date.
        validationRequestRepository.deleteCreatedBefore(expirationTime);
    }

}
