
package com.toddysoft.ui.configuration;

import org.apache.plc4x.java.api.PlcDriverManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Plc4xConfiguration {

    @Bean
    public PlcDriverManager driverManager() {
        return PlcDriverManager.getDefault();
    }

}
