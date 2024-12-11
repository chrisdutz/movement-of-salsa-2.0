package com.toddysoft.ui.migrationManager.migrators;

import java.util.Map;

public interface MigratorAware {

    void setMigrators(Map<String, Migrator> migrators);

}
