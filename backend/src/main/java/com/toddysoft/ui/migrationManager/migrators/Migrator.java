package com.toddysoft.ui.migrationManager.migrators;

import org.dom4j.Element;

import javax.sql.DataSource;

public interface Migrator {

    void migrate(Element configuration, String migrationRoot, DataSource dataSource) throws Exception;

}
