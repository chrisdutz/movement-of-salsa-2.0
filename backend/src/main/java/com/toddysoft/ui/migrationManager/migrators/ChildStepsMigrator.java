package com.toddysoft.ui.migrationManager.migrators;

import org.dom4j.Element;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

/**
 * Migrator that starts with the current element and then processes each child element in the configuration.
 */
public class ChildStepsMigrator implements Migrator, MigratorAware {

    protected Map<String, Migrator> migrators;

    @Override
    public void setMigrators(Map<String, Migrator> migrators) {
        this.migrators = migrators;
    }

    @Override
    public void migrate(Element configuration, String migrationRoot, DataSource dataSource) throws Exception {
        for(final Element curElement :
                (List<Element>) configuration.elements()) {
            final String elementName  = curElement.getName();
            final Migrator migrator = migrators.get(elementName);
            if(migrator != null) {
                migrator.migrate(curElement, migrationRoot, dataSource);
            } else {
                throw new RuntimeException("Could not find migrator for element '" + elementName + "'.");
            }
        }
    }

}
