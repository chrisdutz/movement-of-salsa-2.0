package com.toddysoft.ui.email.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfiguration {

    @Bean
    public JavaMailSender getJavaMailSender(@Value("${spring.mail.host}") String mailHost,
                                            @Value("${spring.mail.port}") int mailPort,
                                            @Value("${spring.mail.username}") String username,
                                            @Value("${spring.mail.password}") String password,
                                            @Value("${spring.mail.transport.protocol}") String transportProtocol,
                                            @Value("${spring.mail.smtp.auth}") boolean smtpAuth,
                                            @Value("${spring.mail.smtp.starttls.enable}") boolean smtpStarttlsEnable,
                                            @Value("${spring.mail.debug}") boolean debug) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);

        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", transportProtocol);
        props.put("mail.smtp.auth", smtpAuth);
        props.put("mail.smtp.starttls.enable", smtpStarttlsEnable);
        props.put("mail.debug", debug);

        return mailSender;
    }

}
