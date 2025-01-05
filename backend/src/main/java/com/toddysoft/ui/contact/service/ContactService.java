package com.toddysoft.ui.contact.service;

import com.toddysoft.ui.contact.model.ContactForm;
import com.toddysoft.ui.email.service.EmailSenderService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ContactService {

    private final EmailSenderService emailSenderService;
    private final String defaultFromAddress;

    public ContactService(EmailSenderService emailSenderService, @Value("${mail.default-from-address}") String defaultFromAddress) {
        this.emailSenderService = emailSenderService;
        this.defaultFromAddress = defaultFromAddress;
    }

    public void sendContactRequest(ContactForm contactForm) {
        Map<String, Object> varMap = new HashMap<>();
        varMap.put("contactForm", contactForm);

        // Send email to movement-of-salsa
        emailSenderService.sendEmail(defaultFromAddress, "contact-request", varMap);

        // Send copy to the author
        emailSenderService.sendEmail(contactForm.getEmail(), "contact-request", varMap);
    }

}
