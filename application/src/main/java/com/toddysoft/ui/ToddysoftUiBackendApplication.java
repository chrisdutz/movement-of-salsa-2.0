package com.toddysoft.ui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

// The ErrorMvcAutoConfiguration would have added a second error handler.
@SpringBootApplication(exclude = {ErrorMvcAutoConfiguration.class})
@EnableJpaRepositories("com.toddysoft.ui")
public class ToddysoftUiBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ToddysoftUiBackendApplication.class, args);
    }

}
