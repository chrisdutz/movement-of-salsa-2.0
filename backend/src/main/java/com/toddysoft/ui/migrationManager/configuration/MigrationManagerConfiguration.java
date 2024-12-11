package com.toddysoft.ui.migrationManager.configuration;

import com.toddysoft.ui.migrationManager.migrators.ChildStepsMigrator;
import com.toddysoft.ui.migrationManager.migrators.Migrator;
import com.toddysoft.ui.migrationManager.migrators.MigratorAware;
import com.toddysoft.ui.migrationManager.model.MigrationGroupData;
import liquibase.integration.spring.SpringLiquibase;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.nocrala.tools.texttablefmt.BorderStyle;
import org.nocrala.tools.texttablefmt.CellStyle;
import org.nocrala.tools.texttablefmt.ShownBorders;
import org.nocrala.tools.texttablefmt.Table;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;

@Configuration
public class MigrationManagerConfiguration {

    private final Logger logger = LoggerFactory.getLogger(MigrationManagerConfiguration.class);

    @Bean
    public SpringLiquibase migrationManager(DataSource dataSource) throws IOException {
        ClassLoader cl = this.getClass().getClassLoader();
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(cl);
        Resource[] migratorDescriptors = resolver.getResources("classpath*:/META-INF/migrator.properties");
        Resource[] migrationGroupDescriptors = resolver.getResources("classpath*:/META-INF/migration/*/migration-group.properties");

        logger.info("------------------------------------------------------------------------------------");
        logger.info(" Initializing Migration Manager");
        logger.info("------------------------------------------------------------------------------------");

        // Initialize a map of all configured migrators.
        Map<String, Migrator> migrators = new HashMap<>();
        final ClassLoader classLoader = getClass().getClassLoader();
        for(final Resource curMigratorDescriptor : migratorDescriptors) {
            try {
                final Properties migratorProperties = new Properties();
                migratorProperties.load(curMigratorDescriptor.getInputStream());

                for(final Object curKey : migratorProperties.keySet()) {
                    final String elementName = (String) curKey;
                    final String migratorClassName = migratorProperties.getProperty(elementName);
                    try {
                        final Class<?> migratorClass = classLoader.loadClass(migratorClassName);
                        final Object migratorInstance = migratorClass.getConstructor().newInstance();
/*                        if(migratorInstance instanceof ResourceLoaderAware) {
                            ((Reso<urceLoaderAware) migratorInstance).setResourceLoader(resourceLoader);
                        }*/
                        if(migratorInstance instanceof Migrator) {
                            migrators.put(elementName, (Migrator) migratorInstance);
                            logger.info(" found migrator for element '" + elementName + "'");
                        } else {
                            throw new RuntimeException("Migrator implementation with name '" + migratorClassName +
                                    "' doesn't implement de.cware.cweb.services.migrationManager.migrators.Migrator");
                        }
                    } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | NoSuchMethodException |
                             InvocationTargetException e) {
                        throw new RuntimeException(
                                "Could not instantiate migrator implementation with name '" +
                                        migratorClassName + "'.", e);
                    }
                }
            } catch (IOException e) {
                throw new RuntimeException("Error loading migrator descriptor " +
                        curMigratorDescriptor.getFilename());
            }
        }

        // Initialize any "MigratorAware" Migrators.
        for(final Migrator migrator : migrators.values()) {
            if(migrator instanceof MigratorAware) {
                ((MigratorAware) migrator).setMigrators(migrators);
            }
        }

        Map<Integer, List<MigrationGroupData>> migrationGroups = new TreeMap<>();

        logger.info(" Detected Migration Groups:");
        logger.info("------------------------------------------------------------------------------------");
        final CellStyle numberStyle = new CellStyle(CellStyle.HorizontalAlign.RIGHT);
        final Table migrationGroupsTable = new Table(3, BorderStyle.CLASSIC, ShownBorders.ALL);
        migrationGroupsTable.addCell("Name");
        migrationGroupsTable.addCell("Priority", numberStyle);
        migrationGroupsTable.addCell("Version", numberStyle);

        for(final Resource curMigrationGroupDescriptor : migrationGroupDescriptors) {
            try {
                final Properties migrationGroupProperties = new Properties();
                migrationGroupProperties.load(curMigrationGroupDescriptor.getInputStream());

                final int priority = Integer.parseInt(migrationGroupProperties.getProperty("priority"));
                final String name = migrationGroupProperties.getProperty("name");
                final int version = Integer.parseInt(migrationGroupProperties.getProperty("version"));

                migrationGroupsTable.addCell(name);
                migrationGroupsTable.addCell(Integer.toString(priority));
                migrationGroupsTable.addCell(Integer.toString(version));

                final MigrationGroupData migrationGroupData = new MigrationGroupData(name, version);

                if(!migrationGroups.containsKey(priority)) {
                    migrationGroups.put(priority, new ArrayList<>());
                }
                migrationGroups.get(priority).add(migrationGroupData);
            } catch (IOException e) {
                throw new RuntimeException("Error loading descriptor for migration-group " +
                        curMigrationGroupDescriptor.getFilename());
            }
        }
        logger.info("\n{}", migrationGroupsTable.render());

        logger.info(" Executing Migration Checks:");

        final Table table = new Table(4, BorderStyle.CLASSIC, ShownBorders.ALL);
        table.addCell("Migration Group Name");
        table.addCell("Installed Version");
        table.addCell("Application Version");
        table.addCell("Operation");

        for(final int priority : migrationGroups.keySet()) {
            final List<MigrationGroupData> priorityClass = migrationGroups.get(priority);
            for(final MigrationGroupData migrationGroupData : priorityClass) {
                int installedVersion = getCurrentlyInstalledMigrationGroupVersion(migrationGroupData.getName(), dataSource);

                table.addCell(migrationGroupData.getName());
                table.addCell(Integer.toString(installedVersion), numberStyle);
                table.addCell(Integer.toString(migrationGroupData.getVersion()), numberStyle);

                // If the installed version is smaller than the current version,
                // perform the migration up to the current version.
                if(installedVersion < migrationGroupData.getVersion()) {
                    updateMigrationGroup(migrationGroupData.getName(), installedVersion, migrationGroupData.getVersion(), resolver, dataSource, migrators);
                    table.addCell("Updated");
                }

                // If the current version is smaller than the installed version,
                // throw an exception as we don't support downgrading.
                else if(installedVersion > migrationGroupData.getVersion()) {
                    throw new RuntimeException("Installed version of migration-group '" +
                            migrationGroupData.getName() + "' is '" + installedVersion +
                            "' which is greater than the current version of '" + migrationGroupData.getVersion() +
                            "'. Downgrading is not supported.");
                }

                // If the current version equals the installed one, do nothing.
                else {
                    table.addCell("None");
                }
            }
        }

        logger.info("\n{}", table.render());
        logger.info("------------------------------------------------------------------------------------");
        logger.info(" Finished Migration Checks");
        logger.info("------------------------------------------------------------------------------------");

        return null;
    }

    //////////////////////////////////////////////
    // Internal Logic
    //////////////////////////////////////////////

    protected int getCurrentlyInstalledMigrationGroupVersion(final String migrationGroupName, DataSource dataSource)
    {
        final JdbcTemplate template = new JdbcTemplate(dataSource);
        try {
            Integer value = template.queryForObject(
                    "SELECT MAX(version) FROM MIGR_MIGRATION_GROUP_DATA WHERE name = ?",
                    (resultSet, i) -> resultSet.getInt(1), migrationGroupName);
            if(value != null) {
                return value;
            }
            return -1;
        } catch(Exception e) {
            return -1;
        }
    }

    protected void updateMigrationGroup(final String migrationGroupName, final int fromVersion, final int toVersion, ResourcePatternResolver resolver, DataSource dataSource, Map<String, Migrator> migrators)
    {
        // Take care of the moduleRegistries model.
        for(int curVersion = Math.max(fromVersion + 1, 1); curVersion <= toVersion; curVersion++) {
            // Load the migration-plan
            final String migrationRoot = "classpath:/META-INF/migration/" + migrationGroupName + "/" +
                    curVersion + "/";
            final Resource migrationPlanRes = resolver.getResource(migrationRoot + "migration_plan.xml");

            // Actually perform the migration-plan.
            executeMigrationPlan(migrationRoot, migrationPlanRes, dataSource, migrators);

            // Update the status information in the migration manager tables.
            final JdbcTemplate template = new JdbcTemplate(dataSource);
            if(curVersion == 1) {
                // Create a new entry for the given module.
                template.update("INSERT INTO MIGR_MIGRATION_GROUP_DATA (name, version) VALUES (?,?)",
                        migrationGroupName, curVersion);
            } else {
                // Update the version information in the database.
                template.update("UPDATE MIGR_MIGRATION_GROUP_DATA SET version=? WHERE name=?",
                        curVersion, migrationGroupName);
            }
        }
    }

    protected void executeMigrationPlan(final String migrationRoot,
                                        final Resource migrationPlan,
                                        DataSource dataSource,
                                        Map<String, Migrator> migrators)
    {
        try {
            // Parse the migration-plan document.
            final SAXReader reader = new SAXReader();
            final Document migrationPlanDoc = reader.read(migrationPlan.getInputStream());
            if(migrationPlanDoc != null) {
                final Element rootElement = migrationPlanDoc.getRootElement();
                final ChildStepsMigrator baseMigrator = new ChildStepsMigrator();
                baseMigrator.setMigrators(migrators);
                baseMigrator.migrate(rootElement, migrationRoot, dataSource);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
