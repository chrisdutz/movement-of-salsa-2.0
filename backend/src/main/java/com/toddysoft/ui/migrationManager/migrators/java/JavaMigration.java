package com.toddysoft.ui.migrationManager.migrators.java;

import org.dom4j.Element;

import javax.sql.DataSource;

public interface JavaMigration {

    void configure(Element config);
    void migrate(DataSource dataSource);

}
