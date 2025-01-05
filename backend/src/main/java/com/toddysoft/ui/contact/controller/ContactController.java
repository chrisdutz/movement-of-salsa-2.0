package com.toddysoft.ui.contact.controller;

import com.toddysoft.ui.contact.model.ContactForm;
import com.toddysoft.ui.contact.service.ContactService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public void sendContactRequest(@RequestBody ContactForm contactForm) {
        contactService.sendContactRequest(contactForm);
    }

}
