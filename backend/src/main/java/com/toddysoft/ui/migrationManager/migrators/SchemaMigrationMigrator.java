package com.toddysoft.ui.migrationManager.migrators;

import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseFactory;
import liquibase.database.jvm.JdbcConnection;
import liquibase.integration.spring.SpringResourceAccessor;
import liquibase.resource.InputStreamList;
import liquibase.resource.ResourceAccessor;
import org.dom4j.Element;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.sql.Connection;
import java.util.Enumeration;
import java.util.List;
import java.util.SortedSet;
import java.util.Vector;

/**
 * Uses liquibase to perform database migration steps by executing the script specified by the "src" attribute.
 */
public class SchemaMigrationMigrator implements Migrator, ResourceLoaderAware {

    protected ResourceLoader resourceLoader;

    //////////////////////////////////////////////
    // Spring property methods.
    //////////////////////////////////////////////

    public void setResourceLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    //////////////////////////////////////////////
    // Migrator methods.
    //////////////////////////////////////////////

    public void migrate(Element configuration, String migrationRoot, DataSource dataSource) throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            if (configuration.attributeValue("src") != null) {
                final String schemaResource =
                        migrationRoot + configuration.attributeValue("src");

                final Liquibase liquibase = new Liquibase(
                        schemaResource, new SpringResourceAccessor(resourceLoader),
                        DatabaseFactory.getInstance().findCorrectDatabaseImplementation(
                                new JdbcConnection(connection)));
                liquibase.update((String) null);
            }
            // If the src-attribute was not provided, then a script has to be
            // executed, depending on the type of database.
            else {
                final Database database =
                        DatabaseFactory.getInstance().findCorrectDatabaseImplementation(
                                new JdbcConnection(connection));
                final String dbTypeName = database.getDatabaseProductName();
                boolean executedMigration = false;
                for (final Element databaseElement : configuration.elements("database")) {
                    if (databaseElement.attributeValue("type").equalsIgnoreCase(dbTypeName)) {
                        final String schemaResource =
                                migrationRoot + databaseElement.attributeValue("src");

                        final Liquibase liquibase = new Liquibase(
                                schemaResource, new SpringResourceAccessor(resourceLoader), database);
                        liquibase.update((String) null);

                        executedMigration = true;
                        break;
                    }
                }
                if (!executedMigration) {
                    throw new RuntimeException(
                            "No script for database-dependent schema-migration for database type: " +
                                    dbTypeName + " in migration-plan '" + migrationRoot +
                                    "/migration_plan.xml'");
                }
            }
        }
    }


    // This code was "borrowed" from the SpringLiquiBase class ...
    public static class SpringResourceOpener implements ResourceAccessor {
        private final String parentFile;
        private final ResourceLoader resourceLoader;

        public SpringResourceOpener(String parentFile, ResourceLoader resourceLoader) {
            this.parentFile = parentFile;
            this.resourceLoader = resourceLoader;
        }

        @Override
        public InputStreamList openStreams(String relativeTo, String streamPath) throws IOException {
            InputStreamList inputStreams = new InputStreamList();
            if(streamPath.startsWith("www.liquibase.org")) {
                try {
                    inputStreams.add(new URI("classpath:" + streamPath), getResourceAsStream("classpath:" + streamPath));
                } catch (URISyntaxException e) {
                    throw new IOException("Error getting input stream", e);
                }
            }
            return inputStreams;
        }

        @Override
        public InputStream openStream(String relativeTo, String streamPath) throws IOException {
            return getResourceAsStream(streamPath);
        }

        @Override
        public SortedSet<String> list(String relativeTo, String path, boolean recursive, boolean includeFiles, boolean includeDirectories) throws IOException {
            return null;
        }

        @Override
        public List<String> describeLocations() {
            return null;
        }

        @Override
        public List<liquibase.resource.Resource> search(String path, boolean recursive) throws IOException {
            return List.of();
        }

        @Override
        public List<liquibase.resource.Resource> getAll(String path) throws IOException {
            return List.of();
        }

        @Override
        public void close() throws Exception {

        }

        private InputStream getResourceAsStream(String file) throws IOException {
            Resource resource = getResource(file);

            return resource.getInputStream();
        }

        private Enumeration<URL> getResources(String packageName) throws IOException {
            Vector<URL> tmp = new Vector<URL>();

            tmp.add(getResource(packageName).getURL());

            return tmp.elements();
        }

        private Resource getResource(String file) {
            return resourceLoader.getResource(adjustClasspath(file));
        }

        private String adjustClasspath(String file) {
            return isClasspathPrefixPresent(parentFile) && !isClasspathPrefixPresent(file)
                    ? ResourceLoader.CLASSPATH_URL_PREFIX + file
                    : file;
        }

        private boolean isClasspathPrefixPresent(String file) {
            return file.startsWith(ResourceLoader.CLASSPATH_URL_PREFIX);
        }

        private ClassLoader toClassLoader() {
            return resourceLoader.getClassLoader();
        }
    }

}
