package com.toddysoft.ui.web;

import nl.altindag.ssl.SSLFactory;
import org.apache.tomcat.util.net.SSLContext;

import javax.net.ssl.KeyManager;
import javax.net.ssl.SSLEngine;
import javax.net.ssl.SSLParameters;
import javax.net.ssl.SSLServerSocketFactory;
import javax.net.ssl.SSLSessionContext;
import javax.net.ssl.TrustManager;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;

public final class TomcatSSLContext implements SSLContext {

    private final SSLFactory sslFactory;

    public TomcatSSLContext(SSLFactory sslFactory) {
        this.sslFactory = sslFactory;
    }

    @Override
    public void init(KeyManager[] kms, TrustManager[] tms, SecureRandom sr) {
        // not needed to initialize as it is already initialized
    }

    @Override
    public void destroy() {

    }

    @Override
    public SSLSessionContext getServerSessionContext() {
        return sslFactory.getSslContext().getServerSessionContext();
    }

    @Override
    public SSLEngine createSSLEngine() {
        return sslFactory.getSSLEngine();
    }

    @Override
    public SSLServerSocketFactory getServerSocketFactory() {
        return sslFactory.getSslServerSocketFactory();
    }

    @Override
    public SSLParameters getSupportedSSLParameters() {
        return sslFactory.getSslParameters();
    }

    @Override
    public X509Certificate[] getCertificateChain(String alias) {
        return sslFactory.getKeyManager()
                .map(keyManager -> keyManager.getCertificateChain(alias))
                .orElseThrow();
    }

    @Override
    public X509Certificate[] getAcceptedIssuers() {
        return sslFactory.getTrustedCertificates().toArray(new X509Certificate[0]);
    }

}