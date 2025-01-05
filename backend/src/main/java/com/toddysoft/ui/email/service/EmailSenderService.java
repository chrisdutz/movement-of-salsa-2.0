package com.toddysoft.ui.email.service;

import freemarker.template.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.*;

@Service
public class EmailSenderService {

    private static final Log log = LogFactory.getLog(EmailSenderService.class);

    private final String appBaseUrl;
    private final String defaultFromAddress;
    private final JavaMailSender mailSender;
    private final Configuration freemarkerConfig;

    public EmailSenderService(@Value("${app.baseUrl}") String appBaseUrl, @Value("${mail.default-from-address}") String defaultFromAddress, JavaMailSender mailSender, Configuration freemarkerConfig) {
        this.appBaseUrl = appBaseUrl;
        this.defaultFromAddress = defaultFromAddress;
        this.mailSender = mailSender;
        this.freemarkerConfig = freemarkerConfig;
    }

    public void sendEmail(final String toAddress, String templateName, Map<String, Object> varMap) {
        if(toAddress != null) {
            sendEmail(defaultFromAddress, toAddress, templateName, varMap);
        }
    }

    public void sendEmail(String fromAddress, final String toAddress, String templateName, Map<String, Object> varMap) {
        if(toAddress != null) {
            sendEmail(fromAddress, Collections.singletonList(toAddress), templateName, varMap);
        }
    }

    public void sendEmail(final List<String> toAddresses, String template, Map<String, Object> varMap) {
        sendEmail(defaultFromAddress, toAddresses, template, varMap);
    }

    public void sendEmail(final String fromAddress, final List<String> toAddresses, String template, Map<String, Object> varMap) {
        String emailSubject;
        String emailContent;
        try {
            // Get the template instance.
            final Template temp = freemarkerConfig.getTemplate("email/" + template + ".ftl");

            // Create the template output.
            final StringWriter out = new StringWriter();
            final Map<String, Object> enhancedVarMap = new HashMap<>(varMap);
            enhancedVarMap.put("appBaseUrl", appBaseUrl);
            temp.process(enhancedVarMap, out);

            // Extract the email content as String.
            // The first line contains the subject, the rest the mail content.
            final String emailData = out.toString();

            emailSubject = emailData.substring(0, emailData.indexOf("\n")).trim();
            emailContent = emailData.substring(emailSubject.length() + 1).trim();
            if (log.isDebugEnabled()) {
                log.info("... prepared.");
            }
        } catch (final TemplateException | IOException e) {
            if (log.isWarnEnabled()) {
                log.warn("Error creating email", e);
            }
            throw new RuntimeException("ERROR_CREATING_EMAIL", e);
        }

        // Send an email to the email specified in the request.
        final String finalEmailSubject = emailSubject;
        final String finalEmailContent = emailContent;
        final MimeMessagePreparator preparator = mimeMessage -> {
            final MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
            message.setTo(toAddresses.toArray(new String[0]));
            message.setFrom(fromAddress);
            message.setSubject(finalEmailSubject);
            message.setText(finalEmailContent, true);
        };

        // Send the email.
        try {
            if (log.isDebugEnabled()) {
                log.info("Sending email ...");
            }
            mailSender.send(preparator);
            if (log.isDebugEnabled()) {
                log.info("... sent.");
            }
        } catch (final Exception e) {
            if (log.isWarnEnabled()) {
                log.warn("Error sending email", e);
            }
            throw new RuntimeException("ERROR_SENDING_EMAIL", e);
        }
    }

}
