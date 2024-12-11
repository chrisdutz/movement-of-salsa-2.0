
# Start PostgreSQL with Docker

docker pull postgres
docker run --name toddysoft-ui -e POSTGRES_PASSWORD=toddysoft -d postgres

# Links:

Good article on how to set up React + Spring Boot to use JWT authentication.
https://medium.com/@tericcabrel/implement-jwt-authentication-in-a-spring-boot-3-application-5839e4fd8fac

Good article on module federation:
https://software-engineering-corner.zuehlke.com/micro-frontend-module-federation-with-vite-for-react#heading-as-a-lazy-loaded-module

Helpful article on dynamically loading module via module federation:
https://medium.com/@lester.sconyers/dynamic-module-federation-with-vite-0bce2bfcc517

Master Thesis on what I'm working on:
https://webthesis.biblio.polito.it/secure/31061/1/tesi.pdf

Sharing redux state between modules:
https://dev.to/ibrahimshamma99/a-simplified-prospective-in-sharing-redux-store-between-federated-react-apps-1kgm
https://github.com/microsoft/redux-micro-frontend/wiki

## Competing products

RsLinx
Matrikon OPC Explorer
UaExpert




## Securing things

Generating self-signed certificates in pure Java:
https://medium.com/@lbroudoux/generate-self-signed-certificates-in-pure-java-83d3ad94b75

    import io.fabric8.kubernetes.api.model.Secret;
    import io.fabric8.kubernetes.api.model.SecretBuilder;
    import org.bouncycastle.asn1.ASN1Encodable;
    import org.bouncycastle.asn1.DERSequence;
    import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
    import org.bouncycastle.asn1.x509.BasicConstraints;
    import org.bouncycastle.asn1.x509.ExtendedKeyUsage;
    import org.bouncycastle.asn1.x509.Extension;
    import org.bouncycastle.asn1.x509.GeneralName;
    import org.bouncycastle.asn1.x509.KeyPurposeId;
    import org.bouncycastle.asn1.x509.KeyUsage;
    import org.bouncycastle.cert.X509CertificateHolder;
    import org.bouncycastle.cert.X509v3CertificateBuilder;
    import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
    import org.bouncycastle.jce.provider.BouncyCastleProvider;
    import org.bouncycastle.operator.ContentSigner;
    import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
    
    /**
     * Holds utility methods to manage Ingress params from specification.
     * @author laurent.broudoux@gmail.com
     */
    public class IngressSpecUtil {
    
        /**
         * Generate a Secret holding a self-signed certificate and key for Ingress tests purposes.
         * @param name The name of secret to generate
         * @param labels The labels to add to Secret
         * @param host The host name to generate a cert and key for.
         * @return The created Secret to persist using Kube apis.
         */
        public static Secret generateSelfSignedCertificateSecret(String name, Map<String, String> labels, String host) {
            Security.addProvider(new BouncyCastleProvider());
    
            X500Principal subject = new X500Principal("CN=" + host);
            X500Principal signedByPrincipal = subject;
            KeyPair keyPair = generateKeyPair();
            KeyPair signedByKeyPair = keyPair;
    
            long notBefore = System.currentTimeMillis();
            long notAfter = notBefore + (1000L * 3600L * 24 * 365);
    
            ASN1Encodable[] encodableAltNames = new ASN1Encodable[]{new GeneralName(GeneralName.dNSName, host)};
            KeyPurposeId[] purposes = new KeyPurposeId[]{KeyPurposeId.id_kp_serverAuth, KeyPurposeId.id_kp_clientAuth};
    
            X509v3CertificateBuilder certBuilder = new JcaX509v3CertificateBuilder(signedByPrincipal,
                  BigInteger.ONE, new Date(notBefore), new Date(notAfter), subject, keyPair.getPublic());
    
            try {
               certBuilder.addExtension(Extension.basicConstraints, true, new BasicConstraints(false));
               certBuilder.addExtension(Extension.keyUsage, true, new KeyUsage(KeyUsage.digitalSignature + KeyUsage.keyEncipherment));
               certBuilder.addExtension(Extension.extendedKeyUsage, false, new ExtendedKeyUsage(purposes));
               certBuilder.addExtension(Extension.subjectAlternativeName, false, new DERSequence(encodableAltNames));
    
               final ContentSigner signer = new JcaContentSignerBuilder(("SHA256withRSA")).build(signedByKeyPair.getPrivate());
               X509CertificateHolder certHolder = certBuilder.build(signer);
    
               return new SecretBuilder()
                     .withNewMetadata()
                        .withName(name)
                        .addToLabels(labels)
                     .endMetadata()
                     .withType("kubernetes.io/tls")
                     .addToStringData("tls.key", getPrivateKeyPkcs1Pem(keyPair))
                     .addToStringData("tls.crt", getCertificatePem(certHolder))
                     .build();
            } catch (Exception e) {
               Logger.getLogger(IngressSpecUtil.class).error(e.getMessage());
               throw new AssertionError(e.getMessage());
            }
        }
    
        private static KeyPair generateKeyPair() {
            try {
                KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
                keyPairGenerator.initialize(2048, new SecureRandom());
                return keyPairGenerator.generateKeyPair();
            } catch (GeneralSecurityException var2) {
                throw new AssertionError(var2);
            }
        }

    }

Demo of using these self-signed certificates in clients:

    import javax.net.ssl.*;
    import java.security.cert.X509Certificate;
    import java.util.Scanner;
    
    public class DynamicSSLClient {
        public static void main(String[] args) throws Exception {
            TrustManager[] trustAllCertificates = new TrustManager[] {
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() { return null; }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(X509Certificate[] certs, String authType) throws CertificateException {
                        // Print certificate details
                        for (X509Certificate cert : certs) {
                            System.out.println("Server certificate:");
                            System.out.println("  Subject: " + cert.getSubjectDN());
                            System.out.println("  Issuer: " + cert.getIssuerDN());
                        }
                        // Prompt the user to accept the certificate
                        Scanner scanner = new Scanner(System.in);
                        System.out.print("Do you want to accept this certificate? (yes/no): ");
                        String response = scanner.nextLine();
                        if (!response.equalsIgnoreCase("yes")) {
                            throw new CertificateException("Server certificate not accepted");
                        }
                    }
                }
            };
    
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAllCertificates, new java.security.SecureRandom());
    
            TSSLTransportParameters params = new TSSLTransportParameters();
            params.setTrustStore(null, null); // Ignore the truststore
            params.setSSLContext(sslContext);
    
            TTransport transport = TSSLTransportFactory.getClientSocket("localhost", 9090, 0, params);
            TProtocol protocol = new TBinaryProtocol(transport);
            MyService.Client client = new MyService.Client(protocol);
    
            // Use the client
            client.ping();
            transport.close();
        }
    }