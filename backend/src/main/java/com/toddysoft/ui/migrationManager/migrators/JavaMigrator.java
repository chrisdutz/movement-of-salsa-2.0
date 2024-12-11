package com.toddysoft.ui.migrationManager.migrators;

import com.toddysoft.ui.migrationManager.migrators.java.JavaMigration;
import org.dom4j.Element;

import javax.sql.DataSource;

/**
 * Executes a JavaMigration instance provided by the "class" parameter.
 */
public class JavaMigrator implements Migrator {

    @Override
    public void migrate(Element configuration, String migrationRoot, DataSource dataSource) throws Exception {
        final Class<?> migrationClass = this.getClass().getClassLoader().loadClass(
                configuration.attributeValue("class"));
        final JavaMigration migrationInstance =
                (JavaMigration) migrationClass.getConstructor().newInstance();
        migrationInstance.configure(configuration);
        migrationInstance.migrate(dataSource);
    }

}
