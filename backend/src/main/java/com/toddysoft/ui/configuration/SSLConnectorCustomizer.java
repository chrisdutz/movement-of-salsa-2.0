package com.toddysoft.ui.configuration;

import com.toddysoft.ui.web.TomcatSSLContext;
import nl.altindag.ssl.SSLFactory;
import org.apache.catalina.connector.Connector;
import org.apache.coyote.http11.AbstractHttp11Protocol;
import org.apache.tomcat.util.net.SSLHostConfig;
import org.apache.tomcat.util.net.SSLHostConfigCertificate;
import org.apache.tomcat.util.net.SSLHostConfigCertificate.Type;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.context.annotation.Configuration;

//@Configuration
public class SSLConnectorCustomizer implements TomcatConnectorCustomizer {

    private final SSLFactory sslFactory;
    private final int port;

    public SSLConnectorCustomizer(SSLFactory sslFactory, @Value("${server.port}") int port) {
        this.sslFactory = sslFactory;
        this.port = port;
    }

    @Override
    public void customize(Connector connector) {
        connector.setScheme("https");
        connector.setSecure(true);
        connector.setPort(port);

        AbstractHttp11Protocol<?> protocol = (AbstractHttp11Protocol<?>) connector.getProtocolHandler();
        protocol.setSSLEnabled(true);

        SSLHostConfig sslHostConfig = new SSLHostConfig();
        SSLHostConfigCertificate certificate = new SSLHostConfigCertificate(sslHostConfig, Type.UNDEFINED);
        certificate.setSslContext(new TomcatSSLContext(sslFactory));
        sslHostConfig.addCertificate(certificate);
        protocol.addSslHostConfig(sslHostConfig);
    }

}