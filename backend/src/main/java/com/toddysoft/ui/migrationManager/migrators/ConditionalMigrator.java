package com.toddysoft.ui.migrationManager.migrators;

import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Configurable;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Special version of the child steps migrator that only processes an elements children if the table with
 * the name specified in the "table" attribute is NOT present.
 */
@Configurable
public class ConditionalMigrator extends ChildStepsMigrator {

    @Override
    public void migrate(Element configuration, String migrationRoot, DataSource dataSource) throws Exception {
        // Name of the table for which this step should be skipped, if it exists.
        final String checkTable = configuration.attributeValue("table");

        Connection connection = null;
        ResultSet tables = null;
        try {
            connection = dataSource.getConnection();
            final DatabaseMetaData metaData = connection.getMetaData();
            tables = metaData.getTables(null, null, checkTable, null);
            // If the table exists, execute the "exists" step.
            if (tables.next()) {
                final Element existsConfiguration = configuration.element("exists");
                if(existsConfiguration != null) {
                    super.migrate(existsConfiguration, migrationRoot, dataSource);
                }
            }
            // Otherwise execute the "does-not-exist" step.
            else {
                final Element doesNotExistConfiguration = configuration.element("does-not-exist");
                if(doesNotExistConfiguration != null) {
                    super.migrate(doesNotExistConfiguration, migrationRoot, dataSource);
                }
            }
        } catch (SQLException sqle) {
            throw new RuntimeException(
                    "Error checking table existence for schema-initialization in migration-plan '" +
                            migrationRoot + "/migration_plan.xml'");
        } finally {
            if (tables != null) {
                try {
                    tables.close();
                } catch (Exception e) {
                    // Ignore.
                }
            }
            if (connection != null) {
                try {
                    connection.close();
                } catch (Exception e) {
                    // Ignore.
                }
            }
        }
    }

}
