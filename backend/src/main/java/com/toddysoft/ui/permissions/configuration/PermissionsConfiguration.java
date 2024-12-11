package com.toddysoft.ui.permissions.configuration;

import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.repository.PermissionRepository;
import com.toddysoft.ui.permissions.service.PermissionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Configuration
public class PermissionsConfiguration {

    private final Logger logger = LoggerFactory.getLogger(PermissionsConfiguration.class);

    @Bean
    public PermissionService permissionService(PermissionRepository permissionRepository) throws IOException {
        ClassLoader cl = this.getClass().getClassLoader();
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(cl);
        Resource[] permissionFunctionDescriptors = resolver.getResources("classpath*:/META-INF/permission-functions.properties");

        logger.info("------------------------------------------------------------------------------------");
        logger.info(" Initializing Permission Service");
        logger.info("------------------------------------------------------------------------------------");

        // Initialize a map of all configured permission functions.
        Map<String, TermFunction<?>> functions = new HashMap<>();
        final ClassLoader classLoader = getClass().getClassLoader();
        for(final Resource permissionFunctionDescriptor : permissionFunctionDescriptors) {
            try {
                final Properties permittionFunctionProperties = new Properties();
                permittionFunctionProperties.load(permissionFunctionDescriptor.getInputStream());

                for(final Object curKey : permittionFunctionProperties.keySet()) {
                    final String elementName = (String) curKey;
                    final String functionClassName = permittionFunctionProperties.getProperty(elementName);
                    try {
                        final Class<?> functionClass = classLoader.loadClass(functionClassName);
                        final Object functionInstance = functionClass.getConstructor().newInstance();
/*                        if(migratorInstance instanceof ResourceLoaderAware) {
                            ((Reso<urceLoaderAware) migratorInstance).setResourceLoader(resourceLoader);
                        }*/
                        if(functionInstance instanceof TermFunction) {
                            functions.put(elementName, (TermFunction<?>) functionInstance);
                            logger.info(" found function for element '" + elementName + "'");
                        } else {
                            throw new RuntimeException("TermFunction implementation with name '" + functionClassName +
                                    "' doesn't implement TermFunction interface");
                        }
                    } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | NoSuchMethodException |
                             InvocationTargetException e) {
                        throw new RuntimeException(
                                "Could not instantiate TermFunction implementation with name '" +
                                        functionClassName + "'.", e);
                    }
                }
            } catch (IOException e) {
                throw new RuntimeException("Error loading migrator descriptor " +
                        permissionFunctionDescriptor.getFilename());
            }
        }

        return new PermissionService(permissionRepository, functions);
    }

}
