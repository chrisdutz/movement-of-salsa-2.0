package com.toddysoft.ui.configuration;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//@Configuration
public class ServerConfig {

    @Bean
    public ServletWebServerFactory servletContainer(SSLConnectorCustomizer sslConnectorCustomizer) {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        tomcat.addConnectorCustomizers(sslConnectorCustomizer);
        return tomcat;
    }

}